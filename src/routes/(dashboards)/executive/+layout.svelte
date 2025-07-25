<script>
	import {
		ChartNoAxesColumn,
		FileEdit,
		HeartHandshake,
		Home,
		Link,
		Logs,
		LucideUsers,
		MessageCircleMoreIcon,
		User,
		UserCog,
		Users
	} from 'lucide-svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import PwaInstallPrompt from '$lib/components/PWAInstallPrompt.svelte';
	import { page } from '$app/stores';
	import UsefulTools from '$lib/components/executive/UsefulTools.svelte';

	let { children, data } = $props();
	const currentUser = data.currentUser;
</script>

<title>Executive | NWU Vaal GKSS </title>
<UsefulTools />
<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="flex min-h-screen w-full justify-between bg-gradient-to-b from-white to-gray-200"
>
	<ul class="menu hidden w-60 bg-base-200 lg:flex">
		<li class="menu-title my-2 flex flex-col rounded-box bg-gray-800 p-4 text-white">
			<!-- User Information (Image, Name, Surname) -->
			<div class="flex items-center gap-x-4">
				<img
					src={currentUser.image}
					alt={currentUser.name}
					class="h-[50px] w-[50px] rounded-full"
				/>
				<h2 class="text-lg font-semibold">{currentUser.name} {currentUser.surname}</h2>
			</div>

			<!-- Role below the name and picture -->
			<p class="mt-2 text-sm text-gray-400">{currentUser.role}</p>
		</li>

		<li>
			<a href="/executive" class:selected={$page.url.pathname === '/executive'}>
				<Home />
				Home
			</a>
		</li>
		<li>
			<a href="/executive/events" class:selected={$page.url.pathname.includes('/executive/events')}>
				<ChartNoAxesColumn />
				Event Management
			</a>
		</li>
		<li>
			<a href="/executive/team" class:selected={$page.url.pathname === '/executive/team'}>
				<UserCog />
				Executive Team
			</a>
		</li>
		<li>
			<a
				href="/executive/membership"
				class:selected={$page.url.pathname === '/executive/membership'}
			>
				<Users />
				Members
			</a>
		</li>
		<li>
			<a
				href="/executive/quizzes"
				class:selected={$page.url.pathname.includes('/executive/quizzes')}
			>
				<FileEdit />
				Quizzes
			</a>
		</li>
		<li>
			<a href="/executive/logs" class:selected={$page.url.pathname.includes('/executive/logs')}>
				<Logs />
				Logs
			</a>
		</li>
		<li></li>
		<li>
			<details open>
				<summary><Link />Other links</summary>
				<ul>
					<li>
						<a href="/dashboard">
							<User />
							Dashboard
						</a>
					</li>
					<li>
						<a href="/community">
							<MessageCircleMoreIcon />
							Community
						</a>
					</li>
				</ul>
			</details>
		</li>
	</ul>
	<div in:slide={{ x: 100 }} out:slide={{ x: -100 }} class="w-full lg:[width:calc(100%-224px)]">
		{@render children()}
	</div>
</div>

<style>
	.selected {
		@apply link-primary font-bold;
	}
</style>
