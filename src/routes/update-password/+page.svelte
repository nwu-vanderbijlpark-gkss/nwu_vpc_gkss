<script>
	import { slide } from "svelte/transition";


  let newPassword = $state(), confirmPassword = $state();
  let error = $state(), success = $state();

    const handlePasswordChange = (event) => {
        event.preventDefault();
    error = ''; success = '';
    if (!newPassword || !confirmPassword) {
      error = 'All fields required';
      return;
    }
    if (newPassword !== confirmPassword) {
      error = 'Passwords don\'t match';
      return;
    }
    event.target.submit();
    success = 'Password changed';
    newPassword = confirmPassword = '';
  };
</script>
<div transition:slide class="flex w-full min-h-screen bg-[#0c0c0c] justify-around items-center p-5">
	<img src="/change-password.png" alt="code" class="w-2/5 rounded-lg hidden lg:flex"/>
	<div class="flex flex-col items-center p-5 justify-center space-y-5 rounded-xl w-full lg:w-2/5 lg:shadow-2xl lg:bg-base-200">
        <h2 class="text-2xl font-semibold  text-white">Change Password</h2>

    {#if error || success}
      <div class="{error ? ' text-red-600' : ' text-green-600'}">
        {error || success}
      </div>
    {/if}

    <form method="post" action="/update-password" onsubmit={handlePasswordChange} class="space-y-6 w-full">
        <div>
          <label class="block text-sm font-medium text-white"  for="newPassword">New Password</label>
          <input name="newPassword" placeholder="Create new password"  type="password" class="mt-1 input input-bordered w-full text-white" bind:value={newPassword} />
        </div>
        <div>
            <label for="confirmPassword" class="block text-sm font-medium text-white">Confirm New Password</label>
            <input name="confirmPassword" placeholder="Confirm password" type="password" class="mt-1 input input-bordered w-full text-white" bind:value={confirmPassword} />
          </div>
      <button type="submit" class="btn btn-primary w-full">Change Password</button>
    </form>
  </div>
  </div>    