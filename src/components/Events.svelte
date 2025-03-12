<script>
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let { events } = $props();
	let modalEvent = $state(null);

	// Sort events by date: upcoming events first
	events = events.sort((a, b) => (moment(a.date).isBefore(moment(b.date)) ? 1 : -1));

	// Function to calculate the remaining time for countdown
	function getTimeRemaining(eventDate) {
		const now = moment();
		const eventMoment = moment(eventDate);
		const duration = moment.duration(eventMoment.diff(now));

		return {
			days: duration.days(),
			hours: duration.hours(),
			minutes: duration.minutes(),
			seconds: duration.seconds()
		};
	}

	// Function to update the countdown every second
	let countdowns = $state([]);

	const updateCountdown = () => {
		countdowns = events.map((event) => ({
			id: event.id,
			remaining: getTimeRemaining(event.date)
		}));
	};

	// Start the countdown updates every second
	setInterval(updateCountdown, 1000);

	// Initialize countdowns
	updateCountdown();

	// Modal functions
	function openModal(event) {
		modalEvent = event;
	}

	function closeModal() {
		modalEvent = null;
	}
	let pathname = $state(null);
	onMount(() => {
		pathname = location.pathname;
	});
</script>

{#if events.length}
	<div class="min-h-screen bg-gray-50 p-10" in:fly={{ x: -100, duration: 400 }}>
		<h2 class="mb-8 text-center text-4xl font-semibold text-gray-900">Upcoming Events</h2>
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each events as event (event.id)}
				{#if event.public}
					<div
						class="relative h-[400px] transform rounded-lg border-l-4 border-indigo-600 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105"
					>
						<div class="absolute right-2 top-2 z-10">
							{#if moment(event.date).isBefore(moment())}
								<span class="rounded-full bg-gray-400 px-3 py-1 text-xs text-white">Past</span>
							{:else}
								<span class="rounded-full bg-indigo-500 px-3 py-1 text-xs text-white">Upcoming</span
								>
							{/if}
						</div>
						<h3 class="mb-4 text-2xl font-semibold text-gray-800">{event.topic}</h3>

						<div class="h-[100px] overflow-hidden text-ellipsis">
							{#if event.description.length > 100}
								<p class="truncate text-base text-gray-600">
									{event.description.substring(0, 300)}...
								</p>
								<button class="mt-2 block text-sm text-indigo-500" onclick={() => openModal(event)}>
									Find out more
								</button>
							{:else}
								<p class="text-base text-gray-600">{event.description}</p>
							{/if}

							{#if event.showFullDescription}
								<p class="text-base text-gray-600">{event.description.substring(100)}</p>
							{/if}
						</div>

						<p class="mb-6 text-sm text-gray-500">{moment(event.date).format('LL')}</p>

						{#if moment(event.date).isAfter(moment())}
							<!-- Countdown component -->
							<div class="mb-6">
								<div class="text-sm text-gray-600">Starts in:</div>
								<div class="flex gap-5">
									<div>
										<span class="countdown font-mono text-4xl">
											<span
												style="--value: {countdowns.find((c) => c.id === event.id)?.remaining
													.days || 0};"
											></span>
										</span>
										days
									</div>
									<div>
										<span class="countdown font-mono text-4xl">
											<span
												style="--value: {countdowns.find((c) => c.id === event.id)?.remaining
													.hours || 0};"
											></span>
										</span>
										hours
									</div>
									<div>
										<span class="countdown font-mono text-4xl">
											<span
												style="--value: {countdowns.find((c) => c.id === event.id)?.remaining
													.minutes || 0};"
											></span>
										</span>
										min
									</div>
									<div>
										<span class="countdown font-mono text-4xl">
											<span
												style="--value: {countdowns.find((c) => c.id === event.id)?.remaining
													.seconds || 0};"
											></span>
										</span>
										sec
									</div>
								</div>
							</div>
							<a href={`/events/${event.id}`} class="btn btn-primary w-full text-center">
								Register Now
							</a>
						{:else}
							<p>This event has occured</p>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>

	{#if modalEvent}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="relative w-full max-w-2xl rounded-lg bg-white p-8">
				<button
					class="absolute right-4 top-4 text-gray-600 hover:text-gray-900"
					onclick={closeModal}
				>
					✕
				</button>
				<h3 class="mb-4 text-2xl font-semibold text-gray-800">{modalEvent.topic}</h3>
				<p class="mb-4 text-base text-gray-600">{modalEvent.description}</p>
				<div class="flex items-center justify-between">
					<p class="text-sm text-gray-500">{moment(modalEvent.date).format('LL')}</p>
					<a href={`/events/${modalEvent.id}#register`} class="btn btn-primary"> Register Now </a>
				</div>
			</div>
		</div>
	{/if}
{:else if pathname == '/events'}
	<p class="p-5 text-lg">There are no planned events yet.</p>
{/if}

<style>
	h1,
	h2,
	h3,
	h4,
	h5 {
		@apply text-gray-900;
	}
	p {
		@apply text-gray-600;
	}
	div {
		cursor: pointer;
	}
</style>
