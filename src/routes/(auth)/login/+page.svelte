<script>
	import { ArrowLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Loading from '$lib/components/Loading.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import { gkssConfig } from '$lib/config.ts';

	let email = $state('');
	let password = $state('');
	let fromSignup = $state();

	const validateForm = (event) => {
		event.preventDefault(); // Prevent the default form submission

		// Clear previous error messages
		const errors = document.querySelectorAll('.error-message');
		errors.forEach((error) => error.remove());

		let isValid = true;

		// Validate email
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailPattern.test(email)) {
			if (navigator.vibrate) {
				navigator.vibrate(200);
			}
			isValid = false;
			showError('email', 'Please enter a valid email address.');
		}

		// Validate password
		if (!password.trim()) {
			if (navigator.vibrate) {
				navigator.vibrate(200);
			}
			isValid = false;
			showError('password', 'Password is required.');
		}

		if (isValid) {
			// Submit the form if validations pass
			isLoading = true;
			event.target.submit();
		}
	};

	const showError = (inputId, message) => {
		const inputField = document.getElementById(inputId);
		const errorMessage = document.createElement('p');
		errorMessage.className = 'error-message text-red-500 text-sm mt-1';
		errorMessage.textContent = message;
		inputField.insertAdjacentElement('afterend', errorMessage);
	};
	onMount(() => {
		fromSignup = sessionStorage.getItem('signup');
	});
	let { form } = $props();
	let view = $state('login'); //can be login for the login form or reset for reset password form
	let isLoading = $state(false);
</script>

<Seo
	title="Login"
	desc="Login to your {gkssConfig.name}account to access exclusive member features and stay connected with the community."
/>
<div transition:fly class="flex min-h-screen w-full items-center justify-around bg-[#0c0c0c] p-5">
	<img src="/geek.png" alt="code" class="hidden w-2/5 rounded-lg lg:flex" />
	<div
		class="flex w-full flex-col items-center justify-center space-y-5 rounded-xl p-5 lg:w-2/5 lg:bg-base-200 lg:shadow-2xl"
	>
		{#if isLoading}
			<Loading />
		{:else}
			<h1 class="flex w-full items-center space-x-2 text-xl font-bold text-white">
				{#if view == 'login'}
					Login to your account
				{:else}
					<button
						class="btn btn-ghost rounded-full"
						onclick={(event) => {
							event.preventDefault();
							view = 'login';
						}}><ArrowLeft /></button
					> Reset Password
				{/if}
			</h1>
			<p class="text-error">
				{#if form?.error === 'invalid_credentials'}
					Incorrect email or password
					<a
						href="/login"
						onclick={(event) => {
							event.preventDefault();
							view = 'reset';
						}}
						class="link link-secondary text-sm">Forgot password?</a
					>
				{/if}
			</p>
			{#if view == 'login'}
				<form
					transition:fly
					method="post"
					action="/login?/login"
					class="flex w-full flex-col gap-5 p-5"
					onsubmit={validateForm}
				>
					<label class="form-control w-full">
						<p>Email</p>
						<input
							type="email"
							bind:value={email}
							name="email"
							class="input input-bordered"
							id="email"
							placeholder="name.surname@domain.com"
						/>
					</label>
					<label class="form-control w-full">
						<p>Password</p>
						<input
							type="password"
							bind:value={password}
							name="password"
							class="input input-bordered"
							id="password"
							placeholder="Enter your password"
						/>
					</label>
					<button type="submit" class="btn btn-primary text-white">Login</button>
					<a href="/signup" class="btn btn-outline">Create an account here.</a>
				</form>
				<div class="flex w-full justify-between">
					<a
						href="/login"
						onclick={(event) => {
							event.preventDefault();
							view = 'reset';
						}}
						class="link-hover btn btn-ghost link-primary">Forgot password?</a
					>
				</div>
			{:else}
				<form
					method="post"
					transition:fly
					action="/login?/resetPassword"
					class="flex w-full flex-col gap-5 p-2"
				>
					<p>Enter your email to reset password</p>
					<label class="form-control w-full">
						<p>Email</p>
						<input
							type="email"
							name="email"
							class="input input-bordered"
							id="email"
							placeholder="Enter your email"
						/>
					</label>
					<button type="submit" class="btn btn-primary text-white">Reset password</button>
				</form>
			{/if}
		{/if}
	</div>
</div>
