<script>
	let { events } = $props();
</script>

<div class="min-h-screen bg-gray-100 p-10">
	<h2 class="mb-6 text-4xl font-bold">Upcoming Events</h2>
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each events as event}
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h3 class="mb-2 text-2xl font-bold">{event.topic}</h3>
				<p>
					{event.description}
				</p>
			</div>
		{/each}
		<div class="hidden rounded-lg bg-white p-6 shadow-md">
			<h3 class="mb-2 text-2xl font-bold">Open Day</h3>
			<p>Join us on the 7th of February 2025 to be part of the GKSS.</p>
		</div>
		<div class="hidden rounded-lg bg-white p-6 shadow-md">
			<h3 class="mb-2 text-2xl font-bold">Tech Debate</h3>
			<p>
				Dive into a heated discussion on how emerging technologies are shaping our world. This is
				your chance to voice opinions, challenge ideas, and engage with tech enthusiasts.
			</p>
		</div>
		<div class="hidden rounded-lg bg-white p-6 shadow-md">
			<h3 class="mb-2 text-2xl font-bold">Dev Days</h3>
			<p>Learn valuable skills in cyber security and Artificial Intelligence.</p>
		</div>
	</div>
</div>

<style>
	h1,
	h2,
	h3,
	h4,
	h5 {
		@apply text-black;
	}
	p {
		@apply text-base-100;
	}
	div {
		cursor: default;
	}
</style>
