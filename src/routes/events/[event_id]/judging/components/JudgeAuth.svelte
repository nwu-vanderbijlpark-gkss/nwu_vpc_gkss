<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let judge = $state({
		code: '',
		email: ''
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		goto($page.url.pathname + '?x=judgeId');
	};
</script>

<div class="w-full">
	<form onsubmit={handleSubmit} class="flex w-full flex-col items-start gap-2">
		<h2 class="text-xl font-bold">Welcome!</h2>
		<p>Use details sent to you via email to proceed</p>
		<label class="form-control w-full">
			<p>Email</p>
			<input
				type="email"
				name="judgeEmail"
				class="input input-bordered border-2 bg-gray-200"
				id="judgeEmail"
				placeholder="Enter your email address"
				bind:value={judge.email}
			/>
		</label>
		<label class="form-control w-full">
			<p>Code</p>
			<input
				type="password"
				name="judgeCode"
				class="input input-bordered border-2 bg-gray-200"
				id="judgeCode"
				placeholder="Enter the code you received with your invite email"
				bind:value={judge.code}
			/>
		</label>
		<button class="btn btn-primary w-full">Proceed</button>
	</form>
</div>
