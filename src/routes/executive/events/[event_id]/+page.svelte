<script>
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { ArrowLeft } from 'lucide-svelte';

	let { data } = $props();
	let members = data.members;
	let event = $state(data.event);

	let registrationCount = 0;
</script>

<title>{event.topic} | NWU VAAL GKSS</title>
<div class="container mx-auto px-4 py-8">
	<div class="grid gap-8 text-black md:grid-cols-2">
		<!-- Event Details -->
		<div>
			<h1 class="mb-4 text-4xl font-bold">
				<button
					class="rounded-full bg-gray-300 p-2 text-lg shadow-md focus:outline-none"
					onclick={() => history.back(-1)}
					aria-label="Go back"
				>
					<ArrowLeft class="h-6 w-6" />
				</button>{event.topic}
			</h1>
			<p class="mb-4 text-gray-600">{event.description}</p>

			<div class="rounded-lg bg-white p-6 shadow-md">
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
					<span>{event.event_attendee.length}</span>
				</div>
				{#if moment(event.date).isSame(moment(), 'day')}
					<div class="flex justify-between">
						<span class="font-semibold">Attending:</span>
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
		{#if moment(event.date).isSame(moment(), 'day')}
			<div id="register" class="space-y-2 rounded-lg bg-white p-6 shadow-md">
				<p>Manually add attendees here.</p>
				<p class="font-bold text-gray-400">Feature is currently locked.</p>
				<input
					type="text"
					placeholder="Enter full name"
					disabled
					class="input input-bordered w-full bg-gray-100"
				/>
			</div>

			<h2 class="text-xl font-bold text-black">Attendees</h2>
		{/if}
	</div>
	{#if moment(event.date).isSame(moment(), 'day')}
		<div class="max-h-screen space-y-3 overflow-auto py-6 pb-6">
			<table class="w-full text-left text-sm text-gray-600 shadow-xl">
				<thead class="bg-gray-100 text-xs uppercase text-gray-700">
					<tr>
						<th class="px-6 py-4 font-medium">Full Name</th>
						<th class="px-6 py-4 font-medium">Gender</th>
						<th class="px-6 py-4 font-medium">Qualification</th>
						<th class="px-6 py-4 font-medium">Year Of Study</th>
					</tr>
				</thead>
				<tbody>
					{#each event.event_attendee as attendee, index}
						<tr class="border-b transition-colors hover:bg-gray-50">
							<td class="px-6 py-4 font-semibold text-gray-800"
								>{attendee.Member.name ? attendee.Member.name : 'Not provided'}
								{attendee.Member.surname}</td
							>
							<td class="px-6 py-4"
								>{attendee.Member.gender ? attendee.Member.gender : 'Not provided'}</td
							>
							<td class="px-6 py-4"
								>{attendee.Member.qualification
									? attendee.Member.qualification
									: 'Not provided'}</td
							>
							<td class="px-6 py-4"
								>{attendee.Member.year_of_study
									? attendee.Member.year_of_study
									: 'Not provided'}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
