<script>
	import { goto } from '$app/navigation';
	import Loading from '$lib/components/Loading.svelte';
	import { ArrowLeft, PlusCircle } from 'lucide-svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';

	let announcements = $state([]);

	const getAnnouncements = async () => {
		const req = await fetch('/api/announcement', {
			method: 'GET'
		});
		const res = await req.json();
		if (res.success) {
			announcements = res.data;
			localStorage.setItem('lclannouncements', JSON.stringify(announcements));
		} else {
			//error
		}
	};

	let hasLoaded = $state(false);
	onMount(async () => {
		announcements = JSON.parse(localStorage.getItem('lclannouncements')) || [];
		await getAnnouncements();
		hasLoaded = true;
	});
</script>

<div class="min-h-screen w-full space-y-4 p-5 text-black">
	<div class="flex items-center justify-between gap-1">
		<div class="flex items-center gap-1">
			<button onclick={() => history.back()} class="btn btn-ghost rounded-full"
				><ArrowLeft /></button
			>
			<p class="text-lg font-bold">Manage Announcements</p>
		</div>

		<a class="btn btn-primary flex flex-row" href="/executive/membership?p=createAnnouncement"
			><PlusCircle />Create</a
		>
	</div>
	{#if !announcements.length && !hasLoaded}
		<Loading />
	{:else if !announcements.length && hasLoaded}
		<p class="text-center font-medium">No announcements sent yet.</p>
	{:else}
		<div class="max-h-screen overflow-auto px-6 pb-6">
			<table class="w-full text-left text-sm text-gray-600 shadow-xl">
				<thead class="bg-gray-100 text-xs uppercase text-gray-700">
					<tr>
						<th class="px-6 py-4 font-medium">Posted By</th>
						<th class="px-6 py-4 font-medium">Subject</th>
						<th class="px-6 py-4 font-medium">Date</th>
						<th class="px-6 py-4 font-medium">View</th>
						<th class="px-6 py-4 font-medium">Delete</th>
					</tr>
				</thead>
				<tbody>
					{#each announcements as announcement, index}
						<tr role="button" class="border-b transition-colors hover:bg-gray-50">
							<td class="px-6 py-4 font-semibold text-gray-800"
								>{announcement.member.name ? announcement.member.name : 'Not provided'}
								{announcement.member.surname}</td
							>
							<td class="px-6 py-4">{announcement.subject}</td>
							<td class="px-6 py-4 font-semibold text-gray-800">
								{moment(announcement.created_at).fromNow()}
							</td>

							<td class="link z-40 px-6 py-4">
								<button
									onclick={() => {
										goto('/dashboard/announcements?id=' + announcement.id);
									}}
								>
									View
								</button>
							</td>
							<td
								class="btn btn-ghost z-30 bg-red-600 px-6 py-4 text-black"
								onclick={() => alert('Coming soon.')}
							>
								Delete
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
