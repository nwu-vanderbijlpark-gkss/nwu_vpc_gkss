<script>
	import { ArrowLeft, Edit, PlusCircle, SendHorizontal } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '$lib/stores';
	import TrixEditor from '$lib/components/TrixEditor.svelte';
	import { goto } from '$app/navigation';

	let { members } = $props();
	let message = $state({
		subject: '',
		body: '<b>You can also Upload pictures here</b>',
		notifyViaEmail: true
	});
	let isLoading = $state(false);

	const postAnnouncement = async (message) => {
		//add the announcement to the db
		const req = await fetch('/api/announcement', {
			method: 'POST',
			body: JSON.stringify({ data: message })
		});
		const res = await req.json();
		if (res.success) {
			return true;
		} else {
			return false;
		}
	};
	const sendEmails = async () => {
		//send emails to every member with an email
		members.forEach(async (member) => {
			if (member.email) {
				let data = {
					type: 'broadcast', //meaning its sent to all students
					fullName: member.name + ' ' + member.surname,
					subject: message.subject,
					message: message.body,
					email: member.email
				};

				const res = await fetch('/api/sendEmail', {
					method: 'POST',
					body: JSON.stringify({ data })
				});
				const r = await res.json();
			}
		});
	};

	const handleSubmit = async () => {
		isLoading = true;
		const isPosted = await postAnnouncement(message);

		if (isPosted && message.notifyViaEmail) {
			await sendEmails();
		}
		//show success
		goto('/executive/membership?p=manageAnnouncements');
		isLoading = false;
	};
</script>

<div in:fly={{ x: 100, duration: 400 }} out:fade={{ duration: 300 }} class=" bg-white">
	{#if isLoading}
		<Loading />
	{:else}
		<div class="w-full space-y-4 p-5 text-black">
			<div class="flex items-center gap-1">
				<button onclick={() => history.back()} class="btn btn-ghost -mx-5 rounded-full"
					><ArrowLeft /></button
				>
				<p class="text-lg font-bold">Send an announcement to members</p>
			</div>
			<form method="POST" onsubmit={handleSubmit} class="flex w-full flex-col gap-5">
				<label class="form-control w-full">
					<p>Subject</p>
					<input
						type="text"
						name="subject"
						class="input input-bordered bg-gray-100"
						id="subject"
						placeholder="Enter the subject"
						required
						bind:value={message.subject}
					/>
				</label>
				<div class="form-control w-full">
					<p>Message</p>
					<TrixEditor id="announcements" bind:value={message.body} />
				</div>
				<label class="label">
					Notify via email
					<input
						type="checkbox"
						bind:checked={message.notifyViaEmail}
						class="checkbox-primary checkbox"
					/>
				</label>
				<button disabled={message.subject.length == 0} class="btn btn-primary" type="submit"
					><SendHorizontal />Send</button
				>
			</form>
		</div>
	{/if}
</div>
