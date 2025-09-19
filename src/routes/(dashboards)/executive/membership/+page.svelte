<script>
	import { Edit, PlusCircle, SendHorizontal, Trash2, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { fade, fly } from 'svelte/transition';
	import CreateAnnouncement from './pages/CreateAnnouncement.svelte';
	import ManageAnnouncements from './pages/ManageAnnouncements.svelte';
	import { afterNavigate } from '$app/navigation';
	import Seo from '$lib/components/SEO.svelte';

	let { data, form } = $props();
	let members = $state(data.members);

	let page = $state('');

	const changePage = (p = null, search = '') => {
		page = '';
		const allowedPages = ['manageAnnouncements', 'createAnnouncement'];
		if (!p) {
			p = search.substring(search.indexOf('p=') + 2, search.length) || '';
		}

		allowedPages.forEach((pg) => {
			if (p.includes(pg)) {
				page = pg;
				return;
			}
		});
	};

	afterNavigate(({ from, to }) => {
		changePage(null, to.url.search);
	});
</script>

<Seo
	title="Membership Management"
	desc="Efficiently manage and engage with your members using NWU VAAL GKSS's membership management system. Track member details, send announcements, and foster a strong community."
/>

<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="overflow-hidden rounded-lg bg-white shadow-xl"
>
	{#if page.length == 0}
		<div class="flex items-center justify-between p-6">
			<h2 class="text-3xl font-semibold text-gray-800">Members</h2>
		</div>
		<div class="grid w-full grid-cols-2 gap-3 px-2 py-3 lg:max-w-2xl lg:px-7">
			<a
				onclick={() => changePage('createAnnouncement')}
				href="/executive/membership?p=createAnnouncement"
				class="btn btn-primary w-full"><SendHorizontal />Send an announcement</a
			>
			<a
				onclick={() => changePage('manageAnnouncements')}
				href="/executive/membership?p=manageAnnouncements"
				class="btn btn-accent w-full"
				><Edit />
				Manage announcements</a
			>
		</div>
		<div class="max-h-screen overflow-auto px-6 pb-6">
			<table class="w-full text-left text-sm text-gray-600 shadow-xl">
				<thead class="bg-gray-100 text-xs uppercase text-gray-700">
					<tr>
						<th class="px-6 py-4 font-medium">Image</th>
						<th class="px-6 py-4 font-medium">Full Name</th>
						<th class="px-6 py-4 font-medium">Gender</th>
						<th class="px-6 py-4 font-medium">Qualification</th>
						<th class="px-6 py-4 font-medium">Year Of Study</th>
					</tr>
				</thead>
				<tbody>
					{#each members as member, index}
						<tr class="border-b transition-colors hover:bg-gray-50">
							<td class="px-6 py-4 font-semibold text-gray-800"
								><img
									class="h-[30px] w-[30px] rounded-full"
									src={member.image}
									alt={member.surname}
								/></td
							>
							<td class="px-6 py-4 font-semibold text-gray-800"
								>{member.name ? member.name : 'Not provided'} {member.surname}</td
							>
							<td class="px-6 py-4">{member.gender ? member.gender : 'Not provided'}</td>
							<td class="px-6 py-4"
								>{member.qualification ? member.qualification : 'Not provided'}</td
							>
							<td class="px-6 py-4"
								>{member.year_of_study ? member.year_of_study : 'Not provided'}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if page == 'createAnnouncement'}
		<CreateAnnouncement {members} />
	{:else if page == 'manageAnnouncements'}
		<ManageAnnouncements {members} />
	{/if}
</div>
