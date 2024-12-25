<div
	id="contact"
	class="flex flex-col items-center justify-center space-y-5 bg-[#0c0c0c] p-5 py-20"
>
	<h1 class="text-xl font-bold text-white">Contact Us</h1>
	<form
		data-netlify="true"
		method="post"
		name="contact"
		class="flex w-full flex-col gap-5 lg:w-2/4"
	>
		<label class="form-control w-full">
			<p>Name</p>
			<input
				type="text"
				name="name"
				class="input input-bordered"
				id="name"
				placeholder="First name"
			/>
		</label>
		<label class="form-control w-full">
			<p>Surname</p>
			<input
				type="text"
				name="surname"
				class="input input-bordered"
				id="surname"
				placeholder="Your surname"
			/>
		</label>
		<label class="form-control w-full">
			<p>Email Address</p>
			<input
				type="email"
				name="email"
				class="input input-bordered"
				id="email"
				placeholder="name12@domain.com"
			/>
		</label>
		<label class="form-control w-full">
			<p>Message</p>
			<textarea
				name="message"
				class="textarea textarea-bordered"
				id="message"
				placeholder="How may we assist?"
			></textarea>
		</label>
		<button type="submit" class="btn btn-primary text-white">Send Message</button>
	</form>
</div>
