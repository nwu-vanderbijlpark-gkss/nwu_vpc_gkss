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
	// Web Share API function
	export const shareTopic = async (topicTitle, url) => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: topicTitle,
					text: `Check out this topic: ${topicTitle}`,
					url: url
				});
			} catch (error) {
				console.error('Error sharing the topic:', error);
			}
		} else {
			// Fallback to copy link
			copyToClipboard();
		}
	};
	export const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(url);
			alert('Link copied to clipboard!');
		} catch (error) {
			console.error('Failed to copy the link:', error);
		}
	};
	let { data } = $props();
</script>

<title>{data.topic} | NWU Vaal GKSS</title>
<div class="space-y-2 bg-white">
	<div class=" p-2">
		<div class="flex items-center justify-between text-sm">
			<span class="flex items-center">
				<a href="/community" class="mr-2 rounded-full bg-base-content p-2 hover:scale-105"
					><ArrowLeft /></a
				>
				<a class=" link-hover" href={`/${data.username}`}>{data.username}</a>
				<Dot />
				<p class="text-gray-400">{moment(data.created_at).calendar()}</p></span
			>
			<button class="btn btn-ghost">Report</button>
		</div>
		<h3 class="text-2xl font-bold">{data.topic}</h3>
		<p class="mt-2 text-sm text-gray-500">{data.content}</p>
		<div class="mt-5 text-xs">
			<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
				><ThumbsUp size="20px" />
				<p>{data.topic_likes.count}</p></button
			>
			<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
				><MessageCircleMore size="20px" />
				<p>{data.comments.length}</p></button
			>
			<button
				onclick={() => shareTopic(data.topic, location.href)}
				class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
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
	<div class="max-h-screen divide-y overflow-auto">
		<h3 class="p-2 text-lg font-bold">Comments</h3>
		{#if data.comments.length == 0}
			<p class="p-4 font-semibold text-gray-400">
				No comments yet, be the first to leave a comment
			</p>
		{:else}
			{#each data.comments as comment}
				<div id={comment.id} class=" p-2">
					<div class="flex items-center justify-between text-sm">
						<span class="flex items-center">
							<a class=" link-hover" href={`/${comment.Member.username}`}
								>{comment.Member.username}</a
							>
							<Dot />
							<p class="text-gray-400">{moment(comment.created_at).calendar()}</p></span
						>
						<button class="btn btn-ghost">Report</button>
					</div>
					<p class="mt-2 text-sm text-gray-800">
						{comment.content}
					</p>
					<div class="mt-5 text-xs">
						<button class="btn btn-ghost hidden rounded-full bg-base-100/10 text-xs"
							><ThumbsUp size="20px" />
							<p>0</p></button
						>
						<button
							onclick={() => shareTopic(comment.content, `${location.href}#${comment.id}`)}
							class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
							><Forward size="20px" />
							<p>Share</p></button
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
