<script>
	import ContactUs from '../components/ContactUs.svelte';
	import Events from '../components/Events.svelte';
	import TodaysBirthdays from '../components/TodaysBirthdays.svelte';
	let { data } = $props();
	let todaysBirthdays = data.members.filter((member) => {
		const today = new Date();
		const birthDate = new Date(member.date_of_birth);

		// Check if the member's birthday is today (ignore the year)
		return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
	});
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
	<div
		class="container mx-auto grid items-center gap-8 overflow-hidden bg-gray-100 p-5 lg:grid-cols-2 lg:px-6 lg:py-0"
	>
		<!-- Text Content -->
		<div class="text-center lg:text-left">
			<h2 class="text-5xl font-bold text-indigo-600">Unite. Create. Inspire.</h2>
			<p class="mt-6 text-xl text-gray-800">
				Step into a vibrant community where students and tech enthusiasts come together to exchange
				ideas, fuel creativity, and build a brighter future.
			</p>
			<p class="mt-4 text-xl text-gray-800">
				Dive into thought-provoking discussions or bring your ideas to life in the Project Space—a
				showcase for innovation and ingenuity.
			</p>
			<div class="mt-8">
				<a
					href="/community"
					data-sveltekit-reload
					class="btn btn-primary btn-lg text-white hover:bg-indigo-700"
				>
					Join the Movement
				</a>
			</div>
		</div>

		<!-- Image Content -->
		<div class="relative">
			<!-- Decorative Images -->
			<img
				src="/inaction.jpg"
				alt="Students connecting in action"
				class="transform rounded-lg shadow-lg transition duration-300 hover:scale-105"
			/>
			<img
				src="/backdrop.jpeg"
				alt="Dynamic community discussions"
				class="absolute -left-12 -top-12 h-28 w-28 rotate-6 transform rounded-full border-4 border-indigo-600 shadow-md transition duration-300 hover:rotate-0"
			/>
			<img
				src="/team.jpg"
				alt="Collaborative innovation"
				class="absolute -bottom-12 -right-12 h-32 w-32 -rotate-6 transform rounded-full border-4 border-indigo-600 shadow-md transition duration-300 hover:rotate-0"
			/>
		</div>
	</div>
</section>

<Events events={data.events} />
<div class="p-4">
	<TodaysBirthdays {todaysBirthdays} />
</div>

<ContactUs />
