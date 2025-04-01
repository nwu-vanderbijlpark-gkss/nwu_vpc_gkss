<script>
	import { fly } from 'svelte/transition';
	import { notifications } from '$lib/stores';
	import { onMount } from 'svelte';
	import { AlertCircle, CheckCircle } from 'lucide-svelte';

	let { type, message, timeout, id } = $props();

	onMount(() => {
		// Play sound when notification appears
		try {
			const audio = new Audio('/sounds/notification.mp3');
			if (document.visibilityState === 'visible') {
				audio.play().catch(() => console.log('Audio playback blocked'));
			}
		} catch (error) {
			console.error('Sound error:', error);
		}

		// Existing timeout logic
		const timer = setTimeout(() => {
			notifications.remove(id);
		}, timeout || 5000);

		return () => clearTimeout(timer);
	});
</script>

<div transition:fly={{ y: 20, duration: 300 }} class="toast toast-middle md:toast-bottom">
	<!-- Keep your existing DaisyUI markup unchanged -->
	<div
		class="notification alert alert-{type} mb-2 flex items-center gap-3 rounded-lg p-4 text-sm font-medium shadow-lg"
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
	/* Your existing styles */
	.notification {
		z-index: 100;
	}
</style>
