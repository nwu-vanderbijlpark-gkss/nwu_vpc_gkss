<script>
	import Loading from '$lib/components/Loading.svelte';
	import TrixEditor from '$lib/components/TrixEditor.svelte';
	import { notifications } from '$lib/stores';
	import { supabase } from '$lib/supabaseClient';
	import { onDestroy, onMount } from 'svelte';

	let { event = $bindable() } = $props();

	let view = $state('Participants');

	let isLoading = $state(false);

	const handleSubmit = async () => {
		isLoading = true;
		const req = await fetch('/api/event', {
			method: 'PUT',
			body: JSON.stringify({ data: event })
		});
		const res = await req.json();
		if (res.success) {
			notifications.add({
				type: 'success',
				message: 'Event resources updated successfully'
			});
		}
		isLoading = false;
	};

	onMount(() => {
		const channels = supabase
			.channel('participants_updates')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'event_participant' },
				(payload) => {
					console.log('Change received!', payload);
				}
			)
			.subscribe();

		return channels.unsubscribe();
	});
</script>

<div class="max-h-screen space-y-3 overflow-auto pb-6">
	<h2 class="text-lg font-bold">Resources</h2>
	{#if isLoading}
		<Loading text="Loading resources..." />
	{:else}
		<TrixEditor bind:value={event.resources} id="{event.topic}_resources" />
		<button class="btn btn-primary w-full" onclick={handleSubmit}>Save</button>
	{/if}
</div>
