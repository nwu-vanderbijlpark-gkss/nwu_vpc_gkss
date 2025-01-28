<script>
	import { Mail } from "lucide-svelte";
	import moment from "moment";

    let inviteEmail = $state('');
    let {history} = $props();
    let inviteHistory = $state(history);
    const handleInviteSend = () => {
    if (inviteEmail) {
      inviteHistory = [{ email: inviteEmail, status: 'Pending', date: moment().format('YYYY-MM-DD') }, ...inviteHistory];
      inviteEmail = '';
      alert('Invitation sent!');
    }
  };
</script>

<!-- Invite content -->
<div class="space-y-6 text-base-200">
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h2 class="text-2xl font-semibold mb-6">Invite Friends</h2>
      <div class="max-w-md">
        <form method="post" class="flex gap-4">
          <div class="flex-1">
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input name="email" type="email" class="mt-1 input input-bordered bg-gray-200 w-full" 
                   placeholder="friend@example.com" bind:value={inviteEmail} />
          </div>
          <button class="btn btn-primary mt-7" onclick={handleInviteSend}>
            <Mail size={20} class="mr-2" />Send Invite
          </button>
        </form>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-xl font-semibold mb-4">Invite History</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left py-3 px-4 border-b">Email</th>
              <th class="text-left py-3 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {#each inviteHistory as invite}
              <tr>
                <td class="py-3 px-4 border-b">{invite.email}</td>
                
                <td class="py-3 px-4 border-b">{moment(invite.date).format('MMMM D, YYYY')}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>