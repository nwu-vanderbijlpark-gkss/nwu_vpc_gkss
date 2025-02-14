<script>
	import { Edit, PlusCircle, Trash2, X } from 'lucide-svelte';

	let { data, form } = $props();
	let members = $state(data.members);
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-xl">
	<div class="mb-8 flex items-center justify-between p-6">
		<h2 class="text-3xl font-semibold text-gray-800">Members</h2>
	</div>

	<div class="max-h-screen overflow-auto px-6 pb-6">
		<table class="w-full text-left text-sm text-gray-600 shadow-xl">
			<thead class="bg-gray-100 text-xs uppercase text-gray-700">
				<tr>
					<th class="px-6 py-4 font-medium">Image</th>
					<th class="px-6 py-4 font-medium">Full Name</th>
					<th class="px-6 py-4 font-medium">Gender</th>
					<th class="px-6 py-4 font-medium">Qualification</th>
					<th class="px-6 py-4 font-medium">Year Of Study</th>
				</tr>
			</thead>
			<tbody>
				{#each members as member, index}
					<tr class="border-b transition-colors hover:bg-gray-50">
						<td class="px-6 py-4 font-semibold text-gray-800"
							><img
								class="h-[30px] w-[30px] rounded-full"
								src={member.image}
								alt={member.surname}
							/></td
						>
						<td class="px-6 py-4 font-semibold text-gray-800"
							>{member.name ? member.name : 'Not provided'} {member.surname}</td
						>
						<td class="px-6 py-4">{member.gender ? member.gender : 'Not provided'}</td>
						<td class="px-6 py-4">{member.qualification ? member.qualification : 'Not provided'}</td
						>
						<td class="px-6 py-4">{member.year_of_study ? member.year_of_study : 'Not provided'}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
