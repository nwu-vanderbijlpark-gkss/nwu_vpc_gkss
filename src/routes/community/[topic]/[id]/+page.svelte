<script>
	import {
		ArrowLeft,
		ChevronLeft,
		Dot,
		Forward,
		MessageCircleMore,
		SendHorizontal,
		ThumbsDown,
		ThumbsUp
	} from 'lucide-svelte';
	import moment from 'moment';
	let { data } = $props();
</script>

<title>Topic | NWU Vaal GKSS</title>
<div class="space-y-2 bg-white">
	<div class=" p-2">
		<div class="flex items-center justify-between text-sm">
			<span class="flex items-center">
				<button
					class="mr-2 rounded-full bg-base-content p-2 hover:scale-105"
					onclick={() => window.history.back()}><ArrowLeft /></button
				>
				<a class=" link-hover" href="/">lethabomaepa11</a>
				<Dot />
				<p class="text-gray-400">{moment(data.topic.created_at).calendar()}</p></span
			>
			<button class="btn btn-ghost">Report</button>
		</div>
		<h3 class="text-2xl font-bold">{data.topic.topic}</h3>
		<p class="mt-2 text-sm text-gray-500">{data.topic.content}</p>
		<div class="mt-5 text-xs">
			<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
				><ThumbsUp size="20px" />
				<p>{data.topic.topic_likes.count}</p></button
			>
			<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
				><MessageCircleMore size="20px" />
				<p>0</p></button
			>
			<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
				><Forward size="20px" />
				<p>Share</p></button
			>
		</div>
	</div>
	<hr />
	<form
		method="post"
		class="fixed bottom-0 flex w-full items-center bg-white p-2 shadow-md lg:relative"
	>
		<textarea
			class="textarea textarea-ghost w-full"
			name="comment"
			id="comment"
			placeholder="Add a comment"
		></textarea>
		<input type="text" hidden class="hidden" readonly id="id" name="id" value="id" />
		<button type="submit" class="btn btn-ghost text-primary"><SendHorizontal /></button>
	</form>
	<div class="max-h-screen overflow-auto">
		{#each data.topic.comments as comment}
			<div class=" p-2">
				<div class="flex items-center justify-between text-sm">
					<span class="flex items-center">
						<a class=" link-hover" href="/">lethabomaepa11</a>
						<Dot />
						<p class="text-gray-400">{moment(comment.created_at).calendar()}</p></span
					>
					<button class="btn btn-ghost">Report</button>
				</div>
				<p class="mt-2 text-sm text-gray-500">
					{comment.content}
				</p>
				<div class="mt-5 text-xs">
					<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
						><ThumbsUp size="20px" />
						<p>0</p></button
					>
					<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
						><Forward size="20px" />
						<p>Share</p></button
					>
				</div>
			</div>
		{/each}
	</div>
</div>
