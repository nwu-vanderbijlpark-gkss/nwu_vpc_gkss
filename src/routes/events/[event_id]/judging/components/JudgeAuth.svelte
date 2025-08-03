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

<div class="flex h-full w-full flex-col items-center justify-center">
	<h1 class="text-lg font-bold">Unfortunately, you cannot proceed</h1>
	<p>You have to be invited to be able to access this page!</p>
</div>
