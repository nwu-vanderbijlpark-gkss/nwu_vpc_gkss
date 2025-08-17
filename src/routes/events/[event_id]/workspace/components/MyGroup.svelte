<script>
	import { onMount } from 'svelte';

	//my group info
	//my group join requests
	//event resources
	let { group, info = $bindable(), event, judgingCriteria } = $props();

	let joinRequests = $state([]);

	let members = $state(group.event_participant);

	const viewState = $state({
		hideRequests: false
	});

	onMount(async () => {
		const req = await fetch('/api/event/group/request?group=' + group.id);
		const res = await req.json();
		if (res.success) {
			joinRequests = res.data;
		}
	});

	const handleRequestChange = async (requestId, state) => {
		info.show();
		const req = await fetch(`/api/event/group/request?id=${requestId}&state=${state}`, {
			method: 'PUT',
			body: JSON.stringify({ data: { event_id: event.id, group_id: group.id } })
		});
		const res = await req.json();

		if (res.success) {
			// Remove the request from the request list
			joinRequests = joinRequests.filter((request) => {
				if (request.id === requestId) {
					// If the state is 'accepted', push it to members
					if (state === 'accepted') {
						members.push(request);
					}
					// Don't include the request in the updated list
					return false;
				}
				// Keep the request in the updated list
				return true;
			});

			info.hide();
			info.show(`${state} successfully`, 'You may close the modal.');
			return;
		}
		info.hide();
		info.show(`Failed to process your request`, 'Please try again later.');
	};
</script>

<main>
	<h2 class="text-lg font-bold">{group.name}</h2>
	<div class="divider divider-start">Members</div>
	<ul class="list-inside space-y-2 py-4">
		<li class="grid rounded-lg border-2 bg-gray-100 p-2">
			<p>{group.Member?.name} {group.Member?.surname}</p>
			<a href="mailto:{group.Member?.email}" class="link text-xs">{group.Member?.email}</a>
		</li>
		{#each members as member}
			<li class="grid rounded-lg border bg-gray-100 p-2">
				<p>{member.Member?.name} {member.Member?.surname}</p>
				<a href="mailto:{member.Member?.email}" class="link text-xs">{member.Member?.email}</a>
			</li>
		{/each}
	</ul>
	<div class="flex w-full flex-col items-start gap-2">
		<div class="divider divider-start">Criteria</div>
		{#each judgingCriteria as criteria, i}
			<div class="grid w-full grid-cols-3 items-center rounded-xl border-2 bg-gray-100 p-2">
				<div class=" col-span-2">
					<h3>{criteria.title}</h3>
					<p class="overflow-clip whitespace-pre-wrap text-sm">
						{criteria.description}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<p class="text-lg font-bold">Max: {criteria.max_points}</p>
				</div>
			</div>
		{/each}
	</div>

	{#if !viewState.hideRequests && joinRequests.length}
		<div class="divider"></div>
		<div class="my-2 flex items-center justify-between">
			Join requests
			<button class="link link-primary" onclick={() => (viewState.hideRequests = true)}>Hide</button
			>
		</div>
		<div class="grid gap-2">
			{#each joinRequests as request}
				<div class="flex items-center justify-between rounded-xl border-2 bg-gray-100 p-1">
					<div class="grid">
						<p>{request.Member?.name} {request.Member?.surname}</p>
						<a href="mailto:{request.Member?.email}" class="link text-xs">{request.Member?.email}</a
						>
					</div>
					<div class="flex items-center gap-2">
						<button class="btn" onclick={() => handleRequestChange(request.id, 'rejected')}
							>Reject</button
						>
						<button
							class="btn btn-primary"
							onclick={() => handleRequestChange(request.id, 'accepted')}>Accept</button
						>
					</div>
				</div>
			{/each}
		</div>
	{:else if joinRequests.length}
		<button class="link link-primary" onclick={() => (viewState.hideRequests = false)}
			>Show Join Requests</button
		>
	{/if}
</main>
