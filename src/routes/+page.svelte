<script>
	import ContactUs from "../components/ContactUs.svelte";
	import Events from "../components/Events.svelte";
</script>

<title>Home | NWU Vaal GKSS</title>
<meta property="og:site_name" content="Home | NWU Vaal GKSS">
<meta name="twitter:title" content="Home | NWU Vaal GKSS">
<meta name="twitter:image:alt" content="Home | NWU Vaal GKSS">
<meta property="title" content="Home">

<div class="hero bg-gradient-to-r from-purple-600 to-blue-400 text-white p-10 min-h-screen flex flex-col justify-center items-start">
	<h1 class="text-6xl font-bold lg:w-2/5 mb-4">Welcome to the NWU Vaal GKSS</h1>
	<p class="text-xl lg:w-2/3 mb-6">
		Empowering students through innovation, collaboration, and technology. Join us to learn, grow, and make an impact in the tech world.
	</p>
	<a
		href="/about"
		class="btn btn-primary text-white"
		data-sveltekit-reload
	>
		Learn More About Us
	</a>
</div>

<Events/>



<ContactUs />
