<script>
	import { Edit, PlusCircle, Trash2, X } from "lucide-svelte";

    let array = [];
    let  { data } = $props();
</script>
<div class="p-10 min-h-screen bg-gray-200 justify-center items-center flex flex-col w-full">
	<div class="flex justify-between items-center w-full mb-6 max-w-[700px]">
        <h2 class="text-4xl font-bold">Events</h2>
        <button class="btn btn-primary " onclick={() => my_modal_1.showModal()}><PlusCircle/>Create Event</button>
        <dialog id="my_modal_1" class="modal">
          <div class="modal-box text-white">
            <div class="flex justify-between items-center">
              <p class="text-lg font-bold text-white">Create an Event</p>
              <div class="modal-action">
                <form method="dialog">
                  <button class="btn"><X/>Close</button>
                </form>
              </div>
            </div>
            
            <p class="py-4 text-sm">Enter the required details</p>
            <form method="post" action="#" class="flex flex-col w-full gap-5 ">
              <label class="form-control w-full">
                  <p>Topic</p>
                  <input type="text" name="topic" class="input input-bordered" id="topic" placeholder="The name of the event"/>
              </label>
              <label class="form-control w-full">
                  <p>Date</p>
                  <input type="date" name="date" class="input input-bordered" id="date" placeholder="Date of the event"/>
              </label>
              <label class="form-control w-full">
                  <p>Description</p>
                  <textarea name="description" class="textarea textarea-bordered" id="description" placeholder="What is the event about?"></textarea>
              </label>
              <button type="submit" class="btn btn-primary text-white">Create</button>
          </form>
            
          </div>
        </dialog>
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
             {#each data.events as event }
             <tr>
                <td>{event.topic}</td>
                <td class="hidden lg:flex overflow-hidden max-w-[300px]">{event.description}</td>
                <td>{event.date}</td>
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