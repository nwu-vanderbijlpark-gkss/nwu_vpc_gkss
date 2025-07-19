<script>
	import { Check, CheckCheckIcon, DotIcon } from 'lucide-svelte';
	import Events from '$lib/components/Events.svelte';
	import CalendarView from '$lib/components/CalendarView.svelte';
	import { fade, fly } from 'svelte/transition';
	let { data } = $props();
</script>

<title>Events | NWU Vaal GKSS </title>
<meta property="og:site_name" content="Events | NWU Vaal GKSS" />
<meta name="twitter:title" content="Events | NWU Vaal GKSS" />
<meta name="twitter:image:alt" content="Events | NWU Vaal GKSS" />
<meta property="title" content="Events" />
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
