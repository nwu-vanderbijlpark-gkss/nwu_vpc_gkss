<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Check } from 'lucide-svelte';
	import JudgeAuth from './components/JudgeAuth.svelte';
	import JudgeGroupView from './components/JudgeGroupView.svelte';

	let showAuth = $state(true);

	let group = $state({ id: null });

	afterNavigate(({ from, to }) => {
		if (to.url.searchParams.get('x')) {
			showAuth = false;
			const groupId = to.url.searchParams.get('group') || null;

			if (groupId != null) {
				group.id = groupId;
			} else {
				group.id = null;
			}
		} else {
			showAuth = true;
			group.id = null;
		}
	});
	const groups = [
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'MostMake', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'Jonn', id: 'kjsdnkxz' },
		{ name: 'Bsgsg', id: '12344' },
		{ name: 'MostMake', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'msk', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'MostMake', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'Ekasi', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'MostMake', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'Mostt', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'MostMake', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'MostMake', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'MostMake', id: 'kjsdnkxz' },
		{ name: 'Xmarkers', id: '12344' },
		{ name: 'MostMake', id: 'kjsdnkxz' }
	];

	let searchValue = $state('');
	let derivedGroups = $state(groups);
	const handleSearch = () => {
		//search for the group name
		derivedGroups = groups.filter((grp) =>
			grp.name.toLowerCase().includes(searchValue.toLowerCase())
		);
		//simple
	};
</script>

<main class="flex min-h-screen w-full justify-center text-black">
	<div class="flex w-full flex-col bg-white p-4 shadow-xl lg:w-2/3">
		{#if showAuth}
			<!--The judge must be authenticated-->
			<JudgeAuth />
		{:else if group.id}
			<!--The judge is authenticated and is viewing a group-->
			<JudgeGroupView />
		{:else}
			<!--The judge is authenticated and is on the homepage-->
			<div class="flex w-full flex-col">
				<h2 class="text-lg font-bold">Groups</h2>
				<p class="text-sm">Select the presenting team</p>
				<input
					type="search"
					class="input input-bordered bg-gray-100"
					onchange={handleSearch}
					bind:value={searchValue}
					placeholder="Search for group"
				/>
				<div class="my-5 flex max-h-[500px] flex-col gap-2 overflow-auto">
					{#if !derivedGroups.length}
						<p>No groups</p>
					{/if}
					{#each derivedGroups as grp}
						<a
							class="flex items-center justify-between rounded-lg bg-gray-200 p-5 hover:bg-gray-400"
							href="{$page.url.pathname}?x=id&group={grp.id}"
						>
							{grp.name}
							<p class="text-green-500"><Check /></p>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</main>
