<script>
  import { writable } from 'svelte/store';
  import moment from 'moment';
  import { 
    User, Shield, ChartBar, LogOut, Settings, Bell,
    Calendar, Book, Award, UserPlus, Mail
  } from 'lucide-svelte';

  const activeTab = writable('stats');
  const notifications = writable(3);
  const inviteEmail = writable('');
  const inviteHistory = writable([
    { email: 'friend@example.com', status: 'Pending', date: '2024-03-01' },
    { email: 'colleague@example.com', status: 'Accepted', date: '2024-02-28' }
  ]);

  let memberData = writable({
    name: 'bb', surname: 'nn', date_of_birth: '2004-05-06',
    gender: 'Male', qualification: 'hhh', student_no: 12345678,
    year_of_study: '2nd', profileImage: '/api/placeholder/150/150',
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

  // Profile editing
  let isEditing = false;
  let editedData = { ...$memberData };

  // Security
  let currentPassword = '', newPassword = '', confirmPassword = '';
  let error = '', success = '';

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
  const handleProfileSave = () => {
    memberData.set(editedData);
    isEditing = false;
  };
  const handlePasswordChange = () => {
    error = ''; success = '';
    if (!currentPassword || !newPassword || !confirmPassword) {
      error = 'All fields required';
      return;
    }
    if (newPassword !== confirmPassword) {
      error = 'Passwords don\'t match';
      return;
    }
    success = 'Password changed';
    currentPassword = newPassword = confirmPassword = '';
  };
</script>

<div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
  <!-- Sidebar -->
  <nav class="hidden md:flex flex-col w-64 bg-white shadow-lg h-screen fixed">
    <div class="p-6 border-b flex flex-col items-center space-y-4">
      <div class="relative group">
        <img src={$memberData.profileImage} alt="Profile" class="w-24 h-24 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/50 transition-all"/>
        <label class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg">
          <input type="file" class="hidden" accept="image/*" on:change={handleImageUpload} />
          <Settings size={16} />
        </label>
      </div>
      <div class="text-center">
        <h2 class="font-bold">{$memberData.name} {$memberData.surname}</h2>
        <p class="text-sm text-gray-600">Student No: {$memberData.student_no}</p>
      </div>
    </div>

    <div class="flex flex-col p-4 space-y-2 flex-grow">
      {#each [{id: 'stats', icon: ChartBar, text: 'Dashboard'}, 
              {id: 'profile', icon: User, text: 'Profile'},
              {id: 'security', icon: Shield, text: 'Security'},
              {id: 'invite', icon: UserPlus, text: 'Invite Friends'}] as item}
        <button 
          class="flex items-center space-x-2 p-3 rounded-lg {$activeTab === item.id ? 'bg-primary text-white' : 'hover:bg-gray-100'}"
          on:click={() => activeTab.set(item.id)}>
          <svelte:component this={item.icon} size={20} />
          <span>{item.text}</span>
        </button>
      {/each}
    </div>

    <div class="p-4 border-t">
      <button class="flex items-center space-x-2 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full" on:click={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  </nav>

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
    {#if $activeTab === 'stats'}
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

    {:else if $activeTab === 'profile'}
      <!-- Profile content -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">Personal Information</h2>
          {#if !isEditing}
            <button class="btn btn-primary" on:click={() => isEditing = true}>Edit Profile</button>
          {/if}
        </div>

        {#if isEditing}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each [{label: 'First Name', key: 'name'}, 
                    {label: 'Last Name', key: 'surname'},
                    {label: 'Date of Birth', key: 'date_of_birth', type: 'date'},
                    {label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other']},
                    {label: 'Qualification', key: 'qualification'},
                    {label: 'Year of Study', key: 'year_of_study', type: 'select', 
                     options: ['1st', '2nd', '3rd', '4th']}] as field}
              <div>
                <label class="block text-sm font-medium text-gray-700">{field.label}</label>
                {#if field.type === 'select'}
                  <select class="mt-1 input input-bordered w-full" bind:value={editedData[field.key]}>
                    {#each field.options as option}
                      <option value={option}>{option}</option>
                    {/each}
                  </select>
                {:else}
                  <input 
                    type={field.type || 'text'}
                    class="mt-1 input input-bordered w-full"
                    bind:value={editedData[field.key]}
                  />
                {/if}
              </div>
            {/each}
            
            <div class="md:col-span-2 flex justify-end space-x-4">
              <button class="btn btn-outline-primary" on:click={() => isEditing = false}>Cancel</button>
              <button class="btn btn-primary" on:click={handleProfileSave}>Save Changes</button>
            </div>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each [{label: 'First Name', value: $memberData.name},
                    {label: 'Last Name', value: $memberData.surname},
                    {label: 'Date of Birth', value: moment($memberData.date_of_birth).format('MMMM D, YYYY')},
                    {label: 'Gender', value: $memberData.gender},
                    {label: 'Qualification', value: $memberData.qualification},
                    {label: 'Year of Study', value: $memberData.year_of_study}] as field}
              <div>
                <h3 class="text-sm font-medium text-gray-500">{field.label}</h3>
                <p class="mt-1">{field.value}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>

    {:else if $activeTab === 'security'}
      <!-- Security content -->
      <div class="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
        <h2 class="text-2xl font-semibold mb-6">Change Password</h2>

        {#if error || success}
          <div class="p-4 rounded-lg mb-6 {error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}">
            {error || success}
          </div>
        {/if}

        <form on:submit|preventDefault={handlePasswordChange} class="space-y-6">
          {#each [{label: 'Current Password', bind: currentPassword},
                  {label: 'New Password', bind: newPassword},
                  {label: 'Confirm New Password', bind: confirmPassword}] as field}
            <div>
              <label class="block text-sm font-medium text-gray-700">{field.label}</label>
              <input type="password" class="mt-1 input input-bordered w-full" bind:value={field.bind} />
            </div>
          {/each}
          <button type="submit" class="btn btn-primary w-full">Change Password</button>
        </form>
      </div>

    {:else if $activeTab === 'invite'}
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