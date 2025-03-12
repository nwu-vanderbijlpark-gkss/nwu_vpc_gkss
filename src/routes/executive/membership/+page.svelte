<script>
	import { Edit, PlusCircle, SendHorizontal, Trash2, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Loading from '../../../components/Loading.svelte';
	import { fade, fly } from 'svelte/transition';

	let { data, form } = $props();
	let members = $state(data.members);
	let message = $state({ subject: '', content: '' });
	let isLoading = $state(false);
	const sendMessage = async () => {
		//send emails to every member with an email
		isLoading = true;
		members.forEach(async (member) => {
			if (member.email) {
				let data = {
					type: 'broadcast', //meaning its sent to all students
					fullName: member.name + ' ' + member.surname,
					subject: message.subject,
					message: message.content,
					email: member.email
				};

				const res = await fetch('/api/sendEmail', {
					method: 'POST',
					body: JSON.stringify({ data })
				});
				const r = await res.json();
				if (r.success) {
					sendEmailModal.close();
					isLoading = false;
				}
			}
		});
	};
</script>

<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="overflow-hidden rounded-lg bg-white shadow-xl"
>
	<div class="flex items-center justify-between p-6">
		<h2 class="text-3xl font-semibold text-gray-800">Members</h2>
	</div>
	<div class="flex gap-3 px-7 py-3">
		<input
			type="text"
			class="input-borderd input w-full bg-gray-200"
			readonly
			placeholder="Send an email to all members"
			onclick={() => sendEmailModal.show()}
		/>
		<button onclick={() => sendEmailModal.show()} class="btn btn-primary"
			><SendHorizontal />Send</button
		>
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

<dialog id="sendEmailModal" class="modal modal-bottom z-50 sm:modal-middle">
	{#if isLoading}
		<Loading />
	{:else}
		<div class="modal-box text-white">
			<div class="flex items-center justify-between">
				<p class="text-lg font-bold text-white">Send email to all members</p>
				<div class="modal-action">
					<form method="dialog">
						<button class="btn"><X /></button>
					</form>
				</div>
			</div>
			<form
				method="post"
				onsubmit={sendMessage}
				enctype="multipart/form-data"
				class="flex w-full flex-col gap-5"
			>
				<label class="form-control w-full">
					<p>Subject</p>
					<input
						type="text"
						name="subject"
						class="input input-bordered"
						id="subject"
						placeholder="Enter the subject"
						required
						bind:value={message.subject}
					/>
				</label>
				<label class="form-control w-full">
					<p>Message</p>
					<textarea
						name="content"
						class="textarea textarea-bordered"
						id="content"
						placeholder="Compose your message to the members"
						required
						rows="5"
						aria-label="Link to the project"
						bind:value={message.content}
					></textarea>
				</label>
				<button class="btn btn-primary" type="submit"><SendHorizontal />Send</button>
			</form>
		</div>
	{/if}
</dialog>
