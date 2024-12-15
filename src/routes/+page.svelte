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

<Events events={data.events} />

<ContactUs />
