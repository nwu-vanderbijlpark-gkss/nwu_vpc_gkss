<script>
	import { fly } from 'svelte/transition';
	import { notifications } from '$lib/stores';
	import { onMount } from 'svelte';
	import { AlertCircle, CheckCircle } from 'lucide-svelte';

	let { type, message, timeout, id } = $props();

	onMount(() => {
		const timer = setTimeout(() => {
			notifications.remove(id);
		}, 5000);

		return () => clearTimeout(timer);
	});
</script>

<div transition:fly={{ y: 20, duration: 300 }} class="toast">
	<div
		class="alert alert-{type} mb-2 flex items-center gap-3 rounded-lg p-4 text-sm font-medium shadow-lg"
		class:bg-success={type === 'success'}
		class:bg-error={type === 'error'}
	>
		{#if type === 'success'}
			<CheckCircle class="h-5 w-5" />
		{:else if type === 'error'}
			<AlertCircle class="h-5 w-5" />
		{/if}
		{message}
	</div>
</div>

<style>
	.notification {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 100;
	}
</style>
