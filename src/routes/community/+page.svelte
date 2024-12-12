<script>
	import { Dot, Forward, MessageCircleMore, PlusCircle, Search, ThumbsDown, ThumbsUp, User } from "lucide-svelte";

   let array = [];
   for(let i = 0; i<20;i++){
    array.push(i);
   }
</script>
<title>Community | NWU Vaal GKSS</title>
<div class="divide-y">
    {#each array as topic}
    <div class="hover:shadow hover:rounded-lg p-2">
        <div class="text-sm flex justify-between items-center">
            <span class="flex">
                <a class=" link-hover" href="/">lethabomaepa11</a> 
                <Dot/> 
                <p class="text-gray-400">16hr ago</p></span>
            <button class="btn btn-ghost">Report</button>
        </div>
    <a href="/community/topic here">
        <h3 class="text-2xl font-bold">Tech Debate</h3>
        <p class="text-sm text-gray-500 mt-2">
            Dive into a heated discussion on how emerging technologies are shaping our world. 
            This is your chance to voice opinions, challenge ideas, and 
            engage with tech enthusiasts.
        </p>
    </a>
        <div class="text-xs mt-5">
            <button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"><ThumbsUp size="20px"/> <p>0</p></button>
            <button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"><ThumbsDown size="20px"/><p>0</p></button>
            <button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"><MessageCircleMore size="20px"/><p>0</p></button>
            <button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"><Forward size="20px"/><p>Share</p></button>
        </div>
    </div>
{/each}
</div>
