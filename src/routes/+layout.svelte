<script>
	import { fade, fly } from 'svelte/transition';
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import PwaInstallPrompt from '$lib/components/PWAInstallPrompt.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { audioStore, notifications } from '$lib/stores';
	import Notification from '$lib/components/Notification.svelte';
	let audioElement = $state();
	let { children, data } = $props();
	afterNavigate(async ({ to }) => {
		if (!to) return;
		if (!to.url.pathname.includes('/executive')) {
			const res = await fetch('/api/trackUsage', {
				method: 'POST',
				body: JSON.stringify({ location: to.url.pathname })
			});
			const r = await res.json();
		}
	});
	$effect(() => {
		if (audioStore) {
			audioElement.src = $audioStore;
			audioElement.play().catch((error) => {
				console.error('Audio playback failed:', error);
			});
		}
	});

	// Initialize audio context on first click
	onMount(() => {
		const handleFirstClick = () => {
			new AudioContext().resume();
			window.removeEventListener('click', handleFirstClick);
		};
		window.addEventListener('click', handleFirstClick);
		//when logged in, and in the auth pages, redirect to dashboard
		if ((data.isLoggedIn && $page.url.pathname == '/login') || $page.url.pathname == '/signup') {
			notifications.addNotification({
				type: 'error',
				message: 'You are already logged in'
			});
			window.location.href = '/dashboard';
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
