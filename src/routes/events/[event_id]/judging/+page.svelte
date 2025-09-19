<script>
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Check, Users } from 'lucide-svelte';
	import JudgeAuth from './components/JudgeAuth.svelte';
	import JudgeGroupView from './components/JudgeGroupView.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Seo from '$lib/components/SEO.svelte';

	let { data } = $props();

	let showAuth = $state(data.judge ? false : true);

	let group = $state(null);

	let groups = $state(data.groups);
	let searchValue = $state('');
	let derivedGroups = $state(groups);

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

	afterNavigate(async ({ from, to }) => {
		info.hide();
		if (to.url.searchParams.get('code') && !data.judge) {
			info.show();
			const code = to.url.searchParams.get('code');
			const req = await fetch('/api/event/judge?code=' + code);
			const res = await req.json();
			if (!res.success) {
				info.hide();
				info.show(
					'Error Processing your request',
					'It seems like you might have an incorrect link, please check your emails'
				);
				return;
			}

			window.location.href = $page.url.pathname; //makes use of cookies now
		} else if (data.judge) {
			const groupId = to.url.searchParams.get('group') || null;

			if (groupId != null) {
				//get the group from the array of groups
				group = derivedGroups.find((grp) => grp.id == groupId);
			} else {
				group = null;
			}
		} else {
			showAuth = true;
			group.id = null;
		}
	});

	const handleSearch = () => {
		//search for the group name
		derivedGroups = groups.filter((grp) =>
			grp.name.toLowerCase().includes(searchValue.toLowerCase())
		);
		//simple
	};
</script>

<Seo
	title={data.event ? `Judging - ${data.event.name}` : 'Judging'}
	desc={data.event ? data.event.description : 'Event judging portal for NWU Vaal GKSS events.'}
/>

<main class="flex min-h-screen w-full justify-center text-black">
	<div class="flex w-full flex-col bg-white p-4 shadow-xl lg:w-2/3">
		{#if showAuth}
			<!--The judge must be authenticated-->
			<JudgeAuth />
		{:else if group != null}
			<!--The judge is authenticated and is viewing a group-->
			<JudgeGroupView
				bind:group
				bind:info
				judgingCriteria={data.event.event_criteria}
				judge={data.judge[0]}
			/>
		{:else}
			<!--The judge is authenticated and is on the homepage-->
			<div class="flex w-full flex-col space-y-3">
				<h2 class="text-lg font-bold">Groups</h2>
				<p class="text-sm">
					Please wait for MC to announce team name, then select the presenting team
				</p>
				<input
					type="search"
					class="input input-bordered bg-gray-100"
					onchange={handleSearch}
					bind:value={searchValue}
					placeholder="Search for group by name"
				/>
				<div class="my-5 flex max-h-[500px] flex-col gap-2 overflow-auto">
					{#if !derivedGroups?.length}
						<p class=" font-semibold">No groups found</p>
					{/if}
					{#each derivedGroups as grp}
						<a
							class="flex items-center justify-between rounded-lg bg-primary p-5 text-white hover:opacity-80"
							href="{$page.url.pathname}?group={grp.id}"
						>
							{grp.name}
							<Users />
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</main>
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
