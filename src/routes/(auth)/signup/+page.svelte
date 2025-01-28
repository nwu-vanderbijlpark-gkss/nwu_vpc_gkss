<script>
	import { enhance } from '$app/forms';

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
</script>

<title>Signup | NWU Vaal GKSS</title>
<meta property="og:site_name" content="Signup | NWU Vaal GKSS" />
<meta name="twitter:title" content="Signup | NWU Vaal GKSS" />
<meta name="twitter:image:alt" content="Signup | NWU Vaal GKSS" />
<meta property="title" content="Signup" />

<div class="flex w-full min-h-screen bg-[#0c0c0c] justify-around items-center p-5">
	<img src="/createAccount.png" alt="code" class="w-2/5 rounded-lg hidden lg:flex"/>
	<div class="flex flex-col items-center p-5 justify-center space-y-5 rounded-xl w-full lg:w-2/5 lg:shadow-2xl lg:bg-base-200">
		<h1 class="text-xl font-bold text-white">Create an account</h1>
	<p class="text-white">
		Use your gmail account, you will receive an email then open gmail and verify your email.
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
	</form>
	<a href="/login" class="btn btn-outline">Login here.</a>
</div>
</div>
