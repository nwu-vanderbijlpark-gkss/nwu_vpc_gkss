<script>
	import {
		BriefcaseBusiness,
		ChartNoAxesColumn,
		CodeXml,
		Github,
		Linkedin,
		Mail,
		PenBox,
		Star,
		Stars,
		Trash
	} from 'lucide-svelte';
	import NotFoundPage from '$lib/components/NotFoundPage.svelte';
	import Topic from '$lib/components/Topic.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { models } from '$lib/state.svelte.js';
	import Seo from '$lib/components/SEO.svelte';

	let { data } = $props();
	const member = data.member;
	let myProfile = $state(false);
	let username = $state('');
	let showPortfolioPreview = $state(false);
	let showGithubPreview = $state(false);
	let showLinkedinPreview = $state(false);
	let githubData = $state(null);
	let portfolioLoading = $state(true);
	let portfolioError = $state(false);

	let contextMember = { ...(data.member || {}) }; // ensure it’s an object
	delete contextMember.topics;
	models.context = JSON.stringify(contextMember);

	onMount(() => {
		myProfile = location.pathname.includes('profile');
		username = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
	});

	let topics = $state(member.topics);
	const deleteTopic = async (topic, index) => {
		if (confirm("Delete topic: '" + topic.topic + "'?")) {
			const formData = new FormData();
			formData.append('id', topic.id);
			await fetch('/community?/deleteTopic', {
				method: 'POST',
				body: formData
			});
			topics.splice(index, 1);
		}
	};
</script>

<Seo
	title={member.fullName}
	desc={`View ${member.fullName} on NWU Vaal GKSS Website`}
	image={member.image}
/>

