<script>
	import { Info } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Groups from './components/Groups.svelte';
	import MyGroup from './components/MyGroup.svelte';
	import TrixEditor from '$lib/components/TrixEditor.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import IdeaGenerator from './components/IdeaGenerator.svelte';
	import { notifications } from '$lib/stores';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let event = $state(data.event);
	let judgingCriteria = $state(data.event.event_criteria);

	let info = $state({
		isLoading: false,
		title: '',
		description: '',
		show: (title = '', description = '') => {
			infoModal.showModal();
			if (!title.length && !description.length) {
				info.isLoading = true;
				return;
			}
			info.title = title;
			info.description = description;
		},
		hide: () => {
			info.isLoading = false;
			info.title = '';
			info.description = '';
			infoModal.close();
		}
	});

	let group = $state(data.group);

	let myGroupEditorValue = $state(
		group?.submission ||
			`<ul>
			<li>Attach your submissions here</li>
			<li>Make sure to write some text right after attaching a file to this editor.</li>
			<li>For example, you can write a summary of your documents here.</li>
			<li>Please note that you can update your submission at any time.</li>
			<ul>`
	);

	const handleGroupSubmit = async (e) => {
		e.preventDefault();
		//show info modal
		info.show();
		const req = await fetch('/api/event/group?id=' + group.id, {
			method: 'POST',
			body: JSON.stringify({ data: { submission: myGroupEditorValue } })
		});
		const res = await req.json();
		if (res.success) {
			info.hide();
			info.show('Submitted Successfully', 'You can still update your submission');
			notifications.add({
				type: 'success',
				message: 'Group submission updated successfully'
			});
		}
	};
	let ideaGeneratorOpen = $state(false);
	const toggleIdeaGenerator = () => {
		ideaGeneratorOpen = !ideaGeneratorOpen;
	};

	onMount(async () => {
		// subscribe to changes in the event participant table, check if the current user has been added to a group and refresh page
		const channels = supabase
			.channel('group-insert-channel')
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'event_participant' },
				(payload) => {
					// Check if the current user has been added to a group

					if (payload.new.user_id == data.currentUser.id) {
						info.show('You have been added to a group', 'Refreshing page...');
						window.location.reload();
						//channels.unsubscribe(); //unsubscribe after use
					}
				}
			)
			.subscribe();

		//track submissions and synchronize across all clients
		const submissionChannel = supabase
			.channel('submission-channel')
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'event_group' },
				(payload) => {
					if (payload.new.id == group.id) {
						console.log('Submission updated', payload.new.submission);
						//remove the editor for 1ms then set the value and return it.
						showEditor = false;
						myGroupEditorValue = payload.new.submission;
						setTimeout(() => (showEditor = true), 1);
					}
				}
			)
			.subscribe();
	});

	let showEditor = $state(true);
</script>

<svelte:head>
	<title>{event.topic} Workspace | NWU VAAL GKSS</title>
</svelte:head>

{#if ideaGeneratorOpen}
	<!-- Backdrop -->
	<div
		class="fixed left-0 top-0 z-40 h-full w-full bg-black/40"
		onclick={toggleIdeaGenerator}
	></div>
{/if}

<div class="fixed {ideaGeneratorOpen ? 'bottom-0 right-0' : 'bottom-10 right-10'}  shadow-5xl z-50">
	{#if !ideaGeneratorOpen}
		<button class="btn btn-primary" onclick={toggleIdeaGenerator}>Idea Generator</button>
	{:else}
		<!-- Idea Generator -->
		<div class="flex flex-col">
			<button class="btn btn-primary absolute bottom-5 right-5" onclick={toggleIdeaGenerator}
				>Close</button
			>
			<IdeaGenerator />
		</div>
	{/if}
</div>
<div
	in:fly={{ x: 100, duration: 400 }}
	class="container mx-auto min-h-screen bg-white px-4 py-8 text-black shadow-xl"
>
	<div class="divider divider-start">
		<h1 class="mb-4 text-2xl font-bold">{event.topic} Workspace</h1>
	</div>
	<div class="grid gap-8 md:grid-cols-2">
		{#if !group}
			<div role="alert" class="flex h-fit items-center gap-4 rounded-lg bg-yellow-200 p-4">
				<Info />
				<span
					>You currently do not have a team, select a team to join or create new team and add your
					members</span
				>
			</div>
			<Groups {event} bind:group bind:info />
		{:else}
			<MyGroup bind:event {group} bind:info {judgingCriteria} />
			<form onsubmit={handleGroupSubmit} class="w-full space-y-2">
				<h1 class="mb-4 text-lg font-bold">Docs and details</h1>
				<p>Make sure to write some text right after attaching a file to this editor.</p>
				{#if showEditor}
					<TrixEditor bind:value={myGroupEditorValue} id="{event.topic}_{group.name}_resources" />
				{/if}
				<button class="btn btn-primary w-full">Submit</button>
			</form>
		{/if}
	</div>
</div>
<!--Info Modal-->
<dialog id="infoModal" class="modal">
	<div class="modal-box bg-white text-black">
		<h3 class="text-lg font-bold">{info.title}</h3>
		{#if info.isLoading}
			<Loading text="Loading..." />
		{:else}
			<p class="py-4">{info.description}</p>
			<div class="modal-action grid w-full">
				<form method="dialog" class="w-full">
					<!-- it will close the modal -->
					<button class="btn w-full">Close</button>
				</form>
			</div>
		{/if}
	</div>
</dialog>
