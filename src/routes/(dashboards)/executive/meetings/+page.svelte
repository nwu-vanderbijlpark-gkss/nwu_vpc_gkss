<script>
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';

	const { data } = $props();
	const { meetings } = data;

	afterNavigate(({ from, to }) => {
		const action = to.url.searchParams.get('action') || null;
		if (action == 'create') {
			createMeeting.showModal();
		}
	});
	const newMeeting = $state({
		name: '',
		date: '',
		description: ''
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!newMeeting.name.length || !newMeeting.date.length || !newMeeting.description.length) {
			alert('Please make sure your fill in everything');
			return;
		}
		const req = await fetch('/api/ex/meeting', {
			method: 'POST',
			body: JSON.stringify({ data: newMeeting })
		});
		const res = await req.json();
		if (res.success) {
			const id = res.data[0].id;
			createMeeting.close();
			goto($page.url.pathname + '/' + id);
		} else {
			alert('Failed to create a new meeting, contact the developer for assistance');
		}
	};
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog id="createMeeting" class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Create Meeting Record</h3>
		<p class="py-4">Enter the following data to continue.</p>
		<form method="POST" onsubmit={handleSubmit} class="w-full space-y-4">
			<fieldset class="fieldset w-full">
				<legend class="fieldset-legend">Meeting title</legend>
				<input
					bind:value={newMeeting.name}
					type="text"
					class="input input-bordered w-full"
					placeholder="Enter the title"
				/>
			</fieldset>
			<fieldset class="fieldset w-full">
				<legend class="fieldset-legend">Short description</legend>
				<input
					bind:value={newMeeting.description}
					type="text"
					class="input input-bordered w-full"
					placeholder="Write short description"
				/>
			</fieldset>
			<fieldset class="fieldset w-full">
				<legend class="fieldset-legend">Date for the meeting</legend>
				<input
					bind:value={newMeeting.date}
					type="datetime-local"
					class="input input-bordered w-full"
					placeholder="Date for the meeting"
				/>
			</fieldset>
		</form>
		<div class="modal-action grid grid-cols-2 items-center">
			<form method="dialog" class="w-full">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn w-full" onclick={() => goto($page.url.pathname)}>Close</button>
			</form>
			<button class="btn btn-primary" onclick={handleSubmit} type="submit">Submit</button>
		</div>
	</div>
</dialog>

<div class=" overflow-auto p-5 lg:max-h-[90svh]">
	<div class="flex items-center justify-between">
		<h1 class="text-lg font-bold text-black">Meetings</h1>
		<button onclick={() => goto($page.url.pathname + '?action=create')} class="btn btn-primary"
			>Create</button
		>
	</div>

	<ul class="list space-y-2 rounded-box text-black">
		<li class="p-4 pb-2 text-sm tracking-wide opacity-60">
			These are the meetings the committee attended.
		</li>
		{#each meetings as meeting}
			<a
				href="/executive/meetings/{meeting.id}"
				class="flex w-full flex-col rounded-lg bg-white p-2 hover:bg-gray-200"
			>
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-bold">{meeting.name}</h2>
				</div>

				<p>{meeting.description}</p>
				<div class="flex items-center justify-between">
					<p class="text-xs opacity-50">Created by {meeting.member.email}</p>
					<p class="text-sm">Date: {meeting.date}</p>
				</div>
			</a>
		{/each}
	</ul>
</div>
