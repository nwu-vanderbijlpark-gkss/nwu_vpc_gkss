<script>
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import Loading from '$lib/components/Loading.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import { gkssConfig } from '$lib/config.ts';

	let email = $state('');
	let password = $state('');

	function validateForm(event) {
		event.preventDefault(); // Prevent the default form submission

		// Clear previous error messages
		const errors = document.querySelectorAll('.error-message');
		errors.forEach((error) => error.remove());

		let isValid = true;

		// Validate email
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailPattern.test(email)) {
			isValid = false;
			showError('email', 'Please enter a valid email address.');
		}

		// Validate password
		if (password.length < 8) {
			isValid = false;
			showError('password', 'Password must be at least 8 characters long.');
		}

		if (isValid) {
			// Submit the form if all validations pass
			isLoading = true;
			event.target.submit();
		}
	}

	function showError(inputId, message) {
		const inputField = document.getElementById(inputId);
		const errorMessage = document.createElement('p');
		errorMessage.className = 'error-message text-red-500 text-sm mt-1';
		errorMessage.textContent = message;
		inputField.insertAdjacentElement('afterend', errorMessage);
	}
	let { form } = $props();
	let isLoading = $state(false);
</script>

<Seo
	title="Signup"
	desc="Join {gkssConfig.name} today! Create your account to access exclusive member benefits, events, and resources."
/>

<div transition:slide class="flex min-h-screen w-full items-center justify-around bg-[#0c0c0c] p-5">
	<div
		class="lg:bg-base-200 flex w-full flex-col items-center justify-center space-y-5 rounded-xl p-5 lg:w-2/5 lg:shadow-2xl"
	>
		{#if isLoading}
			<Loading />
		{:else}
			<h1 class="text-xl font-bold text-white">Welcome to {gkssConfig.name}!</h1>
			<h1 class=" text-white">Join the community by creating an account</h1>

			<p class=" text-error">{form?.error}</p>
			<form
				use:enhance
				method="post"
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
						placeholder="name@domain.com"
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
						placeholder="Create your password"
					/>
				</label>
				<button type="submit" class="btn btn-primary text-white">Signup</button>
				<a href="/login" class="btn btn-outline">Login here.</a>
				<span class="text-sm"
					>By signing up, I agree to {gkssConfig.name}'s
					<a class="link underline" target="_blank" href="/docs/Terms and Conditions.pdf"
						>Terms of Use</a
					>
					and
					<a class="link underline" target="_blank" href="/docs/Privacy Policy.pdf"
						>Privacy Policy</a
					></span
				>
			</form>
		{/if}
	</div>
</div>
