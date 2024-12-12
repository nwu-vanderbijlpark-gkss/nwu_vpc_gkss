<script>
	import { Edit, PlusCircle, Trash2 } from "lucide-svelte";

    let roles = ["Chairperson","Deputy Chairperson","Secretary","Treasurer","Tech and Innovation Lead","Community Manager","Marketing Manager"];
    
</script>
<div class="p-10 min-h-screen bg-gray-200 justify-center items-center flex flex-col w-full">
	<div class="flex justify-between items-center w-full mb-6 max-w-[700px]">
        <h2 class="text-4xl font-bold">Team</h2>
        <button class="btn btn-primary "><PlusCircle/>Add role</button>
    </div>  
    <div class="grid w-full max-w-[700px] text-gray-500 text-sm mb-5">
        <p class="">You can add, delete and update a member on this page</p>
        <p class="lg:hidden">View on desktop for a detailed table</p>    

    </div>
	<div class="overflow-x-auto w-full max-w-[700px]">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>Role</th>
              <th>Full name</th>
              <th class="hidden lg:block">Email</th>
              <th class="">Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- row  -->
             {#each roles as role, index }
             <tr>
                <td>{role}</td>
                <td>John Doe</td>
                <td class="hidden lg:block">name12@domain.com</td>
                <td>071 787 5788</td>
                <td class="flex gap-2 items-center">
                    <button class="btn btn-ghost grid items-center"><Edit/><p class="text-xs">Edit</p></button>
                    <button class="btn btn-ghost  items-center hidden lg:grid"><Trash2 color="red"/><p class="text-xs">Delete</p></button>
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