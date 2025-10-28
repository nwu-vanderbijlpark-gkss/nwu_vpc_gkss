<script>
	import { onMount } from 'svelte';

	let isInstallable = false;
	let isLoading = true;
	let deferredPrompt = null;
	let deviceType = 'desktop';
	let showPrompt = true;
	let isStandalone = false;

	onMount(() => {
		// Check localStorage first
		const hasChosenBrowser = localStorage.getItem('preferBrowser') === 'true';
		if (hasChosenBrowser) {
			showPrompt = false;
			return;
		}

		// Detect device type
		const userAgent = navigator.userAgent.toLowerCase();
		deviceType = /iphone|ipad|ipod|android/.test(userAgent) ? 'mobile' : 'desktop';

		// Check if already installed
		isStandalone =
			window.matchMedia('(display-mode: standalone)').matches ||
			window.navigator.standalone ||
			document.referrer.includes('android-app://');

		if (isStandalone) {
			showPrompt = false;
		}

		// Listen for install prompt
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			isInstallable = true;
			showPrompt = true;
		});

		isLoading = false;
	});

	async function handleInstall() {
		if (!deferredPrompt) return;

		try {
			const result = await deferredPrompt.prompt();
			deferredPrompt = null;
			isInstallable = false;
			showPrompt = false;
		} catch (err) {
			console.error('Error installing PWA:', err);
		}
	}

	function continueInBrowser() {
		localStorage.setItem('preferBrowser', 'true');
		showPrompt = false;
	}
</script>

{#if showPrompt && !isStandalone && isInstallable}
	<div
		class="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50 p-4"
	>
		<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
			{#if isLoading}
				<div class="flex justify-center p-8">
					<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
				</div>
			{:else}
				<div class="text-center">
					<h2 class="mb-2 text-xl font-bold text-gray-500">Install Our App</h2>
					<p class="mb-6 text-gray-600">
						Get a better experience by installing our app on your {deviceType}
					</p>

					<div class="space-y-3">
						<button
							on:click={handleInstall}
							class="btn btn-primary w-full rounded-lg px-4 py-2 text-white transition-colors"
						>
							Install App
						</button>

						<button
							on:click={continueInBrowser}
							class="btn btn-bordered w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors"
						>
							Continue in Browser
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
