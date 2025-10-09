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
	import { currentUser, models } from '$lib/state.svelte';
	import AiChat from '$lib/components/AIChat.svelte';
	import { requestNotificationPermission, sendBrowserNotification } from '$lib';
	import { supabase } from '$lib/supabaseClient';

	let audioElement = $state();

	let { children, data } = $props();

	//set the current user from the data prop
	if (data && data.currentUser) {
		currentUser.data = data.currentUser;
	}

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

	let subscription;

	onMount(async () => {
		// Request permission
		requestNotificationPermission();
		//when logged in, and in the auth pages, redirect to dashboard
		if (data.isLoggedIn && ($page.url.pathname == '/login' || $page.url.pathname == '/signup')) {
			notifications.addNotification({
				type: 'error',
				message: 'You are already logged in'
			});

			window.location.href = '/dashboard';
		}
		// Setup realtime subscription
		subscription = supabase
			.channel('announcements-channel')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'announcements'
				},
				(payload) => {
					notifications.add({
						type: 'success',
						message: 'New announcement: ' + payload.new.subject
					});
					sendBrowserNotification('New announcement: ' + payload.new.subject, {
						body: payload.new.subject,
						icon: '/logo.png'
					});
				}
			)
			.subscribe();

		// Cleanup on unmount
		return () => {
			if (subscription) {
				supabase.removeChannel(subscription);
			}
		};
	});
</script>

<!--Notification system/ audio and display-->
<audio bind:this={audioElement} class="hidden"></audio>
{#each $notifications as notification, index}
	<Notification
		id={notification.id}
		type={notification.type}
		message={notification.message}
		timeout={notification.timeout}
	/>
{/each}

<!--The PWA installer prompt-->
<PwaInstallPrompt />

<!--The Header/Navbar-->
<Header isLoggedIn={data.isLoggedIn} isExecutive={data.isExecutive} user={data.currentUser} />
<!--The main pages-->
<div class="mt-[65px] min-h-screen bg-gray-200">
	{@render children()}
</div>
<!--The footer-->
<Footer />
