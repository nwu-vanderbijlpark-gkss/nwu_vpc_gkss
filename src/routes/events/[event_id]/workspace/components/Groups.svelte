<script>
	const groups = [
		{
			name: 'GoInno',
			members: ['Lethabo Maepa', 'John Ben', 'Ken Lee'],
			id: 'xxYhs'
		},
		{
			name: 'benisj',
			members: ['Jen Maepa', 'John Ken', 'KeOien Lee'],
			id: 'pyGer'
		}
	];

	let searchValue = $state('');
	let currentGroup = $state({});
	let derivedGroups = $state(groups);

	const handleViewGroup = (id) => {
		currentGroup = groups.find((grp) => grp.id == id);
		viewGroupModal.showModal();
	};

	const handleJoin = (id) => {
		const selectedGroup = groups.find((grp) => grp.id == id);
		alert('Join Request Sent!');
	};

	const handleSearch = () => {
		//search for the group name
		derivedGroups = groups.filter((grp) =>
			grp.name.toLowerCase().includes(searchValue.toLowerCase())
		);
		//simple
	};
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
			<p>No groups</p>
		{/if}
		{#each derivedGroups as grp}
			<div class="flex items-center justify-between rounded-lg bg-gray-200 p-5 hover:bg-gray-400">
				{grp.name}
				<div>
					<button class="btn" onclick={() => handleViewGroup(grp.id)}>View</button>
					<button class="btn btn-primary" onclick={() => handleJoin(grp.id)}>Ask to Join</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<!---Modals-->
<!-- View Team Modal -->
<dialog id="viewGroupModal" class="modal">
	<div class="modal-box bg-white">
		<h3 class="text-lg font-bold">{currentGroup.name}</h3>
		<p>Members:</p>
		<ul class="list-inside list-decimal py-4">
			{#each currentGroup.members as member}
				<li>{member}</li>
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
		<p class="py-4">You will add/reject new members</p>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Group Name</legend>
			<input type="text" class="input w-full bg-gray-100" placeholder="Enter the group name" />
		</fieldset>
		<div class="modal-action grid w-full grid-cols-2">
			<button class="btn btn-primary" onclick={() => handleJoin(currentGroup.id)}>Create</button>
			<form method="dialog" class="w-full">
				<!-- it will close the modal -->
				<button class="btn w-full">Close</button>
			</form>
		</div>
	</div>
</dialog>
