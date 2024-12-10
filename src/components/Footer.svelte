<script>
	import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-svelte";
    let year = new Date();
    year = year.getFullYear();
</script>
<footer class="bg-black w-full grid p-5 space-y-5 mt-1 justify-center items-center text-center">
    <h1 class="text-white text-xl font-semibold">Stay updated, follow us</h1>
    <div class="flex gap-3 flex-wrap">
        <a href="#" class="btn"><Twitter/></a>
        <a href="#" class="btn"><Facebook/></a>
        <a href="#" class="btn"><Linkedin/></a>
        <a href="#" class="btn"><Github/></a>
        <a href="#" class="btn"><Instagram/></a>
    </div>
    <p class="text-sm">© {year} NWU Vaal GKSS. All Rights Reserved</p>
</footer>