<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import Loading from '../../../components/Loading.svelte';

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
			sessionStorage.setItem('signup', true);
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

<title>Signup | NWU Vaal GKSS</title>
<meta property="og:site_name" content="Signup | NWU Vaal GKSS" />
<meta name="twitter:title" content="Signup | NWU Vaal GKSS" />
<meta name="twitter:image:alt" content="Signup | NWU Vaal GKSS" />
<meta property="title" content="Signup" />

<div transition:slide class="flex min-h-screen w-full items-center justify-around bg-[#0c0c0c] p-5">
	<img src="/createAccount.png" alt="code" class="hidden w-2/5 rounded-lg lg:flex" />
	<div
		class="flex w-full flex-col items-center justify-center space-y-5 rounded-xl p-5 lg:w-2/5 lg:bg-base-200 lg:shadow-2xl"
	>
		{#if isLoading}
			<Loading />
		{:else}
			<h1 class="text-xl font-bold text-white">Create an account</h1>
			<p class="text-white">
				Use your email account, you will receive an email then open your email app and verify your
				email.
			</p>
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
			</form>
		{/if}
	</div>
</div>
