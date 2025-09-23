<script>
	import {
		ChartNoAxesColumn,
		Dot,
		Forward,
		MessageCircleMore,
		PlusCircle,
		Search,
		Share2,
		Star,
		StarOff,
		ThumbsDown,
		ThumbsUp,
		User
	} from 'lucide-svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import Topic from '$lib/components/Topic.svelte';
	import { onMount } from 'svelte';
	import Opportunity from '$lib/components/Opportunity.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import { gkssConfig } from '$lib/config.ts';
	let { data } = $props();
	let feedData = $state([]);

	onMount(() => {
		feedData = [...data.allTopics, ...data.opportunities];
	});
</script>

<Seo
	title="Community Feed"
	desc="Join the {gkssConfig.name} community! Explore topics, opportunities, and connect with fellow members."
/>

<div class="h-full w-full space-y-4" transition:fly>
	<!-- Content Area -->
	<main class="rounded-lg bg-white">
		{#if data.allTopics.length === 0}
			<div class="flex flex-col items-center justify-center space-y-4 py-12 text-center">
				<div class="rounded-full bg-gray-100 p-4">
					<MessageCircleMore class="h-12 w-12 text-gray-400" />
				</div>
				<div class="space-y-2">
					<h2 class="text-xl font-semibold text-gray-800">Feed is empty</h2>
					<p class="text-gray-500">Be the first to start a conversation!</p>
				</div>
				<button onclick={() => my_modal_1.showModal()} class="btn btn-primary gap-2">
					<PlusCircle class="h-5 w-5" />
					Create First Topic
				</button>
			</div>
		{:else}
			<div class="divide-y">
				{#each feedData as feed}
					<div class="space-y-4 transition-colors duration-150 hover:bg-gray-50">
						{#if feed.topic}
							<!--Topic-->
							<Topic topic={feed} />
						{:else if feed.content}
							<!--Opportunity-->
							<Opportunity opportunity={feed} showContent={true} />
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</main>
</div>
