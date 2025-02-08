<script>
	import moment from "moment";
  
	let { events } = $props();
	let modalEvent = $state(null);
  
	// Sort events by date: upcoming events first
	events = events.sort((a, b) => moment(a.date).isBefore(moment(b.date)) ? 1 : -1);
  
	// Function to calculate the remaining time for countdown
	function getTimeRemaining(eventDate) {
	  const now = moment();
	  const eventMoment = moment(eventDate);
	  const duration = moment.duration(eventMoment.diff(now));
  
	  return {
		days: duration.days(),
		hours: duration.hours(),
		minutes: duration.minutes(),
		seconds: duration.seconds(),
	  };
	}
  
	// Function to update the countdown every second
	let countdowns = $state([]);
  
	const updateCountdown = () => {
	  countdowns = events.map((event) => ({
		id: event.id,
		remaining: getTimeRemaining(event.date),
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
</script>
  
<div class="min-h-screen bg-gray-50 p-10">
	<h2 class="mb-8 text-4xl font-semibold text-center text-gray-900">Upcoming Events</h2>
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
	  {#each events as event (event.id)}
		<div class="relative bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-600 transform transition-all duration-300 hover:scale-105 h-[400px]">
		  <div class="absolute top-2 right-2 z-10">
			{#if moment(event.date).isBefore(moment())}
			  <span class="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">Past</span>
			{:else}
			  <span class="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">Upcoming</span>
			{/if}
		  </div>
		  <h3 class="text-2xl font-semibold text-gray-800 mb-4">{event.topic}</h3>
  
		  <div class="overflow-hidden text-ellipsis h-[100px]">
			{#if event.description.length > 100}
			  <p class="text-base text-gray-600 truncate">{event.description.substring(0, 300)}...</p>
			  <button class="text-sm text-indigo-500 mt-2 block" onclick={() => openModal(event)}>
				Find out more
			  </button>
			{:else}
			  <p class="text-base text-gray-600">{event.description}</p>
			{/if}
  
			{#if event.showFullDescription}
			  <p class="text-base text-gray-600">{event.description.substring(100)}</p>
			{/if}
		  </div>
  
		  <p class="text-sm text-gray-500 mb-6">{moment(event.date).format('LL')}</p>
  
		  {#if moment(event.date).isAfter(moment())}
			<!-- Countdown component -->
			<div class="mb-6">
			  <div class="text-sm text-gray-600">Starts in:</div>
			  <div class="flex gap-5">
				<div>
				  <span class="countdown font-mono text-4xl">
					<span style="--value: {countdowns.find(c => c.id === event.id)?.remaining.days || 0};"></span>
				  </span>
				  days
				</div>
				<div>
				  <span class="countdown font-mono text-4xl">
					<span style="--value: {countdowns.find(c => c.id === event.id)?.remaining.hours || 0};"></span>
				  </span>
				  hours
				</div>
				<div>
				  <span class="countdown font-mono text-4xl">
					<span style="--value: {countdowns.find(c => c.id === event.id)?.remaining.minutes || 0};"></span>
				  </span>
				  min
				</div>
				<div>
				  <span class="countdown font-mono text-4xl">
					<span style="--value: {countdowns.find(c => c.id === event.id)?.remaining.seconds || 0};"></span>
				  </span>
				  sec
				</div>
			  </div>
			</div>
			<a data-sveltekit-reload href={`/events/${event.id}#register`} class="btn btn-primary w-full text-center">
				Register Now
			  </a>
			  {:else}
			  <p>This event has occured</p>
		  {/if}
		</div>
	  {/each}
	</div>
  </div>
  
  <style>
	h1, h2, h3, h4, h5 {
	  @apply text-gray-900;
	}
	p {
	  @apply text-gray-600;
	}
	div {
	  cursor: pointer;
	}
  </style>

  {#if modalEvent}
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full relative">
        <button 
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onclick={closeModal}
        >
          ✕
        </button>
        <h3 class="text-2xl font-semibold text-gray-800 mb-4">{modalEvent.topic}</h3>
        <p class="text-base text-gray-600 mb-4">{modalEvent.description}</p>
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500">{moment(modalEvent.date).format('LL')}</p>
          <a 
            href={`/events/${modalEvent.id}#register`} 
            class="btn btn-primary"
			data-sveltekit-reload
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  {/if}