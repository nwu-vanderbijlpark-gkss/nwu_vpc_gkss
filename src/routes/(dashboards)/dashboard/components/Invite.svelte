<script>
	import { Mail } from 'lucide-svelte';
	import moment from 'moment';
	import { fade, fly, slide } from 'svelte/transition';
	import Loading from '$lib/components/Loading.svelte';

	let inviteEmail = $state('');
	let { history } = $props();
	let inviteHistory = $state(history);
	const handleInviteSend = () => {
		isLoading = true;
		if (inviteEmail) {
			inviteHistory = [
				{ email: inviteEmail, status: 'Pending', date: moment().format('YYYY-MM-DD') },
				...inviteHistory
			];
			inviteEmail = '';
			alert('Invitation sent!');
		}
	};
	let isLoading = $state(false);
</script>

<!-- Invite content -->
<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="text-base-200 space-y-6"
>
	<div class="rounded-xl bg-white p-6 shadow-md">
		<h2 class="mb-6 text-2xl font-semibold">Invite Friends</h2>
		<div class="max-w-md">
			<form method="post" action="?/inviteUser" class="flex gap-4">
				<div class="flex-1">
					<label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
					<input
						name="email"
						type="email"
						class="input input-bordered mt-1 w-full bg-gray-200"
						placeholder="friend@example.com"
						bind:value={inviteEmail}
					/>
				</div>
				<button disabled={isLoading} class="btn btn-primary mt-7" onclick={() => handleInviteSend}>
					<Mail size={20} class="mr-2" />{isLoading ? 'Loading...' : 'Send Invite'}
				</button>
			</form>
		</div>
	</div>

	<div class="rounded-xl bg-white p-6 shadow-md">
		<h3 class="mb-4 text-xl font-semibold">Invite History</h3>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr>
						<th class="border-b px-4 py-3 text-left">Email</th>
						<th class="border-b px-4 py-3 text-left">Date</th>
					</tr>
				</thead>
				<tbody>
					{#each inviteHistory as invite}
						<tr>
							<td class="border-b px-4 py-3">{invite.email}</td>

							<td class="border-b px-4 py-3">{moment(invite.created_at).format('MMMM D, YYYY')}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
