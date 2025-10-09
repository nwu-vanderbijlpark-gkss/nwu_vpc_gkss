<script>
	import TrixDisplay from '$lib/components/TrixDisplay.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	//my group info
	//my group join requests
	//event resources
	let { group, info = $bindable(), event = $bindable(), judgingCriteria } = $props();

	let joinRequests = $state([]);

	let members = $state(group.event_participant);

	const viewState = $state({
		hideRequests: false
	});

	const getRequests = async () => {
		const req = await fetch('/api/event/group/request?group=' + group.id);
		const res = await req.json();
		if (res.success) {
			joinRequests = res.data;
		}
	};
	onMount(async () => {
		await getRequests();
		//subscribe to new join requests

		const request_channel = supabase
			.channel('request-insert-channel')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'join_request' },
				async (payload) => {
					await getRequests();
				}
			);

		request_channel.subscribe();

		//listen for changes to the event resources

		const event_channel = supabase
			.channel('event-update-channel')
			.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Events' }, (payload) => {
				event.resources = payload.new.resources;
			})
			.subscribe();
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
			<p>{group.member?.name} {group.member?.surname}</p>
			<a href="mailto:{group.member?.email}" class="link text-xs">{group.member?.email}</a>
		</li>
		{#each members as member}
			<li class="grid rounded-lg border bg-gray-100 p-2">
				<p>{member.member?.name} {member.member?.surname}</p>
				<a href="mailto:{member.member?.email}" class="link text-xs">{member.member?.email}</a>
			</li>
		{/each}
	</ul>
	<div class="flex w-full flex-col items-start gap-2">
		<div class="divider divider-start">Tools & Resources</div>
		<TrixDisplay content={event.resources} />
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
						<p>{request.member?.name} {request.member?.surname}</p>
						<a href="mailto:{request.member?.email}" class="link text-xs">{request.member?.email}</a
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
