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
	import { fade, fly, slide } from 'svelte/transition';
	import Topic from '$lib/components/Topic.svelte';
	import { onMount } from 'svelte';
	import Project from '$lib/components/Project.svelte';
	import Opportunity from '$lib/components/Opportunity.svelte';
	let { data } = $props();
	let feedData = $state([]);

	onMount(() => {
		feedData = [...data.allTopics, ...data.opportunities, ...data.projects];
		for (let i = feedData.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[feedData[i], feedData[j]] = [feedData[j], feedData[i]]; // Swap
		}
	});
</script>

<title>Community Feed | NWU Vaal GKSS</title>
<div
	class="h-full w-full space-y-4"
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
>
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
						{:else if feed.link}
							<!--Project-->
							<Project project={feed} />
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
