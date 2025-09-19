<script>
	import { UserPlus } from 'lucide-svelte';
	import ContactUs from '$lib//components/Chart.svelte';
	import Events from '$lib/components/Events.svelte';
	import TodaysBirthdays from '$lib/components/TodaysBirthdays.svelte';
	import { onMount } from 'svelte';
	import { fade, fly, scale, slide, draw, crossfade } from 'svelte/transition';
	import { elasticOut, backOut, bounceOut, quintOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { spring } from 'svelte/motion';
	import Seo from '$lib/components/SEO.svelte';

	let { data } = $props();
	let todaysBirthdays = data.members.filter((member) => {
		const today = new Date();
		const birthDate = new Date(member.date_of_birth);

		// Check if the member's birthday is today (ignore the year)
		return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
	});

	// Animation control
	let visible = $state(false);
	let sectionsVisible = $state({
		hero: false,
		community: false,
		quizzes: false,
		leaderboard: false,
		generator: false,
		dashboard: false,
		events: false,
		birthdays: false,
		contact: false
	});

	// Spring animation for hover effects
	const buttonScale = spring(
		{ x: 1, y: 1 },
		{
			stiffness: 0.1,
			damping: 0.2
		}
	);

	// Intersection observer for scroll animations
	let observer;

	onMount(() => {
		visible = true;

		// Set up intersection observer to trigger animations as elements scroll into view
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionsVisible[entry.target.dataset.section] = true;
					}
				});
			},
			{ threshold: 0.2 }
		);

		// Observe all sections
		document.querySelectorAll('[data-section]').forEach((section) => {
			observer.observe(section);
		});

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	// Hover animations
	function handleMouseEnter() {
		buttonScale.set({ x: 1.05, y: 1.05 });
	}

	function handleMouseLeave() {
		buttonScale.set({ x: 1, y: 1 });
	}

	// Create crossfade animation for images
	const [send, receive] = crossfade({
		duration: 400,
		fallback: scale
	});
</script>

<Seo
	title="Home"
	desc="Welcome to the NWU Vaal GKSS! Empowering students through innovation, collaboration, and technology. Join us to learn, grow, and make an impact in the tech world."
/>

