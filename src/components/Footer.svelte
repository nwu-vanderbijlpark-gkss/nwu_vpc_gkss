<script>
	import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-svelte';
	let year = new Date();
	year = year.getFullYear();
	let currentPath = '';

	import { onMount } from 'svelte';

	onMount(() => {
		currentPath = location.pathname;
	});
</script>

{#if !currentPath.includes('/community') && !currentPath.includes('/executive') && !currentPath.includes('/dashboard')}
	<footer
		class="mt-1 flex w-full flex-col items-center justify-center space-y-5 bg-base-200 p-5 text-center"
	>
		<h1 class="text-xl font-semibold text-white">Stay updated, follow us</h1>
		<div class="flex flex-wrap gap-3">
			<a href="https://x.com/GKSSVAAL" class="btn"><Twitter /></a>
			<a href="#" class="btn"><Facebook /></a>
			<a href="https://www.linkedin.com/in/gkssnwu-vaal-30132234b/" class="btn"><Linkedin /></a>
			<a href="#" class="btn"><Github /></a>
			<a href="https://www.instagram.com/gkss_nwu" class="btn"><Instagram /></a>
		</div>
		<div class="hidden items-start justify-center space-x-4 lg:flex lg:flex-row">
			<a
				href="/"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white">Home</a
			>
			<p class="cDivider">|</p>
			<a
				href="/about"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white">About</a
			>
			<p class="cDivider">|</p>
			<a
				href="/events"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white">Events</a
			>
			<p class="cDivider">|</p>
			<a
				href="/community"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white">Community</a
			>
			<p class="cDivider">|</p>
			<a
				href="/team"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white">The team</a
			>
			<p class="cDivider">|</p>
			<a
				href="/#contact"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white">Contact Us</a
			>
		</div>
		<p class="text-sm">© {year} NWU Vaal GKSS. All Rights Reserved</p>
	</footer>
{/if}
