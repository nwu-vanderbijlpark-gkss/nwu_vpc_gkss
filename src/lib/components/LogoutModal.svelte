<!-- Logout modal-->
<dialog id="logoutModal" class="modal z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Logout Confirmation</p>
		</div>
		<p class="py-4 text-sm">Do you want to logout?</p>
		<div class="grid grid-cols-2 gap-2">
			<form method="post" action="?/logout" class="w-full">
				<button type="submit" class="btn btn-primary w-full">Yes</button>
			</form>
			<button onclick={() => logoutModal.close()} class="btn btn-secondary w-full">No</button>
		</div>
	</div>
</dialog>
<!-- Logout modal-->