<section
	class="relative flex min-h-screen flex-col items-center bg-base-300 lg:flex-row"
	data-section="hero"
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
>
	{#if visible}
		<div
			class="hero relative z-30 flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center p-10 text-center text-white"
			style="background-image: url('/logo.png');"
			in:fade={{ duration: 800 }}
		>
			<div class="absolute inset-0 bg-base-300 bg-opacity-95"></div>
			<div class="relative z-40 flex flex-col items-center justify-center">
				{#if sectionsVisible.hero}
					<h1
						class="mb-4 text-center text-6xl font-bold lg:w-2/4 lg:text-7xl"
						in:fly={{ y: 50, duration: 800, delay: 200, easing: quintOut }}
					>
						Welcome to the NWU Vaal GKSS
					</h1>
					<p
						class="mb-6 text-xl lg:w-2/3"
						in:fly={{ y: 50, duration: 800, delay: 400, easing: quintOut }}
					>
						Empowering students through innovation, collaboration, and technology. Join us to learn,
						grow, and make an impact in the tech world.
					</p>
					<div
						class="flex flex-col gap-4 lg:flex-row"
						in:fly={{ y: 50, duration: 800, delay: 600, easing: quintOut }}
					>
						<a
							href="/about"
							class="btn btn-outline text-white"
							onmouseenter={handleMouseEnter}
							onmouseleave={handleMouseLeave}
							style="transform: scale({$buttonScale.x}, {$buttonScale.y})"
						>
							Learn More About Us
						</a>
						<a
							href="/signup"
							class="btn btn-primary text-white"
							in:scale={{ duration: 300, delay: 800, start: 0.8 }}
							onmouseenter={handleMouseEnter}
							onmouseleave={handleMouseLeave}
							style="transform: scale({$buttonScale.x}, {$buttonScale.y})"
						>
							Create a profile
							<UserPlus />
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</section>

<section class="flex min-h-screen items-center justify-center bg-gray-300" data-section="community">
	<div
		class="container mx-auto grid items-center gap-8 overflow-hidden p-5 lg:grid-cols-2 lg:overflow-visible lg:px-6 lg:py-0"
	>
		<!-- Text Content -->
		{#if sectionsVisible.community}
			<div class="text-center lg:text-left" in:fly={{ x: -50, duration: 800, easing: elasticOut }}>
				<h2 class="text-5xl font-bold text-red-600">Unite. Create. Inspire.</h2>
				<p class="mt-6 text-xl text-gray-800">
					Step into a vibrant community where students and tech enthusiasts come together to
					exchange ideas, fuel creativity, and build a brighter future.
				</p>
				<p class="mt-4 text-xl text-gray-800">
					Dive into thought-provoking discussions or bring your ideas to life in the Project Space—a
					showcase for innovation and ingenuity.
				</p>
				<div class="mt-8">
					<a
						href="/community"
						class="btn btn-primary btn-lg text-white"
						in:scale={{ duration: 300, delay: 200, start: 0.8 }}
					>
						Join the Movement
					</a>
				</div>
			</div>

			<!-- Image Content -->
			<div class="relative" in:fly={{ x: 50, duration: 800, easing: elasticOut }}>
				<!-- Decorative Images -->
				<img
					src="/inaction.jpg"
					alt="Students connecting in action"
					class="transform rounded-lg shadow-lg transition duration-300 hover:scale-105"
					in:scale={{ duration: 600, delay: 200 }}
				/>
				<img
					src="/backdrop.jpeg"
					alt="Dynamic community discussions"
					class="absolute -left-12 -top-12 h-28 w-28 rotate-6 transform rounded-full border-4 border-red-600 shadow-md transition duration-300 hover:rotate-0"
					in:fly={{ x: -20, y: -20, duration: 800, delay: 400, easing: backOut }}
				/>
				<img
					src="/team.jpg"
					alt="Collaborative innovation"
					class="absolute -bottom-12 -right-12 h-32 w-32 -rotate-6 transform rounded-full border-4 border-red-600 shadow-md transition duration-300 hover:rotate-0"
					in:fly={{ x: 20, y: 20, duration: 800, delay: 600, easing: backOut }}
				/>
			</div>
		{/if}
	</div>
</section>

<!-- Quizzes Screenshot Section -->
<div
	class="relative flex flex-col-reverse items-center justify-center bg-base-200 py-10 lg:flex-row"
	data-section="quizzes"
>
	{#if sectionsVisible.quizzes}
		<div
			class="w-11/12 max-w-5xl overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-2xl"
			in:fly={{ x: -50, duration: 800, easing: elasticOut }}
		>
			<!-- Fake Desktop Window Header -->
			<div class="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
				<div class="flex space-x-2">
					<div class="h-3 w-3 rounded-full bg-red-500"></div>
					<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
					<div class="h-3 w-3 rounded-full bg-green-500"></div>
				</div>
				<p class="text-sm text-gray-300">Weekly Quizzes - NWU Vaal GKSS</p>
				<div></div>
			</div>
			<img
				src="/quizzes.png"
				alt="Leaderboard Screenshot"
				class="w-full transition duration-300 hover:scale-[1.02] hover:shadow-lg"
			/>
		</div>
		<h1
			class="mb-4 text-center text-5xl font-bold lg:w-2/4 lg:text-6xl"
			in:fly={{ x: 50, duration: 800, easing: elasticOut }}
		>
			Weekly Tech Quizzes
		</h1>
	{/if}
</div>

<!-- Leaderboard Screenshot Section -->
<div
	class="relative flex flex-col items-center justify-center bg-base-200 py-10 lg:flex-row"
	data-section="leaderboard"
>
	{#if sectionsVisible.leaderboard}
		<h1
			class="mb-4 text-center text-5xl font-bold lg:w-2/4 lg:text-6xl"
			in:fly={{ x: -50, duration: 800, easing: elasticOut }}
		>
			Best Geeks Leaderboard
		</h1>
		<div
			class="w-11/12 max-w-5xl overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-2xl"
			in:fly={{ x: 50, duration: 800, easing: elasticOut }}
		>
			<div class="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
				<div class="flex space-x-2">
					<div class="h-3 w-3 rounded-full bg-red-500"></div>
					<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
					<div class="h-3 w-3 rounded-full bg-green-500"></div>
				</div>
				<p class="text-sm text-gray-300">Leaderboard - NWU Vaal GKSS</p>
				<div></div>
			</div>
			<img
				src="/leaderboard.png"
				alt="Leaderboard Screenshot"
				class="w-full transition duration-300 hover:scale-[1.02] hover:shadow-lg"
			/>
		</div>
	{/if}
</div>

<!-- AI Idea Generator Screenshot Section -->
<div
	class="relative flex flex-col-reverse items-center justify-center bg-base-200 py-10 lg:flex-row"
	data-section="generator"
>
	{#if sectionsVisible.generator}
		<div
			class="w-11/12 max-w-5xl overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-2xl"
			in:fly={{ x: -50, duration: 800, easing: elasticOut }}
		>
			<div class="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
				<div class="flex space-x-2">
					<div class="h-3 w-3 rounded-full bg-red-500"></div>
					<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
					<div class="h-3 w-3 rounded-full bg-green-500"></div>
				</div>
				<p class="text-sm text-gray-300">AI Generator - NWU Vaal GKSS</p>
				<div></div>
			</div>
			<img
				src="/ideaGenerator.png"
				alt="Leaderboard Screenshot"
				class="w-full transition duration-300 hover:scale-[1.02] hover:shadow-lg"
			/>
		</div>
		<h1
			class="mb-4 text-center text-5xl font-bold lg:w-2/4 lg:text-6xl"
			in:fly={{ x: 50, duration: 800, easing: elasticOut }}
		>
			AI Idea Generator
		</h1>
	{/if}
</div>

<!-- Dashboard Screenshot Section -->
<div
	class="relative flex flex-col items-center justify-center bg-base-200 py-10 lg:flex-row"
	data-section="dashboard"
>
	{#if sectionsVisible.dashboard}
		<h1
			class="mb-4 text-center text-5xl font-bold lg:w-2/4 lg:text-6xl"
			in:fly={{ x: -50, duration: 800, easing: elasticOut }}
		>
			Member's dashboard
		</h1>
		<div
			class="w-11/12 max-w-5xl overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-2xl"
			in:fly={{ x: 50, duration: 800, easing: elasticOut }}
		>
			<div class="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
				<div class="flex space-x-2">
					<div class="h-3 w-3 rounded-full bg-red-500"></div>
					<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
					<div class="h-3 w-3 rounded-full bg-green-500"></div>
				</div>
				<p class="text-sm text-gray-300">Dashboard - NWU Vaal GKSS</p>
				<div></div>
			</div>
			<img
				src="/dashboard.png"
				alt="Leaderboard Screenshot"
				class="w-full transition duration-300 hover:scale-[1.02] hover:shadow-lg"
			/>
		</div>
	{/if}
</div>

<!-- Events Section -->

<div in:fly={{ y: 50, duration: 800, easing: elasticOut }}>
	<Events events={data.events} />
</div>

<!-- Today's Birthdays Section -->
<div class="p-4" data-section="birthdays">
	{#if sectionsVisible.birthdays}
		<div in:fly={{ y: 40, duration: 600, easing: bounceOut }}>
			<TodaysBirthdays {todaysBirthdays} />
		</div>
	{/if}
</div>

<style>
	/* Add some supplementary animation styles */
	:global(.hover-grow) {
		transition: transform 0.3s ease;
	}

	:global(.hover-grow:hover) {
		transform: scale(1.05);
	}

	:global(.rotate-on-hover) {
		transition: transform 0.5s ease;
	}

	:global(.rotate-on-hover:hover) {
		transform: rotate(0deg) !important;
	}

	/* Add some animation delays for staggered effects */
	:global(.stagger-1) {
		animation-delay: 100ms;
	}
	:global(.stagger-2) {
		animation-delay: 200ms;
	}
	:global(.stagger-3) {
		animation-delay: 300ms;
	}
	:global(.stagger-4) {
		animation-delay: 400ms;
	}
	:global(.stagger-5) {
		animation-delay: 500ms;
	}

	/* Add pulsing animation for important elements */
	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}

	:global(.pulse-animation) {
		animation: pulse 2s infinite ease-in-out;
	}
</style>
