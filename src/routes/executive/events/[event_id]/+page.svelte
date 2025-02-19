<script>
	import { onMount } from 'svelte';
	import moment from 'moment';

	let { data } = $props();
	let event = $state(data.event);

	let registrationCount = 0;
</script>

<title>{event.topic} | NWU VAAL GKSS</title>
<div class="container mx-auto px-4 py-8">
	<div class="grid gap-8 text-black md:grid-cols-2">
		<!-- Event Details -->
		<div>
			<h1 class="mb-4 text-4xl font-bold">{event.topic}</h1>
			<p class="mb-4 text-gray-600">{event.description}</p>

			<div class="rounded-lg bg-white p-6 shadow-md">
				<div class="mb-2 flex justify-between">
					<span class="font-semibold">Date:</span>
					<span>{moment(event.date).format('LLLL')}</span>
				</div>
				<div class="flex justify-between">
					<span class="font-semibold">Registered Attendees: </span>
					<span>{event.event_attendee.length}</span>
				</div>
				{#if moment().add(1, 'hour').isAfter(moment(event.date))}
					<div class="flex justify-between">
						<span class="font-semibold">Actual Attendees:</span>
						<span>{event.event_attendee.filter((a) => a.status == 'attended').length}</span>
					</div>
					<p class="text-success">
						{Number(
							(event.event_attendee.filter((a) => a.status == 'attended').length /
								event.event_attendee.length) *
								100
						).toFixed(0)}% attended
					</p>
				{/if}
			</div>
		</div>

		<!-- Other stats -->
		<div id="register" class="rounded-lg bg-white p-6 shadow-md">
			{#if moment().add(1, 'hour').isAfter(moment(event.date))}
				yoh
			{/if}
			<input
				type="text"
				placeholder="Click to copy url"
				readonly
				class="input input-bordered w-full bg-gray-100"
			/>
		</div>
	</div>
</div>
