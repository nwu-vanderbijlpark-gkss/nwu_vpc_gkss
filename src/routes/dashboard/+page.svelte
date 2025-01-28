<script>
  import moment from 'moment';
  import { 
    User, Shield, ChartBar, LogOut, Settings, Bell,
    Calendar, Book, Award, UserPlus, Mail,

	X

  } from 'lucide-svelte';
	import Profile from './components/Profile.svelte';
	import Invite from './components/Invite.svelte';
	import Page from '../update-password/+page.svelte';
	import { slide } from 'svelte/transition';

  let activeTab = $state('stats');
  let notifications = $state(3);
  let {data} = $props();
  let inviteHistory = $state([
    { email: 'friend@example.com', status: 'Pending', date: '2024-03-01' },
    { email: 'colleague@example.com', status: 'Accepted', date: '2024-02-28' }
  ]);
  let member = $state(data);
  let memberData = $state({
    name: 'Lethabo', surname: 'Maepa', date_of_birth: '2004-05-06',
    gender: 'Male', qualification: 'hhh', student_no: 12345678,
    year_of_study: '2nd', profileImage: '/Stay Wild.png',
    interests: ['Web Development', 'AI', 'Mobile Dev', 'Data Science'],
    achievements: [
      { title: 'First Project Completed', date: '2024-01-15' },
      { title: 'Hackathon Winner', date: '2024-02-20' }
    ],
    upcomingEvents: [
      { title: 'Tech Workshop', date: '2024-03-15' },
      { title: 'Coding Competition', date: '2024-03-20' }
    ]
  });

  


  // Handlers
  const handleLogout = (event) =>{
    logoutModal.showModal();
  };
  const handleImageUpload = (event) => event.target.files[0] && console.log('Image uploaded:', event.target.files[0].name);
  const handleNotificationClick = () => notifications = 0;
  
  
  
</script>
<title>Dashboard | NWU VAAL GKSS</title>
<!-- Logout modal-->
<dialog id="logoutModal" class="modal  z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Logout Confirmation</p>
		</div>
    <p class="py-4 text-sm">Do you want to logout?</p>
    <div class="grid grid-cols-2 gap-2">
      <form
      method="post"
      action="?/logout"
      class="w-full"
      >
      <button  type="submit" class="btn btn-primary w-full">Yes</button>
    </form>
    <button onclick={() => logoutModal.close()} class="btn btn-secondary w-full">No</button>
    </div>
			
  </div>
</dialog> 
<div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
  <!-- Sidebar -->
  <nav class="hidden md:flex flex-col w-64 bg-base-200 shadow-lg h-screen fixed text-white">
    <div class="p-6 border-b flex flex-col items-center space-y-4">
      <div class="relative group">
        <img src={member.image} alt="Profile" class="w-24 h-24 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/50 transition-all"/>
      </div>
      <div class="text-center">
        <h2 class="font-bold">{member.name} {member.surname}</h2>
        <p class="text-sm text-gray-200">Student No: {member.student_no}</p>
      </div>
    </div>

    <div class="flex flex-col p-4 space-y-2 flex-grow">
      {#each [{id: 'stats', icon: ChartBar, text: 'Dashboard'}, 
              {id: 'profile', icon: User, text: 'Profile'},
              {id: 'security', icon: Shield, text: 'Security'},
              {id: 'invite', icon: UserPlus, text: 'Invite Friends'}] as item}
        <button 
          class="flex items-center space-x-2 p-3 rounded-lg {activeTab === item.id ? 'bg-primary text-white' : 'hover:bg-red-900/50'}"
          onclick={() => activeTab = item.id} >
          <svelte:component this={item.icon} size={20} />
          <span>{item.text}</span>
        </button>
      {/each}
      <div class="p-4 border-t">
        <button onclick={handleLogout}  type="submit" class="flex items-center space-x-2 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </nav>
  <!-- Mobile header -->
  <header class="md:hidden bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
    <div class="flex items-center space-x-3">
      <img src={member.image} alt="Profile" class="w-10 h-10 rounded-full object-cover border-2 border-primary/20"/>
      <h1 class="font-bold">{member.name} </h1>
    </div>
    <button class="relative p-2" onclick={handleNotificationClick}>
      <Bell size={20} />
      {#if notifications > 0}
        <span class="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {notifications}
        </span>
      {/if}
    </button>
  </header>
<!-- Bottom navigation for mobile -->
<nav class="md:hidden fixed bottom-0 left-0 z-50 right-0 bg-base-200 shadow-lg text-white">
  <div class="flex justify-around p-4">
    {#each [
      {id: 'stats', icon: ChartBar, text: 'Dashboard'}, 
      {id: 'profile', icon: User, text: 'Profile'},
      {id: 'security', icon: Shield, text: 'Security'},
      {id: 'invite', icon: UserPlus, text: 'Invite'},
      {id: 'logout', icon: LogOut, text: 'Logout', onClick: handleLogout, class: 'text-red-600'}
    ] as item}
      <button 
        class="flex flex-col items-center space-y-1 {item.class || ''} {activeTab === item.id ? 'text-primary' : 'hover:text-primary/80'}"
        onclick={item.onClick || (() => activeTab = item.id)}>
        <svelte:component this={item.icon} size={20} />
        <span class="text-xs">{item.text}</span>
      </button>
    {/each}
  </div>
