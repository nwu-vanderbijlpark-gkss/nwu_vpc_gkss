<script>
</script>

<div class="flex min-h-screen flex-col items-center justify-center space-y-5 bg-[#0c0c0c] p-5">
	<h1 class="text-xl font-bold text-white">Login to your account</h1>
	<p>It's easy to login, we use a passwordless method</p>
	<form method="post" class="flex w-full flex-col gap-5 p-5 lg:w-2/5">
		<label class="form-control w-full">
			<p>Student Email</p>
			<input
				type="email"
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
