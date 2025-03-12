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
	import Topic from '../../components/Topic.svelte';
	let { data } = $props();
</script>

<title>Community | NWU Vaal GKSS</title>
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
					<h2 class="text-xl font-semibold text-gray-800">No Discussions Yet</h2>
					<p class="text-gray-500">Be the first to start a conversation!</p>
				</div>
				<button onclick={() => my_modal_1.showModal()} class="btn btn-primary gap-2">
					<PlusCircle class="h-5 w-5" />
					Create First Topic
				</button>
			</div>
		{:else}
			<div class="divide-y">
				{#each data.allTopics as topic}
					<div class="transition-colors duration-150 hover:bg-gray-50">
						<Topic {topic} />
					</div>
				{/each}
			</div>
		{/if}
	</main>
</div>
