<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	import PwaInstallPrompt from '../components/PWAInstallPrompt.svelte';
	let { children, data } = $props();
</script>

<PwaInstallPrompt />
<Header isLoggedIn={data.isLoggedIn} isExecutive={data.isExecutive} user={data.currentUser} />
<div class="mt-[65px] min-h-screen bg-gray-200">
	{@render children()}
</div>
<Footer />
