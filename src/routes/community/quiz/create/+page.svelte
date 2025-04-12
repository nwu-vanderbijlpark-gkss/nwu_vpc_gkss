<script>
	import { fade, fly } from 'svelte/transition';
	import Page from '../../../executive/quizzes/create/+page.svelte';
	import { LogIn } from 'lucide-svelte';
	let { data } = $props();
</script>

{#if data.isLoggedIn}
	<title>Create New Quiz | NWU Vaal GKSS</title>
	<div class="text-white">
		<Page />
	</div>
{:else}
	<div
		in:fly={{ x: 100, duration: 400 }}
		out:fade={{ duration: 300 }}
		class="rounded-xl border-2 border-dashed p-8 text-center"
	>
		<div class="mx-auto max-w-xs space-y-4">
			<LogIn class="mx-auto h-12 w-12 text-primary" />
			<h4 class="text-xl font-semibold">Join the Community</h4>
			<p class="mb-4 text-gray-600">Sign in to be able to create quizzes</p>
			<a href="/login" class="btn btn-primary w-full gap-2">
				<LogIn class="h-5 w-5" />
				Login to Continue
			</a>
		</div>
	</div>
{/if}
