<script>
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { fade, fly, slide } from 'svelte/transition';

	import { Award, Icon, Medal, Sparkles, Star, Trophy } from 'lucide-svelte';
	import Seo from '$lib/components/SEO.svelte';
	import { gkssConfig } from '$lib/config.ts';
	import { supabase } from '$lib/supabaseClient.js';

	let { data, form } = $props();

	// Reactive state
	let isLoading = $state(false);

	let members = $state(
		data.members.filter((m) => m.name && m.username).sort((a, b) => b.points - a.points)
	);

	const fetchLeaderBoard = async () => {
		const response = await fetch('/api/leaderboard', {
			method: 'GET'
		});
		const res = await response.json();
		console.log(res);
		if (res.success) {
			members = res.members
				.filter((m) => m.name && m.username) // Filter valid members
				.sort((a, b) => b.points - a.points);
		}
	};

	let subscription;
	onMount(async () => {
		// Setup of realtime subscription
		subscription = supabase
			.channel('leaderboard-channel')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'member'
				},
				(payload) => {
					console.log(payload);
					fetchLeaderBoard();
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
	title="Elite Leaderboard"
	desc="Discover the top contributors in the {gkssConfig.name} community. Check out the elite leaderboard showcasing members with the highest points and achievements."
/>

<div transition:fly class="overflow-hidden rounded-lg bg-white shadow-xl">
	{#if isLoading}
		<div class="p-8">
			<Loading />
		</div>
	{:else}
		<main class="max-h-screen space-y-8 overflow-auto px-1">
			<section aria-labelledby="members-heading" class=" md:p-8">
				<!-- Enhanced Title Section -->
				<div class="mb-8 text-center md:mb-12">
					<div class="inline-block rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 p-1">
						<div
							class="flex items-center gap-3 rounded-xl bg-base-100 px-6 py-4 md:gap-4 md:px-8 md:py-5"
						>
							<Trophy
								name="trophy"
								class=" h-8 w-8 animate-bounce  text-amber-500 md:h-10 md:w-10"
								style="animation-duration: 2s;"
							/>
							<h2
								id="members-heading"
								class="bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-2xl font-black tracking-tight text-transparent md:text-4xl"
							>
								ELITE LEADERBOARD
							</h2>
						</div>
					</div>
					<p class="mt-4 text-sm text-gray-500 md:text-base">
						Celebrating our top contributors this month
					</p>
				</div>

				<!-- Responsive Table Section -->
				<div class="overflow-x-auto rounded-box shadow-lg">
					<table class="table table-lg">
						<thead class="bg-base-200">
							<tr>
								<th class="text-xs md:text-sm">Rank</th>
								<th class="text-xs md:text-sm">Member</th>

								<th class="flex items-center text-xs md:text-sm">
									<Star class="mr-1 hidden h-4 w-4 md:inline-block" />
									<span class="md:hidden">⭐</span> Points
								</th>
							</tr>
						</thead>
						<tbody>
							{#each members as member, index}
								<tr
									class="group cursor-pointer transition-all duration-300 hover:bg-gray-100"
									onclick={() => (window.location = `/community/${member.username}`)}
									transition:slide={{ delay: index * 50 }}
								>
									<!-- Rank Column -->
									<td class="font-bold">
										<div class="flex items-center gap-1">
											{#if index == 0}
												<Trophy
													class="h-5 w-5 {['text-amber-400', 'text-slate-400', 'text-amber-600'][
														index
													]}"
												/>
											{:else if index == 1}
												<Medal
													class="h-5 w-5 {['text-amber-400', 'text-slate-400', 'text-amber-600'][
														index
													]}"
												/>
											{:else if index == 2}
												<Award
													class="h-5 w-5 {['text-amber-400', 'text-slate-400', 'text-amber-600'][
														index
													]}"
												/>
											{:else}
												<span class="text-gray-400">#</span>
											{/if}
											<span class="md:text-md text-sm">{index + 1}</span>
										</div>
									</td>

									<!-- Member Column -->
									<td>
										<div class="flex items-center gap-1">
											<div class="avatar">
												<div class="mask mask-circle h-8 w-8 md:h-10 md:w-10">
													<img
														src={member.image || '/default-avatar.png'}
														alt={`${member.name}'s avatar`}
														class="transition-transform group-hover:scale-110"
													/>
												</div>
											</div>
											<div>
												<p class="text-sm font-semibold md:text-base">
													{member.name}
													{member.surname}
												</p>
												<p class="text-xs text-gray-500 md:text-sm">@{member.username}</p>
											</div>
										</div>
									</td>

									<!-- Responsive Columns -->

									<td>
										<div class="badge badge-primary badge-lg gap-1 font-bold">
											<Sparkles class="h-4 w-4" />
											<span class="text-sm md:text-base">{member.points}</span>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		</main>
	{/if}
</div>
