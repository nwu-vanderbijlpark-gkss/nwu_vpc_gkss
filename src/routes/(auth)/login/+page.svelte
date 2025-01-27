<script>
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
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
			isValid = false;
			showError('email', 'Please enter a valid email address.');
		}

		// Validate password
		if (!password.trim()) {
			isValid = false;
			showError('password', 'Password is required.');
		}

		if (isValid) {
			// Submit the form if validations pass
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
</script>

<title>Login | NWU Vaal GKSS</title>
<meta property="og:site_name" content="Login | NWU Vaal GKSS" />
<meta name="twitter:title" content="Login | NWU Vaal GKSS" />
<meta name="twitter:image:alt" content="Login | NWU Vaal GKSS" />
<meta property="title" content="Login" />
<div class="flex w-full min-h-screen bg-[#0c0c0c] justify-around items-center p-5">
	<img src="/geek.png" alt="code" class="w-2/5 rounded-lg hidden lg:flex"/>
	<div class="flex flex-col items-center p-5 justify-center space-y-5 rounded-xl w-full lg:w-2/5 lg:shadow-2xl lg:bg-base-200">
		<h1 class="text-xl font-bold text-white">Login to your account</h1>
		<p class="text-white">Use your email to login.</p>
		<p class="text-error">{form?.error}</p>
		<form method="post" class="flex w-full flex-col gap-5 p-5 " onsubmit={validateForm}>
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
		</form>
		<a href="/signup" class="btn btn-outline">Create an account here.</a>
	</div>
</div>