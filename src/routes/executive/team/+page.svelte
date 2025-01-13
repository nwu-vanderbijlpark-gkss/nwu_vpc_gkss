<script>
	import { Edit, PlusCircle, Trash2, X } from 'lucide-svelte';

	let roles = [
		'Chairperson',
		'Deputy Chairperson',
		'Secretary',
		'Treasurer',
		'Tech and Innovation Lead',
		'Community Manager',
		'Marketing Manager'
	];
	let { data, form } = $props();
	let team = $state(data.team);
	const handleDelete = (id) => {
		const data = new FormData();
		data.append('id', id);
		fetch('?/deleteMember', {
			method: 'POST',
			body: data
		});
		//remove the deleted member from state
		let newArray = [];
		for (const member of team) {
			if (member.id != id) {
				newArray.push(member);
			}
		}
		team = newArray;
	};
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-gray-200 p-10">
	<div class="mb-6 flex w-full max-w-[700px] items-center justify-between">
		<h2 class="text-4xl font-bold">Team</h2>
		<button class="btn btn-primary" onclick={() => addMemberModal.show()}
			><PlusCircle />Add Member</button
		>
	</div>
	<div class="mb-5 grid w-full max-w-[700px] text-sm text-gray-500">
		<p class="">You can add, delete and update a member on this page</p>
		<p class="lg:hidden">View on desktop for a detailed table</p>
	</div>
	<div class="w-full max-w-[700px] overflow-x-auto">
		<table class="table">
			<!-- head -->
			<thead>
				<tr>
					<th>Role</th>
					<th>Full name</th>
					<th class="">Email</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				<!-- row  -->
				{#each team as member, index}
					<tr>
						<td>{member.role}</td>
						<td>{member.name} {member.surname}</td>
						<td class="">{member.email}</td>
						<td class="flex items-center gap-2">
							<button class="btn btn-ghost grid items-center"
								><Edit />
								<p class="text-xs">Edit</p></button
							>
							<button
								onclick={() => handleDelete(member.id)}
								class="btn btn-ghost hidden items-center lg:grid"
								><Trash2 color="red" />
								<p class="text-xs">Delete</p></button
							>
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
					<button class="btn"><X />Close</button>
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
					placeholder="Name of the member"
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
				<span class="label-text-alt py-2 text-info"
					>Note: Must match the email that the member registered on this website with.</span
				>
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
