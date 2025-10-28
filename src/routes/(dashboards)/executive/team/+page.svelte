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
		'Project Manager',
		'Other'
	];
	let { data, form } = $props();

	const { members } = data;
	let formData = $state({
		role: 'Chairperson',
		other_role: '',
		year: new Date().getFullYear() + 1,
		member_id: '',
		member: {}
	});
	let team = $state(data.team);
	let suggestions = $state([]);
	let searchQuery = $state('');
	let showSearch = $state(false);

	const handleSearch = () => {
		searchQuery = searchQuery.toLowerCase();
		suggestions = members.filter(
			(member) =>
				console.log(member) ||
				member.name?.toLowerCase().includes(searchQuery) ||
				member.surname?.toLowerCase().includes(searchQuery) ||
				member.email?.toLowerCase().includes(searchQuery) ||
				member.username?.toLowerCase().includes(searchQuery)
		);
		// Display suggestions (you can implement a dropdown or autocomplete UI)
	};
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

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formData.member_id === '') {
			alert('Please select a member from the suggestions.');
			return;
		}
		const data = new FormData();

		if (formData.role === 'Other') {
			formData.role = formData.other_role;
		}

		data.append('role', formData.role);
		data.append('year', formData.year);
		data.append('member_id', formData.member_id);
		data.append('member', JSON.stringify(formData.member));

		fetch('?/addMember', {
			method: 'POST',
			body: data
		});
		location.reload(); // Reload to see the new member in the list
	};
</script>

<Seo
	title="Executive Team Management"
	desc="Manage and showcase your executive team with our team management system. Add, edit, and organize team members to highlight your leadership and foster collaboration."
/>

<div transition:fly class="overflow-hidden rounded-lg bg-white shadow-xl">
	<div class="mb-8 flex items-center justify-between p-6">
		<h2 class="text-2xl font-semibold text-gray-800">{data.forYear} Executive Team</h2>
		<button class="btn btn-primary" onclick={() => addMemberModal.show()}>
			<PlusCircle class="mr-2" /> Add Team Member
		</button>
	</div>

	<div class="max-h-screen overflow-auto px-6 pb-6">
		<table class="w-full text-left text-sm text-gray-600 shadow-xl">
			<thead class="bg-gray-100 text-xs text-gray-700 uppercase">
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

<dialog id="addMemberModal" class="modal modal-bottom sm:modal-middle z-50">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Add a Leader</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn"><X /> Close</button>
				</form>
			</div>
		</div>

		<form method="post" onsubmit={handleSubmit} class="flex w-full flex-col gap-5">
			<label class="form-control w-full">
				<p>Role</p>
				<select
					bind:value={formData.role}
					type="text"
					name="role"
					class="select select-bordered"
					id="role"
					placeholder="What is Role of this member?"
					required
				>
					{#each roles as role}
						<option>{role}</option>
					{/each}
				</select>
				{#if formData.role === 'Other'}
					<input
						bind:value={formData.other_role}
						type="text"
						name="other_role"
						class="input input-bordered mt-2"
						id="other_role"
						placeholder="Please specify the role"
						required
					/>
				{/if}
			</label>
			<label class="form-control w-full">
				<p>Serving year</p>
				<input
					type="number"
					name="year"
					class="input input-bordered"
					id="year"
					placeholder="Enter the year this member is serving"
					bind:value={formData.year}
					min={new Date().getFullYear()}
				/>
			</label>
			<label class="form-control w-full">
				<p>Select Member</p>
				<input
					type="text"
					name="name"
					class="input input-bordered"
					id="name"
					bind:value={searchQuery}
					placeholder="Enter name, email or username of the member"
					onclick={() => (showSearch = true)}
					onkeydown={(e) => {
						handleSearch(e);
						formData.member_id = '';
					}}
					onchange={(e) => {
						handleSearch(e);
						formData.member_id = '';
					}}
				/>
			</label>
			{#if formData.member_id !== ''}
				<p class="text-green-500">Member selected successfully</p>
				{#if formData.member.image}
					<div class="flex items-center gap-4 rounded-lg p-4">
						<img
							src={formData.member.image}
							alt={formData.member.surname}
							class="h-10 w-10 rounded-full"
						/>
						<span>
							{formData.member.name}
							{formData.member.surname} <br />
							{formData.member.email} <br />
						</span>
					</div>
				{/if}
			{/if}
			<ul class="menu bg-base-200 text-base-content min-h-full w-full p-4">
				{#each suggestions as suggestion}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<li class="w-full">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_missing_attribute -->
						<a
							onclick={() => {
								formData.member_id = suggestion.id;
								formData.member = suggestion;
								suggestions = [];
							}}
						>
							<div class="flex items-center gap-4 rounded-lg p-4">
								<img
									src={suggestion.image}
									alt={suggestion.surname}
									class="h-10 w-10 rounded-full"
								/>
								<span>
									{suggestion.name}
									{suggestion.surname} <br />
									{suggestion.email} <br />
								</span>
							</div>
						</a>
					</li>
				{/each}
				{#if suggestions.length === 0 && formData.member_id === ''}
					<li><a>No suggestions found</a></li>
				{/if}
			</ul>
			<button type="submit" class="btn btn-primary text-white">Add</button>
		</form>
	</div>
</dialog>

<style>
	@import 'tailwindcss';
	@plugin 'daisyui';
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
