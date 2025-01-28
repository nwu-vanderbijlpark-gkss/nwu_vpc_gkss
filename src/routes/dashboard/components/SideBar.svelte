<script>
	import { ChartBar, LogOut, Shield, User, UserPlus } from "lucide-svelte";

    let {memberData,handleLogout,activeTab} = $props();
</script>


<!-- Sidebar -->
<nav class="hidden md:flex flex-col w-64 bg-base-200 shadow-lg h-screen fixed text-white">
    <div class="p-6 border-b flex flex-col items-center space-y-4">
      <div class="relative group">
        <img src={memberData.profileImage} alt="Profile" class="w-24 h-24 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/50 transition-all"/>
      </div>
      <div class="text-center">
        <h2 class="font-bold">{memberData.name} {memberData.surname}</h2>
        <p class="text-sm text-gray-200">Student No: {memberData.student_no}</p>
      </div>
    </div>

    <div class="flex flex-col p-4 space-y-2 flex-grow">
      {#each [{id: 'stats', icon: ChartBar, text: 'Dashboard'}, 
              {id: 'profile', icon: User, text: 'Profile'},
              {id: 'security', icon: Shield, text: 'Security'},
              {id: 'invite', icon: UserPlus, text: 'Invite Friends'}] as item}
        <button 
          class="flex items-center space-x-2 p-3 rounded-lg {activeTab === item.id ? 'bg-primary text-white' : 'hover:bg-gray-100'}"
          onclick={() => activeTab = item.id}>
          <svelte:component this={item.icon} size={20} />
          <span>{item.text}</span>
        </button>
      {/each}
      <div class="p-4 border-t">
        <button class="flex items-center space-x-2 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full" onclick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </nav>