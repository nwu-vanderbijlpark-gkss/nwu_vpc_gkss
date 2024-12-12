<script>
	import { Edit, PlusCircle, Trash2 } from "lucide-svelte";

    let array = [];
    for(let i = 0; i < 20;i++){
        array.push(i);
    }
</script>
<div class="p-10 min-h-screen bg-gray-200 justify-center items-center flex flex-col w-full">
	<div class="flex justify-between items-center w-full mb-6 max-w-[700px]">
        <h2 class="text-4xl font-bold">Events</h2>
        <button class="btn btn-primary "><PlusCircle/>Create Event</button>
    </div>  
    <div class="grid w-full max-w-[700px] text-gray-500 text-sm mb-5">
        <p class="">You can add, delete and update an event on this page</p>
        <p class="lg:hidden">View on desktop to be able to see the description of the events</p>    
    </div>
	<div class="overflow-x-auto w-full max-w-[700px]">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>Event</th>
              <th class="hidden lg:flex">Description</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- row  -->
             {#each array as item }
             <tr>
                <td>Tech Debate</td>
                <td class="hidden lg:flex overflow-hidden max-w-[300px]">Dive into a heated discussion on how emerging technologies are shaping our world. 
                    This is your chance to voice opinions, challenge ideas, and 
                    engage with tech enthusiasts.</td>
                <td>April 2025</td>
                <td class="flex gap-2 items-center">
                    <button class="btn btn-ghost grid items-center"><Edit/><p class="text-xs">Edit</p></button>
                    <button class="btn btn-ghost grid items-center"><Trash2 color="red"/><p class="text-xs">Delete</p></button>
                </td>
              </tr>
             {/each}
            
          </tbody>
        </table>
      </div>
</div>

<style>
    table, td, tr, th, h1, h2, h3 {
        @apply text-black;
    }
    div{
        cursor:default;
    }
</style>