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

	import { slide } from 'svelte/transition';
	import Topic from '../../components/Topic.svelte';
	let { data } = $props();
</script>

<title>Community | NWU Vaal GKSS</title>
<div class=" h-full w-full space-y-1 divide-y" transition:slide>
	<div class="flex w-full items-center justify-between rounded-lg bg-white p-2">
		<div>
			<h1 class="text-xl font-bold">Discussions</h1>
			<p class="text-sm">Share your ideas and opinions with others</p>
		</div>
		<button onclick={() => my_modal_1.showModal()} class="btn btn-primary"
			>New Topic <PlusCircle /></button
		>
	</div>
	{#if data.allTopics.length == 0}
		<p class=" py-20 text-center text-xl">It's empty here😅, be the first to make a post👨🏿‍💻!</p>
	{/if}
	<div class="max-h-[80vh] divide-y overflow-auto">
		{#each data.allTopics as topic}
			<Topic {topic} />
		{/each}
	</div>
</div>
