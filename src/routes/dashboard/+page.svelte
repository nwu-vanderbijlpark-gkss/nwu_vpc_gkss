<script>
  import { writable } from 'svelte/store';
  import moment from 'moment';
  import { 
    User, Shield, ChartBar, LogOut, Settings, Bell,
    Calendar, Book, Award, UserPlus, Mail
  } from 'lucide-svelte';
	import SideBar from './components/SideBar.svelte';
	import Profile from './components/Profile.svelte';

  const activeTab = $state('stats');
  const notifications = writable(3);
  const inviteEmail = writable('');
  const inviteHistory = writable([
    { email: 'friend@example.com', status: 'Pending', date: '2024-03-01' },
    { email: 'colleague@example.com', status: 'Accepted', date: '2024-02-28' }
  ]);

  let memberData = writable({
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
  const handleLogout = () => console.log('Logging out...');
  const handleImageUpload = (event) => event.target.files[0] && console.log('Image uploaded:', event.target.files[0].name);
  const handleNotificationClick = () => notifications.set(0);
  const handleInviteSend = () => {
    if ($inviteEmail) {
      $inviteHistory = [{ email: $inviteEmail, status: 'Pending', date: moment().format('YYYY-MM-DD') }, ...$inviteHistory];
      inviteEmail.set('');
      alert('Invitation sent!');
    }
  };
  
  
</script>

<div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
  <SideBar memberData={$memberData} activeTab={activeTab} {handleLogout}/>

  <!-- Mobile header -->
  <header class="md:hidden bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
    <div class="flex items-center space-x-3">
      <img src={$memberData.profileImage} alt="Profile" class="w-10 h-10 rounded-full object-cover border-2 border-primary/20"/>
      <h1 class="font-bold">{$memberData.name}</h1>
    </div>
    <button class="relative p-2" on:click={handleNotificationClick}>
      <Bell size={20} />
      {#if $notifications > 0}
        <span class="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {$notifications}
        </span>
      {/if}
    </button>
  </header>

  <!-- Main content -->
  <main class="flex-1 md:ml-64 p-6 mb-16 md:mb-0">
    {#if activeTab === 'stats'}
      <!-- Dashboard content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {#each [{title: 'Total Points', icon: Award, value: '2,450', sub: '+150 this month'},
                {title: 'Next Event', icon: Calendar, value: $memberData.upcomingEvents[0]?.title, 
                 sub: $memberData.upcomingEvents[0]?.date ? moment($memberData.upcomingEvents[0].date).format('MMMM D, YYYY') : 'No events'},
                {title: 'Recent Achievement', icon: Book, value: $memberData.achievements[0]?.title,
                 sub: $memberData.achievements[0]?.date ? moment($memberData.achievements[0].date).format('MMMM D, YYYY') : 'No achievements'}] as stat}
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
            {#each $memberData.interests as interest}
              <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{interest}</span>
            {/each}
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-4">Recent Activity</h3>
          <div class="space-y-4">
            {#each [...$memberData.achievements, ...$memberData.upcomingEvents]
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
      
        <Profile memberData={$memberData}/>

    {:else if activeTab === 'security'}
      <!-- Security content -->
      

    {:else if activeTab === 'invite'}
      <!-- Invite content -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-md">
          <h2 class="text-2xl font-semibold mb-6">Invite Friends</h2>
          <div class="max-w-md">
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" class="mt-1 input input-bordered w-full" 
                       placeholder="friend@example.com" bind:value={$inviteEmail} />
              </div>
              <button class="btn btn-primary mt-7" on:click={handleInviteSend}>
                <Mail size={20} class="mr-2" />Send Invite
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-4">Invite History</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left py-3 px-4 border-b">Email</th>
                  <th class="text-left py-3 px-4 border-b">Status</th>
                  <th class="text-left py-3 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {#each $inviteHistory as invite}
                  <tr>
                    <td class="py-3 px-4 border-b">{invite.email}</td>
                    <td class="py-3 px-4 border-b">
                      <span class="px-2 py-1 rounded-full text-sm
                        {invite.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                         invite.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                         'bg-red-100 text-red-800'}">
                        {invite.status}
                      </span>
                    </td>
                    <td class="py-3 px-4 border-b">{moment(invite.date).format('MMMM D, YYYY')}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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