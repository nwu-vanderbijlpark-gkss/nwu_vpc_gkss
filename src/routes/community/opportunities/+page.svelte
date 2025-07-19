<script>
	import { Building, Calendar, MapPin, PenSquare } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { supabase } from '$lib/supabaseClient'; // client-side Supabase instance
	import { onMount } from 'svelte';
	import moment from 'moment';
	import Opportunity from '$lib/components/Opportunity.svelte';
	let { data } = $props();
	let subscription = $state(null);
	let opportunities = $state(data.opportunities);

	onMount(async () => {
		// Setup realtime subscription
		subscription = supabase
			.channel('Opportunity')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'Opportunity'
				},
				(payload) => {
					opportunities = [payload.new, ...opportunities];
				}
			)
			.subscribe();

		// Cleanup on unmount
		return () => {
			if (subscription) {
				supabase.removeChannel(subscription);
			}
		};
	});
</script>

<title>Opportunities | NWU Vaal GKSS</title>

<div in:fly={{ x: 100, duration: 400 }} out:fade={{ duration: 300 }} class="container mx-auto p-4">
	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<span>
			<h1 class="text-3xl font-bold text-black">Opportunities</h1>
			<p class="text-gray-600">Bursaries, internships, free online courses and many more</p>
		</span>

		<a href="/community/opportunities/create" class="btn btn-primary gap-2">
			<PenSquare /> Add an opportunity
		</a>
	</div>

	<!-- Opportunities Grid -->
	<div class="grid grid-cols-1 gap-6 overflow-hidden md:grid-cols-2">
		{#each opportunities as opportunity}
			<div
				class="border-primary-500 border-l-4 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
			>
				<Opportunity {opportunity} />
			</div>
		{/each}
	</div>
</div>
