<script>
	import {
		ChartNoAxesColumn,
		Dot,
		Forward,
		MessageCircleMore,
		PlusCircle,
		Search,
		ThumbsDown,
		ThumbsUp,
		User
	} from 'lucide-svelte';
	import moment from 'moment';
	let { data } = $props();
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
</script>

<title>Community | NWU Vaal GKSS</title>
<div class=" h-full w-full space-y-1 bg-gray-200">
	{#each data.feed as topic}
		<div class="bg-white p-2 hover:shadow-lg lg:rounded-lg">
			<div class="flex items-center justify-between text-sm">
				<span class="flex">
					<a class=" link-hover" href={`/${topic.username}`}>{topic.username}</a>
					<Dot />
					<p class="text-gray-400">{moment(topic.created_at).calendar()}</p></span
				>
				<button class="btn btn-ghost">Report</button>
			</div>
			<a href={`/community/${topic.topic}/${topic.id}`}>
				<h3 class="text-xl font-bold">{topic.topic}</h3>
				<p class="mt-2 text-sm text-gray-800">
					{topic.content}
				</p>
			</a>
			<div class="mt-5 text-xs">
				<div
					class="tooltip"
					data-tip={`${topic.views.count} view${topic.views.count == 1 ? '' : 's'}`}
				>
					<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
						><ChartNoAxesColumn size="20px" />
						<p>{topic.views.count}</p></button
					>
				</div>
				<button class="btn btn-ghost hidden rounded-full bg-base-100/10 text-xs"
					><ThumbsDown size="20px" />
					<p>0</p></button
				>
				<a
					onclick={() => commentModal.show()}
					href={`/community/${topic.topic}/${topic.id}`}
					class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
					><MessageCircleMore size="20px" />
					<p>{topic.comments.count}</p></a
				>
				<button
					onclick={() => shareTopic(topic.topic, `${location.href}/${topic.topic}/${topic.id}`)}
					class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
					><Forward size="20px" />
					<p>Share</p></button
				>
			</div>
		</div>
	{/each}
</div>
