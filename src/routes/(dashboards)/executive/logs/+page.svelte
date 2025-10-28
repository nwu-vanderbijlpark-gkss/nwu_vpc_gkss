<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient'; // client-side Supabase instance
	import { Calendar1, CalendarClockIcon, Logs } from 'lucide-svelte';
	import moment from 'moment';
	import Loading from '$lib/components/Loading.svelte';
	import Seo from '$lib/components/SEO.svelte';

	let logs = $state([]);
	let isLoading = $state(true);
	let error = $state('');
	let subscription = $state(null);
	let mostVisited = $state({});
	let groupedLogs = $state({});

	$effect(() => {
		// Calculate most frequent location
		const frequencyMap = {};
		let maxCount = 0;
		let mostFrequent = 'N/A';

		// Calculate today's visits
		const today = new Date().toISOString().split('T')[0];
		const todaysVisits = logs.filter(
			(log) => new Date(log.created_at).toISOString().split('T')[0] === today
		).length;

		// Calculate all-time stats
		logs.forEach((log) => {
			// Frequency calculation
			frequencyMap[log.location] = (frequencyMap[log.location] || 0) + 1;
			if (frequencyMap[log.location] > maxCount) {
				maxCount = frequencyMap[log.location];
				mostFrequent = log.location;
			}
		});

		// Unique locations calculation
		const uniqueLocations = new Set(logs.map((log) => log.location)).size;
		const earliestLogDate = moment.min(logs.map((l) => moment(l.created_at)));
		const daysSinceFirstLog = moment().diff(earliestLogDate, 'days') || 1; // Avoid division by zero

		const averageDailyVisits = (logs.length / daysSinceFirstLog).toFixed(1);

		// Update derived state
		analytics = {
			mostFrequentLocation: mostFrequent,
			todaysVisits,
			totalVisits: logs.length,
			uniqueLocations,
			averageDailyVisits
		};
	});

	let analytics = $state({
		mostFrequentLocation: 'N/A',
		todaysVisits: 0,
		totalVisits: 0,
		uniqueLocations: 0,
		averageDailyVisits: 0
	});
	const groupLogs = () => {
		groupedLogs = logs.reduce((acc, log) => {
			const date = new Date(log.created_at);
			const dateKey = date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});

			if (!acc[dateKey]) {
				acc[dateKey] = {
					date: dateKey,
					logs: []
				};
			}

			acc[dateKey].logs.push(log);
			return acc;
		}, {});

		// Convert to array and sort by date (newest first)
		groupedLogs = Object.values(groupedLogs).sort((a, b) => new Date(b.date) - new Date(a.date));
	};
	onMount(async () => {
		// Initial fetch
		try {
			const res = await fetch('/api/getLogs');
			const r = await res.json();
			if (r.success) {
				logs = r.data;
				isLoading = false;
			}
		} catch (e) {
			error = 'Failed to load initial logs';
		}
		groupLogs();
		// Setup realtime subscription
		subscription = supabase
			.channel('app-usage')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'app_usage'
				},
				(payload) => {
					console.log(payload);
					logs = [payload.new, ...logs];
					groupLogs();
				}
			)
			.subscribe();

		// Cleanup on unmount
		return () => {
			if (subscription) {
				supabase.removeChannel(subscription);
			}
		};
	});
</script>

<Seo
	title="Application Usage Logs"
	desc="Monitor and analyze application usage with our comprehensive logs. Track user activity, page visits, and gain insights into application performance."
/>

<div class="container mx-auto overflow-auto px-4 py-8 lg:max-h-[90svh]">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Application Usage Logs</h1>
	<!-- Statistics Cards -->
	<div class="stats stats-vertical lg:stats-horizontal mb-6 w-full shadow">
		<div class="stat">
			<div class="stat-figure text-primary">
				<Logs />
			</div>
			<div class="stat-title">Most used page</div>
			<a href={analytics.mostFrequentLocation} class="stat-value text-primary"
				>{analytics.mostFrequentLocation}</a
			>
			<div class="stat-desc">It is the most visited page</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-secondary"><Calendar1 /></div>
			<div class="stat-title">Today's visits</div>
			<div class="stat-value text-secondary">{analytics.todaysVisits}</div>
			<div class="stat-desc">Visits</div>
		</div>
		<div class="stat">
			<div class="stat-figure text-secondary"><CalendarClockIcon /></div>
			<div class="stat-title">Average daily visits</div>
			<div class="stat-value text-secondary">{analytics.averageDailyVisits}</div>
			<div class="stat-desc">Visits</div>
		</div>
	</div>
	{#if error}
		<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			{error}
		</div>
	{:else if isLoading}
		<div class="text-center text-gray-600">
			Loading logs...
			<Loading />
		</div>
	{:else}
		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div
				class="grid grid-cols-12 border-b border-gray-200 bg-gray-50 p-4 font-semibold text-gray-600"
			>
				<div class="col-span-5">Visitor</div>
				<div class="col-span-4">Page</div>
				<div class="col-span-3">Time</div>
			</div>

			<div>
				{#each groupedLogs as group, i}
					<div>
						<!-- Date Heading -->
						<div
							class="grid grid-cols-12 items-center bg-gray-50 p-4 font-semibold text-gray-600 {i ===
							0
								? ''
								: 'border-t border-gray-200'}"
						>
							<div class="col-span-12 flex items-center justify-between">
								{group.date}
								<p>{group.logs.length} visits</p>
							</div>
						</div>

						<!-- Log Entries -->
						{#each group.logs as log, j}
							<div
								class="grid grid-cols-12 p-4 transition-colors hover:bg-gray-50 {j === 0
									? ''
									: 'border-t border-gray-100'}"
							>
								<div class="col-span-3 text-sm text-gray-500">
									{log.visitor || 'Unknown visitor'}
								</div>
								<a href={log.location} class="col-span-6 text-gray-800">
									{log.location || 'Unknown page'}
								</a>
								<div class="col-span-3 text-sm text-gray-500">
									{new Date(log.created_at).toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</div>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style global>
	@import 'tailwindcss';
	@plugin 'daisyui';
	/* Responsive design for mobile */
	@media (max-width: 640px) {
		.grid.grid-cols-12 > div {
			@apply col-span-12;
			padding: 0.5rem;
		}

		.grid.grid-cols-12 {
			@apply grid-cols-1;
		}

		.bg-gray-50 > div {
			@apply hidden;
		}

		.bg-gray-50 > div:first-child {
			@apply col-span-12 block text-center text-sm;
		}
	}
</style>
