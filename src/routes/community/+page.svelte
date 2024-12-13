<script>
	import {
		Dot,
		Forward,
		MessageCircleMore,
		PlusCircle,
		Search,
		ThumbsDown,
		ThumbsUp,
		User
	} from 'lucide-svelte';
	let { data } = $props();
</script>

<title>Community | NWU Vaal GKSS</title>
<div class="divide-y-2">
	{#each data.feed as topic}
		{console.log(topic)}
		<div class="p-2 hover:rounded-lg hover:shadow">
			<div class="flex items-center justify-between text-sm">
				<span class="flex">
					<a class=" link-hover" href="/">lethabomaepa11</a>
					<Dot />
					<p class="text-gray-400">16hr ago</p></span
				>
				<button class="btn btn-ghost">Report</button>
			</div>
			<a href={`/community/${topic.topic.topic}/${topic.topic.id}`}>
				<h3 class="text-2xl font-bold">{topic.topic.topic}</h3>
				<p class="mt-2 text-sm text-gray-500">
					{topic.topic.content}
				</p>
			</a>
			<div class="mt-5 text-xs">
				<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
					><ThumbsUp size="20px" />
					<p>{topic.topic.topic_likes.count}</p></button
				>
				<button class="btn btn-ghost hidden rounded-full bg-base-100/10 text-xs"
					><ThumbsDown size="20px" />
					<p>0</p></button
				>
				<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
					><MessageCircleMore size="20px" />
					<p>{topic.topic.comments.count}</p></button
				>
				<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
					><Forward size="20px" />
					<p>Share</p></button
				>
			</div>
		</div>
	{/each}
</div>
