<script>
	import { supabase } from '$lib/supabaseClient.js';
	import {
		ArrowLeft,
		ChartNoAxesColumn,
		ChevronLeft,
		Dot,
		Eye,
		Forward,
		MessageCircleMore,
		SendHorizontal,
		Share2,
		ThumbsDown,
		ThumbsUp
	} from 'lucide-svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
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
	let topic = $state(null);
	onMount(() => {
		const id = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
		topic = data.allTopics.filter((topic) => topic.id == id)[0];
		console.log(topic);
	});
</script>

{#if !topic}
	<div class="my-20 flex items-center justify-center">
		<p class="text-lg font-bold">Loading Please wait...</p>
		<span class="loading loading-ring loading-lg"></span>
	</div>
{:else}
	<title>{topic.topic} | NWU Vaal GKSS</title>
	<div class="space-y-2 rounded-lg bg-white" transition:slide>
		<div class="p-2">
			<div class="flex items-center justify-between text-sm">
				<span class="flex items-center">
					<button
						onclick={history.back(-1)}
						class="mr-2 rounded-full bg-base-content p-2 hover:scale-105"><ArrowLeft /></button
					>
					<div class="mr-2 h-[25px] w-[25px] overflow-hidden rounded-full">
						<img class="object-fit" src={topic.Member.image} alt={topic.Member.username} />
					</div>
					<a class=" link-hover" href={`/community/${topic.Member.username}`}
						>{topic.Member.username}</a
					>
					<Dot />
					<p class="text-gray-400">{moment(topic.created_at).fromNow()}</p></span
				>
				<button class="btn btn-ghost">Report</button>
			</div>
			<h3 class="text-2xl font-bold">{topic.topic}</h3>
			<p class="mt-2 text-sm text-gray-500">{topic.content}</p>
			{#if topic.topic_images.length > 0}
				<div class="carousel w-full">
					{#each topic.topic_images as image, index}
						<div id={`image${index}`} class="carousel-item relative w-full">
							<img src={image} class="w-full p-2" alt={`Image${index}`} />
							<div
								class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
							>
								<a
									href={`#image${index - 1 == -1 ? topic.topic_images.length - 1 : index - 1}`}
									class="btn btn-circle">❮</a
								>
								<a
									href={`#image${index + 1 == topic.topic_images.length ? 0 : index + 1}`}
									class="btn btn-circle">❯</a
								>
							</div>
						</div>
					{/each}
				</div>
			{/if}
			<div class="mt-5 text-xs">
				<div class="tooltip" data-tip={`${topic.topic_views.length} Total views`}>
					<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
						><ChartNoAxesColumn size="20px" />
						<p>{topic.topic_views.length}</p></button
					>
				</div>
				<div class="tooltip" data-tip="Comments">
					<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
						><MessageCircleMore size="20px" />
						<p>{topic.Comment.length}</p></button
					>
				</div>
				<button
					onclick={() => shareTopic(topic.topic, location.href)}
					class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
					><Share2 size="20px" />
					<p>Share</p></button
				>
			</div>
		</div>
		<hr />
		<div
			class="fixed bottom-0 flex w-full items-center border-t bg-white p-2 shadow-lg lg:relative lg:border-none lg:shadow-none"
		>
			<input
				class="input input-bordered w-full bg-gray-100"
				placeholder="Add a comment"
				readonly
				onclick={() => commentModal.show()}
			/>

			<button type="submit" class="btn btn-ghost text-primary"><SendHorizontal /></button>
		</div>
		<div class="min-h-screen divide-y overflow-auto">
			<h3 class="mb-10 p-2 text-lg font-bold">Comments</h3>
			{#if topic.Comment.length == 0}
				<p class="p-4 text-sm text-gray-400">No comments yet, be the first to leave a comment.</p>
			{:else}
				{#each topic.Comment as comment}
					<div id={comment.id} class=" p-2">
						<div class="flex items-center justify-between text-sm">
							<span class="flex items-center">
								<div class="mr-2 h-[25px] w-[25px] overflow-hidden rounded-full">
									<img
										class="object-fit"
										src={comment.Member.image}
										alt={comment.Member.username}
									/>
								</div>
								<a class=" link-hover" href={`/${comment.Member.username}`}
									>{comment.Member.username}</a
								>
								<Dot />
								<p class="text-gray-400">{moment(comment.created_at).fromNow()}</p></span
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
{/if}
