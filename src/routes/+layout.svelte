<script>
	import { fade, fly } from 'svelte/transition';
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	import PwaInstallPrompt from '../components/PWAInstallPrompt.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	let { children, data } = $props();
	afterNavigate(async ({ to }) => {
		if (!to) return;
		if (data.isLoggedIn && !to.url.pathname.includes('/executive')) {
			const res = await fetch('/api/trackUsage', {
				method: 'POST',
				body: JSON.stringify({ location: to.url.pathname })
			});
			const r = await res.json();
			if (!r.success) {
				console.log(r.error);
			}
		}
	});
</script>

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
