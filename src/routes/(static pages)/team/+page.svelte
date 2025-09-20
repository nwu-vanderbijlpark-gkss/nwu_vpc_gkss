<script>
	import Seo from '$lib/components/SEO.svelte';
	import { Github, Linkedin } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let { data, form } = $props();
	const spotlight = data.team[Math.floor(Math.random() * data.team.length)];
	const currentYear = new Date().getFullYear();

	// Split team into current and previous leaders
	const currentLeaders = data.team.filter((team) => team.year == currentYear);
	const previousLeaders = data.team.filter((team) => team.year < currentYear);

	// State to manage active tab
	let activeTab = $state('current');
</script>

<Seo
	title="Team"
	image={spotlight.member.image}
	desc="Leader Spotlight: {spotlight.member.name} {spotlight.member
		.surname}, our {spotlight.role}, {spotlight.member.year_of_study} year {spotlight.member
		.qualification} student.
	Meet the dedicated team members of the NWU Vaal GKSS, committed to fostering a vibrant student community through events, workshops, and initiatives.
	The team: {data.team
		.map((member) => member.member.name + ' ' + member.member.surname + ' (' + member.role + ')')
		.join(', ')}"
/>

<div transition:fly={{ y: 50, duration: 500 }} class="min-h-screen bg-base-100 p-6">
	<!-- Header Section -->
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-5xl font-extrabold text-base-content">Meet the Team</h1>
		<p class="mx-auto max-w-2xl text-lg text-base-content/70">
			Discover the passionate leaders of NWU Vaal GKSS who drive our community forward through
			innovation, collaboration, and dedication.
		</p>
	</div>

	<!-- Tabs for Current and Previous Leaders -->
	<div class="tabs-boxed tabs mb-8 justify-center">
		<button
			class="tab-lg tab {activeTab === 'current' ? 'tab-active' : ''}"
			onclick={() => (activeTab = 'current')}
		>
			Current Leaders
		</button>
		<button
			class="tab-lg tab {activeTab === 'previous' ? 'tab-active' : ''}"
			onclick={() => (activeTab = 'previous')}
		>
			Previous Leaders
		</button>
	</div>

	<!-- Team Grid -->
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#if activeTab === 'current'}
			{#each currentLeaders as team}
				<div
					class="card transform bg-base-100 shadow-xl transition-all duration-300 hover:scale-105"
					in:fly={{ y: 20, duration: 300, delay: 100 }}
				>
					<figure class="px-4 pt-4">
						<img
							src={team.member.image}
							alt="{team.member.name} {team.member.surname}"
							class="h-64 w-full rounded-lg object-cover"
						/>
					</figure>
					<div class="card-body">
						<h2 class="card-title text-2xl font-bold text-primary">
							{team.member.name}
							{team.member.surname}
						</h2>
						<p class="text-lg text-base-content/80">{team.role}</p>
						<p class="text-sm text-base-content/60">
							{team.member.year_of_study} Year {team.member.qualification}
						</p>
						<div class="mt-4">
							<a href={`mailto:${team.member.email}`} class="link-hover link text-sm text-primary">
								{team.member.email}
							</a>
						</div>
						<div class="mt-4 flex gap-3">
							{#if team.member.github}
								<a
									href={team.member.github}
									target="_blank"
									aria-label="GitHub"
									class="btn btn-circle btn-ghost"
								>
									<Github class="h-6 w-6 text-base-content" />
								</a>
							{/if}
							{#if team.member.linkedin}
								<a
									href={team.member.linkedin}
									target="_blank"
									aria-label="LinkedIn"
									class="btn btn-circle btn-ghost"
								>
									<Linkedin class="h-6 w-6 text-[#0A66C2]" />
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		{:else}
			{#each previousLeaders as team}
				<div
					class="card transform bg-base-100 shadow-xl transition-all duration-300 hover:scale-105"
					in:fly={{ y: 20, duration: 300, delay: 100 }}
				>
					<figure class="px-4 pt-4">
						<img
							src={team.member.image}
							alt="{team.member.name} {team.member.surname}"
							class="h-64 w-full rounded-lg object-cover"
						/>
					</figure>
					<div class="card-body">
						<h2 class="card-title text-2xl font-bold text-primary">
							{team.member.name}
							{team.member.surname}
						</h2>
						<p class="text-lg text-base-content/80">{team.role} ({team.year})</p>
						<p class="text-sm text-base-content/60">
							{team.member.year_of_study} Year {team.member.qualification}
						</p>
						<div class="mt-4">
							<a href={`mailto:${team.member.email}`} class="link-hover link text-sm text-primary">
								{team.member.email}
							</a>
						</div>
						<div class="mt-4 flex gap-3">
							{#if team.member.github}
								<a
									href={team.member.github}
									target="_blank"
									aria-label="GitHub"
									class="btn btn-circle btn-ghost"
								>
									<Github class="h-6 w-6 text-base-content" />
								</a>
							{/if}
							{#if team.member.linkedin}
								<a
									href={team.member.linkedin}
									target="_blank"
									aria-label="LinkedIn"
									class="btn btn-circle btn-ghost"
								>
									<Linkedin class="h-6 w-6 text-[#0A66C2]" />
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	/* Custom styles for enhanced visuals */
	.card {
		@apply overflow-hidden rounded-xl bg-base-100;
	}
	.card:hover {
		@apply shadow-2xl;
	}
	.card-title {
		@apply font-bold text-primary;
	}
</style>
