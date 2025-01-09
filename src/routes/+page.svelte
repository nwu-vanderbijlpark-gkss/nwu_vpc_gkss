<script>
	import ContactUs from '../components/ContactUs.svelte';
	import Events from '../components/Events.svelte';
	let { data } = $props();
</script>

<title>Home | NWU Vaal GKSS</title>
<meta property="og:site_name" content="Home | NWU Vaal GKSS" />
<meta name="twitter:title" content="Home | NWU Vaal GKSS" />
<meta name="twitter:image:alt" content="Home | NWU Vaal GKSS" />
<meta property="title" content="Home" />

<div
	class="hero flex min-h-screen flex-col items-start justify-center bg-gradient-to-r from-purple-600 to-blue-400 p-10 text-white"
>
	<h1 class="mb-4 text-6xl font-bold lg:w-2/5">Welcome to the NWU Vaal GKSS</h1>
	<p class="mb-6 text-xl lg:w-2/3">
		Empowering students through innovation, collaboration, and technology. Join us to learn, grow,
		and make an impact in the tech world.
	</p>

	<a href="/about" class="btn btn-primary text-white" data-sveltekit-reload>
		Learn More About Us
	</a>
</div>
<section class="flex min-h-screen items-center justify-center bg-base-200">
	<div class="container mx-auto grid items-center gap-8 p-5 lg:grid-cols-2 lg:px-6 lg:py-0">
		<!-- Text Content -->
		<div class="text-center lg:text-left">
			<h2 class="text-5xl font-bold text-primary">Discover the Community Forum</h2>
			<p class="mt-6 text-xl text-gray-700">
				Connect with fellow students, share your experiences, and grow together! Join engaging
				discussions, get advice, and build lasting connections.
			</p>
			<div class="mt-8">
				<a href="/community" data-sveltekit-reload class="btn btn-primary btn-lg">
					Explore the Forum
				</a>
			</div>
		</div>

		<!-- Image Content -->
		<div class="relative">
			<!-- Decorative Images -->
			<img src="/inaction.jpg" alt="Students connecting" class="rounded-lg shadow-lg" />
			<img
				src="/backdrop.jpeg"
				alt="Community discussion"
				class="absolute -left-10 -top-10 h-28 w-28 rounded-full border-4 border-primary shadow-md"
			/>
			<img
				src="/team.jpg"
				alt="Engaging discussions"
				class="absolute -bottom-10 -right-10 h-32 w-32 rounded-full border-4 border-primary shadow-md"
			/>
		</div>
	</div>
</section>

<Events events={data.events} />

<ContactUs />
