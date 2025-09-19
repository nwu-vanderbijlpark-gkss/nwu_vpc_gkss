<script>
	import { supabase } from '$lib/supabaseClient';
	import { onDestroy, onMount } from 'svelte';

	let { participants = $bindable(), groups = $bindable() } = $props();

	let view = $state('Participants');
	groups = groups.map((group) => {
		// Calculate total points for each group
		group = { ...group, points: group.event_results?.reduce((sum, res) => sum + res.points, 0) };
		return group;
	});
	//sort the groups by total points
	groups.sort((a, b) => {
		const aPoints = a.event_results.reduce((sum, res) => sum + res.points, 0);
		const bPoints = b.event_results.reduce((sum, res) => sum + res.points, 0);
		return bPoints - aPoints; // Sort in descending order
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
								>{participant.member.name ? participant.member.name : 'Not provided'}
								{participant.member.surname}</td
							>
							<td class="px-6 py-4"
								>{participant.member.gender ? participant.member.gender : 'Not provided'}</td
							>
							<td class="px-6 py-4"
								>{participant.member.qualification
									? participant.member.qualification
									: 'Not provided'}</td
							>
							<td class="px-6 py-4"
								>{participant.member.year_of_study
									? participant.member.year_of_study
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
						<th class="px-6 py-4 font-medium">Rank</th>
						<th class="px-6 py-4 font-medium">Group name</th>
						<th class="px-6 py-4 font-medium">Creator</th>
						<th class="px-6 py-4 font-medium">members</th>
						<th class="px-6 py-4 font-medium">Points</th>
					</tr>
				</thead>
				<tbody>
					{#each groups as group, index}
						<tr class="border-b transition-colors hover:bg-gray-50">
							<td class="px-6 py-4 font-semibold text-gray-800"> {index + 1}</td>
							<td class="px-6 py-4 font-semibold text-gray-800"> {group.name}</td>
							<td class="px-6 py-4">{group.member.name} {group.member.surname} </td>
							<td class="px-6 py-4">{group.event_participant.length + 1}</td>
							<td class="px-6 py-4">
								{group.event_results?.length ? group.points : 0}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	{/if}
</div>
