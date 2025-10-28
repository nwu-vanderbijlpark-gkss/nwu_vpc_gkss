<script>
	import { slide } from 'svelte/transition';

	let newPassword = $state(),
		confirmPassword = $state();
	let error = $state(),
		success = $state();

	const handlePasswordChange = (event) => {
		event.preventDefault();
		error = '';
		success = '';
		if (!newPassword || !confirmPassword) {
			error = 'All fields required';
			return;
		}
		if (newPassword !== confirmPassword) {
			error = "Passwords don't match";
			return;
		}
		event.target.submit();
		success = 'Password changed';
		newPassword = confirmPassword = '';
	};
</script>

<div transition:slide class="flex min-h-screen w-full items-center justify-around bg-[#0c0c0c] p-5">
	<img src="/change-password.png" alt="code" class="hidden w-2/5 rounded-lg lg:flex" />
	<div
		class="lg:bg-base-200 flex w-full flex-col items-center justify-center space-y-5 rounded-xl p-5 lg:w-2/5 lg:shadow-2xl"
	>
		<h2 class="text-2xl font-semibold text-white">Change Password</h2>

		{#if error || success}
			<div class={error ? ' text-red-600' : ' text-green-600'}>
				{error || success}
			</div>
		{/if}

		<form
			method="post"
			action="/update-password"
			onsubmit={handlePasswordChange}
			class="w-full space-y-6"
		>
			<div>
				<label class="block text-sm font-medium text-white" for="newPassword">New Password</label>
				<input
					name="newPassword"
					placeholder="Create new password"
					type="password"
					class="input input-bordered mt-1 w-full text-white"
					bind:value={newPassword}
				/>
			</div>
			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-white"
					>Confirm New Password</label
				>
				<input
					name="confirmPassword"
					placeholder="Confirm password"
					type="password"
					class="input input-bordered mt-1 w-full text-white"
					bind:value={confirmPassword}
				/>
			</div>
			<button type="submit" class="btn btn-primary w-full">Change Password</button>
		</form>
	</div>
</div>