{#if data.notFound}
	<NotFoundPage
		title="User not found"
		homeUrl="/community"
		message={`Sorry, this user '@${username}' does not exist, please try again later or return to home`}
	/>
{:else}
	<div transition:fly class="min-h-screen pb-8">
		<!-- Profile Header -->
		<div class="flex flex-col items-center gap-8 px-4 py-6 lg:flex-row lg:items-start lg:px-8">
			<!-- Profile Image -->
			<div class="flex flex-col items-center space-y-3 text-center">
				<div class="relative">
					<img
						src={member.image}
						alt={member.username}
						class="h-32 w-32 rounded-full border-4 border-primary/10 shadow-lg"
					/>
					{#if myProfile}
						<div
							class="absolute -bottom-2 right-0 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white"
						>
							You
						</div>
					{/if}
				</div>
				<div class="space-y-1">
					{#if !member.fullName.includes('null')}
						<h1 class="text-2xl font-bold text-gray-800">{member.fullName}</h1>
					{/if}
					<a href={`mailto:${member.email}`} class="flex items-center gap-2 rounded-lg px-4 py-2">
						<Mail class="h-5 w-5 " />
						<span class="text-sm font-medium text-gray-700">{member.email}</span>
					</a>

					<!-- Portfolio Hover Card -->
					{#if member.portfolio}
						<div class="relative inline-block">
							<a
								href={member.portfolio}
								onfocus={this.blur()}
								target="_blank"
								class="inline-flex items-center gap-2 text-primary hover:text-primary/80"
								onmouseover={() => (showPortfolioPreview = true)}
								onmouseleave={() => (showPortfolioPreview = false)}
							>
								<BriefcaseBusiness class="h-5 w-5" />
								<span class="text-sm font-medium">{new URL(member.portfolio).hostname}</span>
							</a>

							{#if showPortfolioPreview}
								<div
									class="absolute bottom-full left-0 z-50 w-96 rounded-lg border bg-white shadow-xl transition-opacity"
									transition:fade={{ duration: 150 }}
								>
									<div class="relative h-64 overflow-hidden rounded-t-lg">
										{#if portfolioLoading}
											<div class="absolute inset-0 flex items-center justify-center bg-gray-50">
												<div
													class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"
												></div>
											</div>
										{/if}

										<iframe
											title="Portfolio Preview"
											src={member.portfolio}
											class="h-full w-full"
											onload={() => (portfolioLoading = false)}
											onerror={() => {
												portfolioLoading = false;
												portfolioError = true;
											}}
										></iframe>

										{#if portfolioError}
											<div
												class="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600"
											>
												Could not load preview
											</div>
										{/if}
									</div>
									<div class="p-3 text-sm text-gray-600">
										Website preview - <span class="text-primary">Click to visit</span>
									</div>
								</div>
							{/if}
						</div>
					{/if}
					<br />
					<!-- GitHub Hover Card -->
					{#if member.github}
						<div class="relative inline-block">
							<a
								href={member.github}
								target="_blank"
								onfocus={this.blur()}
								class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
								onmouseover={async () => {
									showGithubPreview = true;
									if (!githubData) {
										try {
											const username = new URL(member.github).pathname.slice(1);
											const response = await fetch(`https://api.github.com/users/${username}`);
											githubData = await response.json();
										} catch (error) {
											console.error('GitHub API error:', error);
										}
									}
								}}
								onmouseleave={() => (showGithubPreview = false)}
							>
								<Github class="h-5 w-5 text-gray-800" />
								<span class="text-sm font-medium text-gray-700">GitHub</span>
							</a>

							{#if showGithubPreview}
								<div
									class="absolute bottom-full left-0 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-xl"
									transition:fade={{ duration: 150 }}
									style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
								>
									{#if githubData}
										<div class="p-4">
											<div class="flex items-start gap-3">
												<img
													src={githubData.avatar_url}
													class="h-14 w-14 rounded-full border border-gray-200"
													alt="GitHub avatar"
												/>
												<div class="flex-1">
													<div class="flex items-baseline gap-2">
														<h3 class="text-lg font-semibold text-gray-900">
															{githubData.name || githubData.login}
														</h3>
														{#if githubData.login}
															<span class="text-sm font-medium text-gray-500">
																@{githubData.login}
															</span>
														{/if}
													</div>

													{#if githubData.bio}
														<p class="mt-1 text-sm leading-snug text-gray-700">
															{githubData.bio}
														</p>
													{/if}

													{#if githubData.location}
														<div class="mt-2 flex items-center text-sm text-gray-600">
															<svg class="mr-1.5 h-4 w-4 fill-gray-500" viewBox="0 0 16 16">
																<path
																	fill-rule="evenodd"
																	d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"
																/>
															</svg>
															{githubData.location}
														</div>
													{/if}
												</div>
											</div>

											<div class="mt-4 flex divide-x divide-gray-200 text-sm">
												<div class="flex gap-1 pr-4">
													<span class="font-semibold text-gray-900">{githubData.public_repos}</span>
													<span class="text-gray-600">repos</span>
												</div>
												<div class="flex gap-1 px-4">
													<span class="font-semibold text-gray-900">{githubData.followers}</span>
													<span class="text-gray-600">followers</span>
												</div>
												<div class="flex gap-1 pl-4">
													<span class="font-semibold text-gray-900">{githubData.following}</span>
													<span class="text-gray-600">following</span>
												</div>
											</div>
										</div>
									{:else}
										<div class="flex h-20 items-center justify-center">
											<svg
												class="h-8 w-8 animate-spin text-gray-400"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													class="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													stroke-width="4"
												/>
												<path
													class="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{/if}

					<!-- LinkedIn Hover Card -->
					{#if member.linkedin}
						<div class="relative inline-block">
							<a
								href={member.linkedin}
								onfocus={this.blur()}
								target="_blank"
								class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
								onmouseover={() => (showLinkedinPreview = true)}
								onmouseleave={() => (showLinkedinPreview = false)}
							>
								<Linkedin class="h-5 w-5 text-[#0A66C2]" />
								<span class="text-sm font-medium text-gray-700">LinkedIn</span>
							</a>
						</div>
					{/if}
				</div>
			</div>

			<div class="w-full max-w-2xl space-y-6 rounded-xl border bg-white p-6 shadow-sm">
				<h2 class="text-xl font-semibold text-gray-800">Contribution Overview</h2>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<!-- Topics Created -->
					<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div>
							<p class="text-sm font-medium text-gray-500">Topics Created</p>
							<p class="text-2xl font-bold text-gray-800">{member.topics.length}</p>
						</div>
						<PenBox class="h-8 w-8 text-primary" />
					</div>

					<!-- Total Views -->
					<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div>
							<p class="text-sm font-medium text-gray-500">Total Views</p>
							<p class="text-2xl font-bold text-gray-800">{member.user_views}</p>
						</div>
						<ChartNoAxesColumn class="h-8 w-8 text-primary" />
					</div>

					<!-- Ratings -->
					<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div>
							<p class="text-sm font-medium text-gray-500">Total Points</p>
							<p class="text-2xl font-bold text-gray-800">{member.points.toFixed(0) || 0.0} pts</p>
						</div>
						<Stars class="h-8 w-8 text-primary" />
					</div>
				</div>
			</div>
		</div>

		<!-- Content Tabs -->
		<div class="px-4 lg:px-8">
			<div role="tablist" class="tabs-boxed tabs bg-gray-100 p-2">
				<input
					type="radio"
					name="my_tabs_2"
					role="tab"
					aria-label="Topics"
					checked="checked"
					class="tab font-medium text-gray-500 [--tab-bg:transparent] aria-selected:bg-primary aria-selected:text-white"
				/>
				<div role="tabpanel" class="tab-content mt-4 space-y-4">
					{#each topics as topic, index}
						<Topic {topic} {myProfile} {deleteTopic} {index} />
					{:else}
						<div class="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
							No topics created yet
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
