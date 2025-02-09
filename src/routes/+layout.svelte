<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	import PwaInstallPrompt from '../components/PWAInstallPrompt.svelte';
	let { children, data } = $props();
</script>

<PwaInstallPrompt />
<Header isLoggedIn={data.isLoggedIn} isExecutive={data.isExecutive} />
<div
	class="mt-[65px] flex min-h-screen flex-col items-center justify-center bg-gray-200 font-bold text-black lg:flex-row"
>
	<p>NWU VAAL GKSS is currently under maintenance</p>
	<img src="/updates.png" alt="Maintenance" />
</div>
<Footer />
