<script>
	import { Info } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Groups from './components/Groups.svelte';
	import MyGroup from './components/MyGroup.svelte';
	import TrixEditor from '$lib/components/TrixEditor.svelte';

	let event = $state({});
	onMount(() => {
		event = JSON.parse(localStorage.getItem('ev'));
	});

	const hasTeam = true;
	let myGroupEditorValue = $state('<p>You can add your documents here</p>');
</script>

<svelte:head>
	<title>{event.topic} Workspace | NWU VAAL GKSS</title>
</svelte:head>
<div
	in:fly={{ x: 100, duration: 400 }}
	class="container mx-auto min-h-screen bg-white px-4 py-8 text-black shadow-xl"
>
	<div class="divider divider-start">
		<h1 class="mb-4 text-2xl font-bold">{event.topic} Workspace</h1>
	</div>
	<div class="grid gap-8 md:grid-cols-2">
		{#if !hasTeam}
			<div role="alert" class="alert alert-info h-fit">
				<Info />
				<span>You do not have a team, select a team to join or create new team</span>
			</div>
			<Groups />
		{:else}
			<MyGroup />
			<div class="w-full space-y-2">
				<h1 class="mb-4 text-lg font-bold">Docs and details</h1>
				<p>Make sure to write some text right after attaching a file to this editor.</p>
				<TrixEditor value={myGroupEditorValue} id="{event.topic}_teams_resources" />
				<button class="btn btn-primary w-full">Submit</button>
			</div>
		{/if}
	</div>
</div>
