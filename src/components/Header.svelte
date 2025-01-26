<script>
	let currentPath = '';

	import { onMount } from 'svelte';

	onMount(() => {
		currentPath = location.pathname;
	});
	import { ChartNoAxesColumn, HeartHandshake, Home, Link, Menu, MessageCircleMoreIcon, PlusCircle, Search, User, UserCog, Users } from 'lucide-svelte';
</script>

<div
	class="navbar fixed top-0 z-50 flex w-screen items-center justify-between bg-[#0c0c0c] shadow-lg backdrop-blur"
>
	<a href="/"><img src="/logo_white.png" alt="logo" class="ml-5 h-[20px] w-[150px]" /></a>
	{#if !currentPath.includes('/executive')}
		<nav class="mr-5 hidden items-center space-x-5 lg:flex">
			<a
				href="/"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/'}>Home</a
			>
			<a
				href="/about"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/about'}>About</a
			>
			<a
				href="/events"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/events'}>Events</a
			>
			<a
				href="/geekOfTheWeek"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/geekOfTheWeek'}>Geek Of The Week</a
			>
			<a
				href="/community"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath.includes('/community')}>Community</a
			>
			<a
				href="/team"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/team'}>The team</a
			>
			<a
				href="/#contact"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/#contact'}>Contact Us</a
			>
		</nav>
	{/if}
	<div class="space-x-2 lg:hidden">
		<label for="my-drawer" class="btn drawer-button rounded-full lg:hidden"
			><Menu color="white" /></label
		>
	</div>
</div>

<div class="drawer z-50">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			<h2 class="text-2xl font-bold text-white">Menu</h2>
			<!-- Sidebar content here -->
			{#if !currentPath.includes('/executive')}
				<li>
					<a
						href="/"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/'}>Home</a
					>
				</li>
				<li>
					<a
						href="/about"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/about'}>About</a
					>
				</li>
				<li>
					<a
						href="/events"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/events'}>Events</a
					>
				</li>
				<li>
					<a
						href="/geekOfTheWeek"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/geekOfTheWeek'}>Geek Of The Week</a
					>
				</li>
				<li>
					<a
						href="/community"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath.includes('/community')}>Community</a
					>
				</li>
				<li>
					<a
						href="/team"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/team'}>The team</a
					>
				</li>
				<li>
					<a
						href="/#contact"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/#contact'}>Contact Us</a
					>
				</li>
			{:else}
				<li class="menu-title flex bg-gray-800 text-white rounded-box my-2">
					<div>
						<h2>Executive</h2>
					</div>
				</li>
				<li>
				  <a href="/executive">
					<Home/>
					Home
				  </a>
				</li>
				<li>
				  <a href="/executive/events">
					<ChartNoAxesColumn/>
					Event Management
				  </a>
				</li>
				<li>
					<a href="/executive/team">
					  <UserCog/>
					  Executive Team
					</a>
				  </li>
				<li>
				  <a href="/executive/membership">
					<Users/>
					Members
				  </a>
				</li>
				<li>
					<a href="/executive/">
					  <HeartHandshake/>
					  Sponsors
					</a>
				  </li>
				<li>
					<li>
						<details open>
						  <summary><Link/>Other links</summary>
						  <ul>
							<li>
								<a data-sveltekit-reload href="/dashboard">
								<User/>
								Dashboard
								</a>
							</li>
							<li>
								<a data-sveltekit-reload href="/community">
								<MessageCircleMoreIcon/>
								Community
								</a>
							</li>
						  </ul>
						</details>
				
				</li>
			{/if}
		</ul>
	</div>
</div>

<style>
	.selected {
		@apply link-primary font-bold;
	}
</style>
