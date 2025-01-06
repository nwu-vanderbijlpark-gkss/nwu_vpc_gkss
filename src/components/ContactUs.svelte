<script>
	let formState = {
		name: '',
		surname: '',
		email: '',
		message: ''
	};
	let isSubmitting = false;
	let successMessage = '';
	let errorMessage = '';

	async function handleSubmit(event) {
		event.preventDefault(); // Prevent the default form submission behavior
		isSubmitting = true;
		const inputs = document.getElementsByClassName('form-input');
		for (let i = 0; i < inputs.length; i++) {
			const element = inputs[i];
			element.disabled = true; //disable the inputs when submitting
		}

		successMessage = '';
		errorMessage = '';

		const formData = new FormData(event.target);

		try {
			const response = await fetch('/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(formData).toString()
			});

			if (response.ok) {
				successMessage = 'Your message has been sent successfully!';
				formState = { name: '', surname: '', email: '', message: '' }; // Reset the form state
			} else {
				errorMessage = 'There was an error sending your message. Please try again.';
			}
		} catch (error) {
			errorMessage = 'There was an error sending your message. Please try again.';
		} finally {
			isSubmitting = false;
			for (let i = 0; i < inputs.length; i++) {
				const element = inputs[i];
				element.disabled = false; //enable the inputs when submitting
			}
		}
	}
</script>

<div
	id="contact"
	class="flex flex-col items-center justify-center space-y-5 bg-[#0c0c0c] p-5 py-20"
>
	<h1 class="text-xl font-bold text-white">Contact Us</h1>
	<form on:submit={handleSubmit} name="contact" class="flex w-full flex-col gap-5 lg:w-2/4">
		<label class="form-control w-full">
			<p>Name</p>
			<input
				type="text"
				name="name"
				class="form-input input input-bordered"
				id="name"
				placeholder="First name"
				bind:value={formState.name}
				required
			/>
		</label>
		<label class="form-control w-full">
			<p>Surname</p>
			<input
				type="text"
				name="surname"
				class="form-input input input-bordered"
				id="surname"
				placeholder="Your surname"
				bind:value={formState.surname}
				required
			/>
		</label>
		<label class="form-control w-full">
			<p>Email Address</p>
			<input
				type="email"
				name="email"
				class="form-input input input-bordered"
				id="email"
				placeholder="name12@domain.com"
				bind:value={formState.email}
				required
			/>
		</label>
		<label class="form-control w-full">
			<p>Message</p>
			<textarea
				name="message"
				class="form-input textarea textarea-bordered"
				id="message"
				placeholder="How may we assist?"
				bind:value={formState.message}
				required
			></textarea>
		</label>
		<input type="hidden" name="form-name" value="contact" />
		<button type="submit" class="btn btn-primary text-white" disabled={isSubmitting}>
			{isSubmitting ? 'Sending...' : 'Send Message'}
		</button>
	</form>
	{#if successMessage}
		<p class="mt-4 text-green-500">{successMessage}</p>
	{/if}
	{#if errorMessage}
		<p class="mt-4 text-red-500">{errorMessage}</p>
	{/if}
</div>
