<script>
	import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-svelte";
    let year = new Date();
    year = year.getFullYear();
</script>
<footer class="bg-black w-full flex flex-col p-5 space-y-5 mt-1 justify-center items-center text-center">
    <h1 class="text-white text-xl font-semibold">Stay updated, follow us</h1>
    <div class="flex gap-3 flex-wrap">
        <a href="#" class="btn"><Twitter/></a>
        <a href="#" class="btn"><Facebook/></a>
        <a href="#" class="btn"><Linkedin/></a>
        <a href="#" class="btn"><Github/></a>
        <a href="#" class="btn"><Instagram/></a>
    </div>
    <div class="hidden lg:flex lg:flex-row space-x-4 justify-center items-start">
        <a href="/" data-sveltekit-reload class="navItem hover:text-white hover:border-b border-red-500">Home</a>
        <p class="cDivider">|</p>
        <a href="/about" data-sveltekit-reload class="navItem hover:text-white hover:border-b border-red-500">About</a>
        <p class="cDivider">|</p>
        <a href="/events" data-sveltekit-reload class="navItem hover:text-white hover:border-b border-red-500">Events</a>
        <p class="cDivider">|</p>
        <a href="/community" data-sveltekit-reload class="navItem hover:text-white hover:border-b border-red-500">Community</a>
        <p class="cDivider">|</p>
        <a href="/team" data-sveltekit-reload class="navItem hover:text-white hover:border-b border-red-500">The team</a>
        <p class="cDivider">|</p>
        <a href="/#contact" data-sveltekit-reload class="navItem hover:text-white hover:border-b border-red-500">Contact Us</a>   
    </div>
    <p class="text-sm">© {year} NWU Vaal GKSS. All Rights Reserved</p>
</footer>