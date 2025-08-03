<script>
	import TrixDisplay from '$lib/components/TrixDisplay.svelte';
	import TrixEditor from '$lib/components/TrixEditor.svelte';
	import { Brain } from 'lucide-svelte';
	import moment from 'moment';

	let { event = $bindable() } = $props();
	let form = $state({
		instructions: ''
	});
</script>

<section class="flex flex-col items-start gap-2 lg:grid lg:grid-cols-2 lg:divide-x">
	<div class="flex w-full flex-col justify-center space-y-2 px-4">
		<TrixDisplay content={event.description} />
	</div>
	<div class="px-4">
		<div class="mb-2 flex justify-between">
			<span class="font-semibold">Date:</span>
			<span>{moment(event.date).format('LLLL')}</span>
		</div>
		<div class=" flex justify-between">
			<span class="font-semibold">Venue:</span>
			<span>{event.venue}</span>
		</div>
		<div class="flex justify-between">
			<span class="font-semibold">Registered: </span>
			<span>0</span>
		</div>
		<div class="divider">Tips <Brain size={30} /></div>
		<p>*Go to Judging to manage judges and judging criteria</p>
		<p>*Go to Participants to manage participants and teams</p>
	</div>
</section>
