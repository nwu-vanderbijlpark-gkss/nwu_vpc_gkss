<script>
	let email = '';
	let password = '';

	const validateForm = (event) => {
		event.preventDefault(); // Prevent the default form submission

		// Clear previous error messages
		const errors = document.querySelectorAll('.error-message');
		errors.forEach((error) => error.remove());

		let isValid = true;

		// Validate email
		const emailPattern = /^[a-zA-Z0-9._%+-]+@mynwu\.ac\.za$/;
		if (!emailPattern.test(email)) {
			isValid = false;
			showError('email', 'Email must end with @mynwu.ac.za.');
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
</script>

<title>Login | NWU Vaal GKSS</title>
<meta property="og:site_name" content="Login | NWU Vaal GKSS" />
<meta name="twitter:title" content="Login | NWU Vaal GKSS" />
<meta name="twitter:image:alt" content="Login | NWU Vaal GKSS" />
<meta property="title" content="Login" />
<div class="flex min-h-screen flex-col items-center justify-center space-y-5 bg-[#0c0c0c] p-5">
	<h1 class="text-xl font-bold text-white">Login to your account</h1>
	<p class="text-white">Use your student email to login.</p>
	<form method="post" class="flex w-full flex-col gap-5 p-5 lg:w-2/5" on:submit={validateForm}>
		<label class="form-control w-full">
			<p>Student Email</p>
			<input
				type="email"
				bind:value={email}
				name="email"
				class="input input-bordered"
				id="email"
				placeholder="studentnumber@mynwu.ac.za"
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
