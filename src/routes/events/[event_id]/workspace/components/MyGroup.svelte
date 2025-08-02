<script>
	//my group info
	//my group join requests
	//event resources
	const joinRequests = $state([
		{ name: 'Lethabo Maepa', id: 'gdhsjk' },
		{ name: 'John Boe', id: 'oidf' },
		{ name: 'Ken Keed', id: 'nmsdmcdksj' },
		{ name: 'Play Boy', id: 'msxhks' }
	]);
	let members = ['Jen Maepa', 'John Ken', 'KeOien Lee'];
	const viewState = $state({
		hideRequests: false
	});
</script>

<main>
	<h2 class="text-lg font-bold">My Team</h2>
	<div class="divider divider-start">Members</div>
	<ul class="list-inside list-decimal py-4">
		{#each members as member}
			<li>{member}</li>
		{/each}
	</ul>

	{#if !viewState.hideRequests}
		<div class="divider"></div>
		<div class="my-2 flex items-center justify-between">
			Join requests
			<button class="link link-primary" onclick={() => (viewState.hideRequests = true)}>Hide</button
			>
		</div>
		<div class="grid gap-2">
			{#each joinRequests as request}
				<div class="flex items-center justify-between rounded-xl border-2 bg-gray-100 p-1">
					{request.name}
					<div class="flex items-center gap-2">
						<button class="btn">Reject</button>
						<button class="btn btn-primary">Accept</button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<button class="link link-primary" onclick={() => (viewState.hideRequests = false)}
			>Show Join Requests</button
		>
	{/if}
</main>
