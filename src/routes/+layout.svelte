<script>
	import { fade, fly } from 'svelte/transition';
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import PwaInstallPrompt from '$lib/components/PWAInstallPrompt.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { audioStore, notifications } from '$lib/stores';
	import Notification from '$lib/components/Notification.svelte';
	import { BProgress } from '@bprogress/core';
	import { models } from '$lib/state.svelte';
	import AiChat from '$lib/components/AIChat.svelte';

	let audioElement = $state();

	let { children, data } = $props();

	beforeNavigate(({ to }) => {
		BProgress.start();
	});

	afterNavigate(async ({ to }) => {
		BProgress.done();
		if (!to) return;
		if (!to.url.pathname.includes('/executive')) {
			const res = await fetch('/api/trackUsage', {
				method: 'POST',
				body: JSON.stringify({ location: to.url.pathname })
			});
			const r = await res.json();
		}
	});
	const getModels = async () => {
		const res = await fetch('/api/ai/models', {
			method: 'GET'
		});
		const response = await res.json();
		return response.models.data;
	};

	onMount(async () => {
		//when logged in, and in the auth pages, redirect to dashboard
		if (data.isLoggedIn && ($page.url.pathname == '/login' || $page.url.pathname == '/signup')) {
			notifications.addNotification({
				type: 'error',
				message: 'You are already logged in'
			});

			window.location.href = '/dashboard';
		}

		//get active ai models for usage
		if (models.data.length == 0) {
			models.data = await getModels();
		}
	});
</script>

<audio bind:this={audioElement} class="hidden"></audio>
{#each $notifications as notification, index}
	<Notification
		id={notification.id}
		type={notification.type}
		message={notification.message}
		timeout={notification.timeout}
	/>
{/each}
<AiChat />
<PwaInstallPrompt />
<Header isLoggedIn={data.isLoggedIn} isExecutive={data.isExecutive} user={data.currentUser} />
<div
	class="mt-[65px] min-h-screen bg-gray-200"
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
>
	{@render children()}
</div>
<Footer />
