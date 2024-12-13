<script>
    	import { Dot, Forward, MessageCircleMore, PlusCircle, Search, ThumbsDown, ThumbsUp, User } from "lucide-svelte";

    let { children } = $props();
</script>
<main class="flex  bg-gray-200 min-h-screen divide-x">
    <div class="hidden lg:flex w-2/12 min-h-screen bg-white p-2 items-center flex-col text-black">
        <ul class="menu  min-h-full w-full p-2">
            <h2 class="text-xl font-bold border-b text-gray-400 menu-title">Community</h2>
            <li><a href="#" class="navItem text-base"><PlusCircle/> Create new topic</a></li>
            <li><a href="#" class="navItem text-base"><Search/> Search</a></li>
            <li><a href="#" class="navItem text-base"><User/> Profile</a></li>
        </ul>
    </div>
    <div class="w-full lg:w-2/3 bg-white min-h-screen lg:max-h-screen lg:overflow-scroll text-black p-5">
        {@render children()}
    </div>
    <div class="hidden lg:flex w-2/12 min-h-screen bg-white p-2  space-y-4 items-center flex-col text-black">
        <ul class="menu w-full p-2 bg-base-content rounded-lg">
            <h2 class="text-xl font-bold border-b menu-title text-black">Latest topics</h2>
            <li><a href="#" class="navItem text-base">Web Development</a></li>
            <li><a href="#" class="navItem text-base">Coding tips</a></li>
            <li><a href="#" class="navItem text-base">Studying tips</a></li>
        </ul>
        <ul class="menu w-full p-2 bg-base-content rounded-lg">
            <h2 class="text-xl font-bold border-b menu-title text-black">Most active geeks</h2>
            <li><a href="#" class="navItem text-base">John Doe</a></li>
            <li><a href="#" class="navItem text-base">Kim Kadi</a></li>
            <li><a href="#" class="navItem text-base">John SeeMe</a></li>
        </ul>

    </div>
</main>