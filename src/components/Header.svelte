<script>
    let currentPath = "";

    import { onMount } from 'svelte';

    onMount(() => {
        currentPath = location.pathname;
    });
    import { Menu } from 'lucide-svelte';
</script>

<div class="navbar bg-black/80 shadow-lg backdrop-blur flex justify-between items-center fixed top-0 w-screen">
    <a href="/"><img src="/logo_white.png" alt="logo" class="h-[25px] w-[150px] ml-5"/></a>
    <nav class="hidden lg:flex items-center space-x-5 mr-5">
        <a href="/" data-sveltekit-reload class="navItem" class:selected={currentPath === "/"}>Home</a>
        <a href="/about" data-sveltekit-reload class="navItem" class:selected={currentPath === "/about"}>About</a>
        <a href="/events" data-sveltekit-reload class="navItem" class:selected={currentPath === "/events"}>Events</a>
        <a href="/team" data-sveltekit-reload class="navItem" class:selected={currentPath === "/team"}>The team</a>
        <a href="/contact" data-sveltekit-reload class="navItem" class:selected={currentPath === "/contact"}>Contact Us</a>
    </nav>
    <label for="my-drawer" class="lg:hidden btn drawer-button"><Menu color="white" /></label>
</div>
<div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <h2 class="text-lg text-white font-bold">Menu</h2>
        <!-- Sidebar content here -->
        <li><a href="/" data-sveltekit-reload class="navItem" class:selected={currentPath === "/"}>Home</a></li>
        <li><a href="/about" data-sveltekit-reload class="navItem" class:selected={currentPath === "/about"}>About</a></li>
        <li><a href="/events" data-sveltekit-reload class="navItem" class:selected={currentPath === "/events"}>Events</a></li>
        <li><a href="/team" data-sveltekit-reload class="navItem" class:selected={currentPath === "/team"}>The team</a></li>
        <li><a href="/contact" data-sveltekit-reload class="navItem" class:selected={currentPath === "/contact"}>Contact Us</a></li>
      </ul>
    </div>
  </div>

<style>
    .selected {
        @apply link-primary font-bold;
    }
</style>
