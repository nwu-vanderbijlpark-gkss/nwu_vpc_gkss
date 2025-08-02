<script>
	const event = {
		participants: [
			{
				name: 'Lethabo',
				surname: 'Maepa',
				gender: 'Male',
				qualification: 'BSc Information Technology'
			}
		]
	};

	let view = $state('Participants');
</script>

<div class="max-h-screen space-y-3 overflow-auto py-6 pb-6">
	<div class="flex items-center justify-between">
		<h2>{view}(0)</h2>
		<select bind:value={view} class="select select-bordered bg-gray-200" placeholder="View">
			<option>Participants</option>
			<option>Teams</option>
		</select>
	</div>
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
			{#each event.participants as participant, index}
				<tr class="border-b transition-colors hover:bg-gray-50">
					<td class="px-6 py-4 font-semibold text-gray-800"
						>{participant.name ? participant.name : 'Not provided'}
						{participant.surname}</td
					>
					<td class="px-6 py-4">{participant.gender ? participant.gender : 'Not provided'}</td>
					<td class="px-6 py-4"
						>{participant.qualification ? participant.qualification : 'Not provided'}</td
					>
					<td class="px-6 py-4"
						>{participant.year_of_study ? participant.year_of_study : 'Not provided'}</td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
