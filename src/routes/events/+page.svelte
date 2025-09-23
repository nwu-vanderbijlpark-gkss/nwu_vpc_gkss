<script>
	import { Check, CheckCheckIcon, DotIcon } from 'lucide-svelte';
	import Events from '$lib/components/Events.svelte';
	import CalendarView from '$lib/components/CalendarView.svelte';
	import { fade, fly } from 'svelte/transition';
	import { models } from '$lib/state.svelte.js';
	import Seo from '$lib/components/SEO.svelte';
	import { gkssConfig } from '$lib/config.ts';
	let { data } = $props();
	models.context = 'Events: ' + JSON.stringify(data.events);
</script>

<Seo
	title="Events"
	desc="Stay updated with the latest events organized by {gkssConfig.name}. Explore our event calendar and register for upcoming activities."
/>

<Events events={data.events} />
<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="card rounded-none bg-base-100 shadow-xl"
>
	<div class="card-body">
		<CalendarView events={data.events} />
	</div>
</div>
