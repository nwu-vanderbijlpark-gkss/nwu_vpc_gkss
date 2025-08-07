<script>
	import { supabase } from '$lib/supabaseClient';
	import { onDestroy, onMount } from 'svelte';

	let { participants = $bindable(), groups = $bindable() } = $props();

	let view = $state('Participants');

	onMount(() => {
		const channels = supabase
			.channel('participants_updates')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'event_participant' },
				(payload) => {
					console.log('Change received!', payload);
				}
			)
			.subscribe();

		return channels.unsubscribe();
	});
</script>

<div class="max-h-screen space-y-3 overflow-auto py-6 pb-6">
	<div class="flex items-center justify-between">
		<h2>{view}({view == 'Groups' ? groups.length : participants.length})</h2>
		<select bind:value={view} class="select select-bordered bg-gray-200" placeholder="View">
			<option>Participants</option>
			<option>Groups</option>
		</select>
	</div>
	{#if view === 'Participants'}
		<!--PARTICIPANTS-->
		{#if !participants.length}
			<p>No participants yet</p>
		{:else}
			<table class="w-full text-left text-sm text-gray-600 shadow-xl">
				<thead class="bg-gray-100 text-xs uppercase text-gray-700">
					<tr>
						<th class="px-6 py-4 font-medium">Full Name</th>
						<th class="px-6 py-4 font-medium">Gender</th>
						<th class="px-6 py-4 font-medium">Qualification</th>
						<th class="px-6 py-4 font-medium">Year Of Study</th>
					</tr>
				</thead>
				<tbody>
					{#each participants as participant, index}
						<tr class="border-b transition-colors hover:bg-gray-50">
							<td class="px-6 py-4 font-semibold text-gray-800"
								>{participant.Member.name ? participant.Member.name : 'Not provided'}
								{participant.Member.surname}</td
							>
							<td class="px-6 py-4"
								>{participant.Member.gender ? participant.Member.gender : 'Not provided'}</td
							>
							<td class="px-6 py-4"
								>{participant.Member.qualification
									? participant.Member.qualification
									: 'Not provided'}</td
							>
							<td class="px-6 py-4"
								>{participant.Member.year_of_study
									? participant.Member.year_of_study
									: 'Not provided'}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	{:else}
		<!--GROUPS-->
		{#if !groups.length}
			<p>No groups created yet</p>
		{:else}
			<table class="w-full text-left text-sm text-gray-600 shadow-xl">
				<thead class="bg-gray-100 text-xs uppercase text-gray-700">
					<tr>
						<th class="px-6 py-4 font-medium">Group name</th>
						<th class="px-6 py-4 font-medium">Creator</th>
						<th class="px-6 py-4 font-medium">Members</th>
						<th class="px-6 py-4 font-medium">Points</th>
					</tr>
				</thead>
				<tbody>
					{#each groups as group, index}
						<tr class="border-b transition-colors hover:bg-gray-50">
							<td class="px-6 py-4 font-semibold text-gray-800"> {group.name}</td>
							<td class="px-6 py-4">{group.Member.name} {group.Member.surname} </td>
							<td class="px-6 py-4">{group.event_participant.length + 1}</td>
							<td class="px-6 py-4">{group.points || 0}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	{/if}
</div>
