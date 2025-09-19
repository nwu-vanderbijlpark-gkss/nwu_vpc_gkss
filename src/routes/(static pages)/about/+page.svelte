<script>
	import Seo from '$lib/components/SEO.svelte';
	import { fade, fly } from 'svelte/transition';

	//
</script>

<Seo
	title="About NWU Vaal GKSS"
	desc="Learn more about the Geekulcha Student Society (GKSS) at NWU Vaal Campus. Discover our mission, vision, and the vibrant community we are building to foster innovation and collaboration in technology."
/>

<div in:fly={{ x: 100, duration: 400 }} class="min-h-screen bg-gray-100 p-10">
	<!-- Section for Society Information -->
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold text-purple-600">About NWU Vaal GKSS</h1>
		<p class="text-xl text-gray-700">
			The Geekulcha Student Society (GKSS) at the NWU Vaal Campus is dedicated to fostering
			innovation, collaboration, and empowerment in the world of technology. Our goal is to bring
			together students passionate about tech to learn, create, and grow.
		</p>
	</div>

	<!-- Image Section -->
	<div class="mb-8 flex justify-center">
		<img
			src="team.jpg"
			alt="NWU Vaal GKSS members in action"
			class="h-auto max-w-full rounded-lg shadow-lg"
		/>
	</div>

	<!-- Mission and Vision -->
	<div class="mb-12 text-center">
		<h2 class="mb-6 text-3xl font-semibold text-gray-800">Our Mission</h2>
		<p class="mb-6 text-lg text-gray-600">
			Our mission is to empower students with the tools, knowledge, and opportunities to explore the
			world of technology through workshops, events, and collaborative projects.
		</p>

		<h2 class="mb-6 text-3xl font-semibold text-gray-800">Our Vision</h2>
		<p class="text-lg text-gray-600">
			We envision a future where every student has the chance to contribute to and shape the
			ever-evolving tech landscape, building a vibrant community of innovators.
		</p>
	</div>

	<!-- Call to Action (CTA) -->
	<div class="text-center">
		<a href="/#contact" class="btn btn-primary text-white"> Get Involved </a>
	</div>
</div>
