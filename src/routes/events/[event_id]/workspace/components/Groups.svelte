<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getRandomColor } from '$lib';
	import Loading from '$lib/components/Loading.svelte';
	import { onMount } from 'svelte';

	let { event, group = $bindable(), info = $bindable() } = $props();

	const groups = $state(event.event_group);

	let searchValue = $state('');
	let currentGroup = $state({});
	let derivedGroups = $state(groups);

	//the ID of the groups the user has requested to join
	let requestedGroups = $state([]);

	const newGroup = $state({
		name: '',
		isLoading: false
	});

	const handleViewGroup = (id) => {
		currentGroup = groups.find((grp) => grp.id == id);
		viewGroupModal.showModal();
	};

	const handleJoin = async (id) => {
		info.show();
		const req = await fetch('/api/event/group/request?group=' + id, {
			method: 'POST'
		});
		requestedGroups.push(id);
		//save to local storage
		localStorage.setItem('requestedGroups', JSON.stringify(requestedGroups));
		info.hide();
		info.show('Request sent!', 'You will receive an email when you are accepted into this group');
	};

	const handleSearch = () => {
		//search for the group name
		derivedGroups = groups.filter((grp) =>
			grp.name.toLowerCase().includes(searchValue.toLowerCase())
		);
		//simple
	};

	const handleGroupCreation = async () => {
		if (newGroup.name.length) {
			newGroup.isLoading = true;
			const req = await fetch('/api/event/group?event=' + event.id, {
				method: 'POST',
				body: JSON.stringify({ data: newGroup })
			});
			const res = await req.json();
			if (res.success) {
				groups.push(res.data[0]);
				group = res.data[0];
			}
			newGroup.isLoading = false;
			goto($page.url.pathname);
			createGroupModal.close();
			return;
		}
		alert('Make sure you have named your group.');
	};

	onMount(() => {
		//get the groups the user has requested to join
		requestedGroups = JSON.parse(localStorage.getItem('requestedGroups')) || [];
	});
</script>

<!--The judge is authenticated and is on the homepage-->
<div class="flex w-full flex-col">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-bold">Groups</h2>
		<button class="btn btn-primary" onclick={() => createGroupModal.showModal()}>Create</button>
	</div>
	<p class="text-sm">Select a team you wish to join</p>
	<input
		type="search"
		class="input input-bordered bg-gray-100"
		onchange={handleSearch}
		bind:value={searchValue}
		placeholder="Search for group"
	/>
	<div class="my-5 flex max-h-[500px] flex-col gap-2 overflow-auto">
		{#if !derivedGroups.length}
			<p>No groups have been created yet, create a new group.</p>
		{/if}
		{#each derivedGroups as grp}
			{#if !requestedGroups.includes(grp.id)}
				<div
					class=" flex items-center justify-between rounded-lg p-5 font-bold text-white"
					style="background: {getRandomColor()}"
				>
					{grp.name}
					<div>
						<button class="btn btn-secondary" onclick={() => handleViewGroup(grp.id)}>View</button>
						<button class="btn btn-primary" onclick={() => handleJoin(grp.id)}>Ask to Join</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<!---Modals-->
<!-- View Team Modal -->
<dialog id="viewGroupModal" class="modal">
	<div class="modal-box bg-white">
		<h3 class="text-lg font-bold">{currentGroup.name}</h3>
		<p>Members:</p>
		<ul class="list-inside list-decimal space-y-2 py-4">
			<li class="grid rounded-lg border-2 bg-gray-100 p-2">
				{currentGroup.member?.name}
				{currentGroup.member?.surname}
			</li>
			{#each currentGroup.event_participant as member}
				<li class="grid rounded-lg border-2 bg-gray-100 p-2">
					{member.member.name}
					{member.member.surname}
				</li>
			{/each}
		</ul>
		<div class="modal-action grid w-full grid-cols-2">
			<button class="btn btn-primary" onclick={() => handleJoin(currentGroup.id)}
				>Ask to Join</button
			>
			<form method="dialog" class="w-full">
				<!-- it will close the modal -->
				<button class="btn w-full">Close</button>
			</form>
		</div>
	</div>
</dialog>
<!--Create Team Modal-->
<dialog id="createGroupModal" class="modal">
	<div class="modal-box bg-white">
		<h3 class="text-lg font-bold">Create Team</h3>
		{#if newGroup.isLoading}
			<Loading text="Creating group..." />
		{:else}
			<p class="py-4">You will add/reject new members</p>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Group Name</legend>
				<input
					bind:value={newGroup.name}
					type="text"
					class="input w-full bg-gray-100"
					placeholder="Enter the group name"
				/>
			</fieldset>
			<div class="modal-action grid w-full grid-cols-2">
				<button class="btn btn-primary" onclick={handleGroupCreation}>Create</button>
				<form method="dialog" class="w-full">
					<!-- it will close the modal -->
					<button class="btn w-full">Close</button>
				</form>
			</div>
		{/if}
	</div>
</dialog>
