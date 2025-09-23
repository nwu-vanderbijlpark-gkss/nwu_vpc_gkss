<script>
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { ArrowLeft, Upload } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { models } from '$lib/state.svelte.js';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Details from './components/Details.svelte';
	import Judging from './components/Judging.svelte';
	import Participants from './components/Participants.svelte';
	import Resources from './components/Resources.svelte';
	import { getData } from './components/eventState.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import { gkssConfig } from '$lib/config';

	let { data } = $props();
	let members = data.members;
	let event = $state(data.event);
	//let event = $state(data.event);
	//models.context = 'This event on this page' + JSON.stringify(contextMember);

	let registrationCount = 0;

	let tabs = $state([
		{
			name: 'Details',
			id: 'details',
			isActive: true
		},
		{
			name: 'Judging',
			id: 'judging',
			isActive: false
		},
		{
			name: 'Participants',
			id: 'participants',
			isActive: false
		},
		{
			name: 'Resources',
			id: 'resources',
			isActive: false
		}
	]);

	let activeTab = $state('details');
	afterNavigate(({ from, to }) => {
		activeTab = to.url.searchParams.get('tab') || 'details';
	});

	const setTab = (tab) => {
		tabs = tabs.map((tb) => {
			if (tb.id == tab) return { ...tb, isActive: true };
			else return { ...tb, isActive: false };
		});
		goto($page.url.pathname + '?tab=' + tab);
	};
	let preFetchedData = $state();

	onMount(async () => {
		preFetchedData = await getData(event);
	});
</script>

<Seo
	title={event.topic}
	desc="Explore the details, participants, judging criteria, and resources for this event organized by ${gkssConfig.name}. Stay informed and engaged with all event activities."
/>

<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="container mx-auto max-h-screen min-h-screen overflow-auto bg-white px-4 py-8"
>
	<div class="grid gap-8 text-black">
		<!-- Event Details -->
		<div class="space-y-2">
			<div class="flex w-full items-center justify-between">
				<h1 class="flex items-center text-2xl font-bold">
					<button
						class="rounded-full p-2 text-lg focus:outline-none"
						onclick={() => history.back(-1)}
						aria-label="Go back"
					>
						<ArrowLeft class="h-6 w-6" />
					</button>{event.topic}
				</h1>
			</div>
			<div class="divider"></div>
			<div class="flex flex-wrap gap-2">
				{#each tabs as tab}
					<button
						class="btn {tab.isActive ? 'btn-primary' : 'btn-ghost bg-gray-200'}"
						onclick={() => setTab(tab.id)}>{tab.name}</button
					>
				{/each}
			</div>

			<!--Content goes here-->
			<div class="divider"></div>

			<div class="w-full rounded-lg">
				<!--Tab content-->
				{#if activeTab == 'details'}
					<Details bind:event />
				{:else if activeTab == 'judging'}
					<Judging {preFetchedData} {event} />
				{:else if activeTab == 'participants'}
					<Participants participants={data.participants} groups={data.groups} />
				{:else if activeTab == 'resources'}
					<Resources bind:event />
				{/if}
			</div>
		</div>
	</div>
</div>
