<script>
	import ContactUs from "../components/ContactUs.svelte";
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
		class="bg-white text-purple-600 font-bold py-3 px-6 rounded-md shadow-lg hover:bg-purple-100 transition duration-300"
	>
		Learn More About Us
	</a>
</div>

<div class="p-10 min-h-screen bg-gray-100">
	<h2 class="text-4xl font-bold mb-6">Upcoming Events</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
		<div class="bg-white shadow-md rounded-lg p-6">
			<h3 class="text-2xl font-bold mb-2">Open Day</h3>
			<p>Join us on the 7th of February 2025 to be part of the GKSS.</p>
		</div>
		<div class="bg-white shadow-md rounded-lg p-6">
			<h3 class="text-2xl font-bold mb-2">Tech Debate</h3>
			<p>
				Dive into a heated discussion on how emerging technologies are shaping our world. 
				This is your chance to voice opinions, challenge ideas, and 
				engage with tech enthusiasts.
			</p>
		</div>
		<div class="bg-white shadow-md rounded-lg p-6">
			<h3 class="text-2xl font-bold mb-2">Dev Days</h3>
			<p>Learn valuable skills in cyber security and Artificial Intelligence.</p>
		</div>
	</div>
</div>



<ContactUs />
