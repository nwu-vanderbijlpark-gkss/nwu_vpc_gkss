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
      isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
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
    <div class="fixed h-screen w-screen inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {#if isLoading}
          <div class="flex justify-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        {:else}
          <div class="text-center">
            <h2 class="text-xl font-bold mb-2 text-gray-500">
              Install Our App
            </h2>
            <p class="text-gray-600 mb-6">
              Get a better experience by installing our app on your {deviceType}
            </p>
            
            <div class="space-y-3">
              <button
                on:click={handleInstall}
                class="w-full btn btn-primary text-white py-2 px-4 rounded-lg transition-colors"
              >
                Install App
              </button>
              
              <button
                on:click={continueInBrowser}
                class="w-full border btn btn-bordered border-gray-300 py-2 px-4 rounded-lg transition-colors"
              >
                Continue in Browser
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}