</nav>
  <!-- Main content -->
  <main class="flex-1 md:ml-64 p-6 mb-16 md:mb-0 text-base-200">
    {#if activeTab === 'stats'}
      <!-- Dashboard content -->
      <div transition:slide class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {#each [{title: 'Total Points', icon: Award, value: member.points+ " pts", sub: ''},
                {title: 'Next Event', icon: Calendar, value: memberData.upcomingEvents[0]?.title, 
                 sub: memberData.upcomingEvents[0]?.date ? moment(memberData.upcomingEvents[0].date).format('MMMM D, YYYY') : 'No events'},
                {title: 'Recent Achievement', icon: Book, value: memberData.achievements[0]?.title,
                 sub: memberData.achievements[0]?.date ? moment(memberData.achievements[0].date).format('MMMM D, YYYY') : 'No achievements'}] as stat}
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">{stat.title}</h3>
              <svelte:component this={stat.icon} class="text-primary" size={24} />
            </div>
            <p class="text-xl font-semibold mt-2">{stat.value}</p>
            <p class="text-sm text-gray-600 mt-1">{stat.sub}</p>
          </div>
        {/each}
      </div>

      <!-- Interests and Activity -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-4">Interests & Skills</h3>
          <div class="flex flex-wrap gap-2">
            {#each member.interests.split(",") as interest}
              <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{interest}</span>
            {/each}
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-4">Recent Activity</h3>
          <div class="space-y-4">
            {#each [...memberData.achievements, ...memberData.upcomingEvents]
              .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
              .slice(0, 5) as activity}
              <div class="flex items-start">
                <div class="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                <div class="ml-4">
                  <p class="font-medium">{activity.title}</p>
                  <p class="text-sm text-gray-600">{moment(activity.date).format('MMMM D, YYYY')}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

    {:else if activeTab === 'profile'}
      
        <Profile memberData={member}/>

    {:else if activeTab === 'security'}
      <!-- Security content -->
      <Page/>

    {:else if activeTab === 'invite'}
      <Invite history={inviteHistory}/>
    {/if}
  </main>
</div>

<style>
  /* Add any custom styles here */
  :global(.btn) {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
  }
  
  :global(.btn-primary) {
    @apply bg-primary text-white hover:bg-primary/90;
  }
  
  :global(.btn-outline-primary) {
    @apply border-2 border-primary text-primary hover:bg-primary hover:text-white;
  }
  
  :global(.input) {
    @apply px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50;
  }
  
  :global(.input-bordered) {
    @apply border-gray-300;
  }
</style>