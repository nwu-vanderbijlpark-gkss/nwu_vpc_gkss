<script>
	import Seo from '$lib/components/SEO.svelte';
	import { Edit, PlusCircle, Trash2, X } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let roles = [
		'Chairperson',
		'Deputy Chairperson',
		'Secretary',
		'Treasurer',
		'Tech and Innovation Lead',
		'Community Manager',
		'Recruitment Officer',
		'Sponsorship and Fundraising Coordinator',
		'Marketing Manager',
		'Project Manager'
	];
	let { data, form } = $props();
	let team = $state(data.team);

	const handleDelete = (id) => {
		if (confirm('Click Ok to confirm to remove this member from the executive team.')) {
			const data = new FormData();
			data.append('id', id);
			fetch('?/deleteMember', {
				method: 'POST',
				body: data
			});
			// Remove the deleted member from state
			team = team.filter((member) => member.id !== id);
		}
	};
</script>

<Seo
	title="Executive Team Management"
	desc="Manage and showcase your executive team with NWU VAAL GKSS's team management system. Add, edit, and organize team members to highlight your leadership and foster collaboration."
/>

<div transition:fly class="overflow-hidden rounded-lg bg-white shadow-xl">
	<div class="mb-8 flex items-center justify-between p-6">
		<h2 class="text-3xl font-semibold text-gray-800">Executive Team</h2>
		<button class="btn btn-primary" onclick={() => addMemberModal.show()}>
			<PlusCircle class="mr-2" /> Add Team Member
		</button>
	</div>

	<div class="max-h-screen overflow-auto px-6 pb-6">
		<table class="w-full text-left text-sm text-gray-600 shadow-xl">
			<thead class="bg-gray-100 text-xs uppercase text-gray-700">
				<tr>
					<th class="px-6 py-4 font-medium">Role</th>
					<th class="px-6 py-4 font-medium">Full Name</th>
					<th class="px-6 py-4 font-medium">Contact Email</th>
					<th class="px-6 py-4 text-center font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each team as leader, index}
					<tr class="border-b transition-colors hover:bg-gray-50">
						<td class="flex items-center gap-2 px-6 py-4 font-semibold text-gray-800">
							<img
								src={leader.member.image}
								alt={leader.member.surname}
								class="h-8 w-8 rounded-full"
							/>
							{leader.role}
						</td>
						<td class=" px-6 py-4">
							{leader.member.name}
							{leader.member.surname}
						</td>
						<td class="px-6 py-4">{leader.member.email}</td>
						<td class="flex justify-center space-x-2 px-6 py-4">
							<button
								onclick={() => handleDelete(leader.id)}
								class="btn btn-ghost btn-sm text-red-600"
							>
								<Trash2 class="mr-1" /> Remove
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<dialog id="addMemberModal" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Add a Member</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn"><X /> Close</button>
				</form>
			</div>
		</div>

		<p class="py-4 text-sm">Enter the required details</p>
		<form
			method="post"
			action="?/addMember"
			enctype="multipart/form-data"
			class="flex w-full flex-col gap-5"
		>
			<label class="form-control w-full">
				<p>Role</p>
				<select
					type="text"
					name="role"
					class="select select-bordered"
					id="role"
					placeholder="Role of the member"
					required
				>
					{#each roles as role}
						<option>{role}</option>
					{/each}
				</select>
			</label>
			<label class="form-control w-full">
				<p>Name</p>
				<input
					type="text"
					name="name"
					class="input input-bordered"
					id="name"
					placeholder="Name of the member"
					required
				/>
			</label>
			<label class="form-control w-full">
				<p>Surname</p>
				<input
					type="text"
					name="surname"
					class="input input-bordered"
					id="surname"
					placeholder="Surname of the member"
					required
				/>
			</label>
			<label class="form-control w-full">
				<p>Email</p>
				<input
					type="email"
					name="email"
					class="input input-bordered"
					id="email"
					placeholder="name.surname@domain.com"
					required
				/>
				<span class="label-text-alt py-2 text-info">
					Note: Must match the email that the member registered on this website with.
				</span>
			</label>
			<label class="form-control w-full">
				<p>Image</p>
				<input
					type="file"
					name="image"
					class="file-input file-input-bordered w-full"
					accept="image/*"
					id="image"
					required
				/>
			</label>
			<button type="submit" class="btn btn-primary text-white">Add</button>
		</form>
	</div>
</dialog>

<style>
	table,
	td,
	tr,
	th,
	h1,
	h2,
	h3 {
		@apply text-black;
	}
	div {
		cursor: default;
	}
</style>
