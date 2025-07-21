<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Loading from '$lib/components/Loading.svelte';
	import TrixDisplay from '$lib/components/TrixDisplay.svelte';
	import { ArrowLeft, LucideSquareArrowOutUpRight } from 'lucide-svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';

	let announcements = $state([]);
	let currentAnnouncement = $state(null); //the selected announcement
	let isLoading = $state(true);

	const getAnnouncements = async () => {
		const req = await fetch('/api/announcement', {
			method: 'GET'
		});
		const res = await req.json();
		if (res.success) {
			announcements = res.data;
			models.context += 'Announcements: ' + JSON.stringify(announcements);

			localStorage.setItem('lclannouncements', JSON.stringify(announcements));
		} else {
			//error
		}
	};

	onMount(async () => {
		isLoading = false;
		announcements = JSON.parse(localStorage.getItem('lclannouncements')) || [];
		await getAnnouncements();
		if (!$page.url.pathname.includes('/announcements')) {
			//display only 5
			announcements.slice(0, 5);
		}
	});

	const getAnnouncementById = async (id) => {
		const req = await fetch('/api/announcement?id=' + id, {
			method: 'GET'
		});
		const res = await req.json();
		if (res.success) {
			currentAnnouncement = res.data;
		}
		isLoading = false;
	};

	afterNavigate(({ from, to }) => {
		currentAnnouncement = null;
		const id = to.url.searchParams.get('id') || null;
		if (id) {
			isLoading = true;
			getAnnouncementById(id);
		} else {
			//pass
		}
	});
</script>

<div
	class="my-3 {$page.url.pathname.includes('/announcements') &&
		'min-h-screen'} rounded-xl bg-white p-6 text-black shadow-md"
>
	{#if isLoading}
		<div class="flex min-h-screen w-full items-center justify-center text-black">
			<Loading />
		</div>
	{:else if currentAnnouncement}
		<h3 class="mb-4 flex items-center text-xl font-semibold">
			<button class="btn btn-ghost" onclick={() => history.back()}><ArrowLeft /></button
			>{currentAnnouncement.subject}
		</h3>
		<div class="px-10">
			<p class="text-lg font-bold">Posted by</p>
			<p>{currentAnnouncement.Member.name} {currentAnnouncement.Member.surname}</p>
			<p class="text-lg font-bold">Date</p>
			<p>{moment(currentAnnouncement.created_at).fromNow()}</p>
		</div>

		<div class="flex flex-col items-center justify-center">
			<div class="lg:w-2/3">
				<TrixDisplay content={currentAnnouncement.body} />
			</div>
		</div>
	{:else}
		<div
			class="flex items-center {$page.url.pathname.includes('/announcements')
				? ''
				: 'flex-row-reverse justify-between'}"
		>
			{#if !$page.url.pathname.includes('/announcements')}
				<a href="/dashboard/announcements" class="btn btn-ghost text-sm"
					>View All<LucideSquareArrowOutUpRight /></a
				>
			{/if}
			<h3 class="mb-4 flex items-center text-xl font-semibold">
				{#if $page.url.pathname.includes('/announcements')}
					<button class="btn btn-ghost m-0 p-0" onclick={() => history.back()}><ArrowLeft /></button
					>
				{/if}
				Recent Announcements
			</h3>
		</div>
		<div class="space-y-4 divide-y p-4">
			{#each announcements as announcement}
				<a
					class="flex items-start hover:rounded-lg hover:bg-gray-100"
					href="/dashboard/announcements?id={announcement.id}"
				>
					<div class="ml-4">
						<h4 class="font-bold">{announcement.subject}</h4>
						<p class="text-sm font-medium text-gray-600">
							Posted by: <span class="font-bold"
								>{announcement.Member.name} {announcement.Member.surname}</span
							>
						</p>
						<p class="text-sm text-gray-600">
							{moment(announcement.created_at).format('LLL')}
						</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
