<script>
	import Seo from '$lib/components/SEO.svelte';
	import { fade, fly } from 'svelte/transition';

	let { data } = $props();
	let ideas = $state(data.ideas);
</script>

<Seo
	title="Saved AI Project Ideas"
	desc="Explore a curated collection of AI-generated project ideas saved by you, tailored to various interests and study levels."
/>

<div
	class="min-h-screen bg-gray-50"
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
>
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-4">
					<div>
						<h1 class="text-2xl font-bold text-gray-900">Saved AI Project Ideas</h1>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if !ideas || !ideas.length}
			<div class="flex flex-col items-center justify-center py-12">
				{#if data.isLoggedIn}
					<p class="text-gray-600">You have no ideas saved...</p>
				{:else}
					<a href="/login" class="btn btn-primary">Login to save project ideas</a>
				{/if}
			</div>
		{:else if ideas.length > 0}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each ideas as idea}
					<article
						class="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
					>
						<div class="p-6">
							<div class="mb-4 flex items-start justify-between">
								<h3 class="text-lg font-semibold text-gray-900">{idea.title}</h3>
								{#if idea.domain}
									<span
										class="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800"
									>
										{idea.domain}
									</span>
								{/if}
							</div>

							<p class="mb-4 text-sm leading-relaxed text-gray-600">{idea.description}</p>

							{#if idea.technologies?.length}
								<div class="border-t pt-4">
									<h4 class="mb-3 text-sm font-medium text-gray-900">Tech Stack</h4>
									<div class="flex flex-wrap gap-2">
										{#each idea.technologies.split(',') as tech}
											<span
												class="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-gray-200"
											>
												{tech}
											</span>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="rounded-xl bg-white p-8 text-center shadow-sm">
				<div class="mx-auto max-w-md space-y-4">
					<div class="text-indigo-600">
						<svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-medium text-gray-900">No ideas generated yet</h3>
					<p class="text-sm text-gray-600">
						Click the generate button to create custom idea ideas based on your preferences.
					</p>
				</div>
			</div>
		{/if}
	</main>
</div>
