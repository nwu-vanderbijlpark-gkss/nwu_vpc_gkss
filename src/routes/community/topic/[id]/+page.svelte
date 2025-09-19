<script>
	import { supabase } from '$lib/supabaseClient.js';
	import {
		ArrowLeft,
		ChartNoAxesColumn,
		ChevronLeft,
		ChevronRight,
		Dot,
		Eye,
		Forward,
		MessageCircleMore,
		SendHorizontal,
		Share2,
		ThumbsUp,
		MoreVertical
	} from 'lucide-svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { slide, fade, fly } from 'svelte/transition';
	import NotFoundPage from '$lib/components/NotFoundPage.svelte';
	import Seo from '$lib/components/SEO.svelte';

	let { data } = $props();
	let topic = $state(null);
	let notFound = $state(false);
	let currentImageIndex = $state(0);
	let commentInput = $state('');
	let textarea = $state();

	// Auto-resize function for textarea
	function autoResize() {
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 40), 200)}px`;
		}
	}

	// Web Share API function with improved error handling
	export const shareTopic = async (topicTitle, url) => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: topicTitle,
					text: `Check out this topic: ${topicTitle}`,
					url: url
				});
			} else {
				await copyToClipboard(url);
			}
		} catch (error) {
			console.error('Error sharing:', error);
		}
	};

	export const copyToClipboard = async (url) => {
		try {
			await navigator.clipboard.writeText(url);
			// Replace alert with a toast notification
			showToast('Link copied to clipboard!');
		} catch (error) {
			console.error('Failed to copy:', error);
			showToast('Failed to copy link');
		}
	};

	const navigateImage = (direction) => {
		if (direction === 'next') {
			currentImageIndex =
				currentImageIndex === topic.topic_images.length - 1 ? 0 : currentImageIndex + 1;
		} else {
			currentImageIndex =
				currentImageIndex === 0 ? topic.topic_images.length - 1 : currentImageIndex - 1;
		}
	};

	onMount(() => {
		const id = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
		topic = data.allTopics.filter((topic) => topic.id == id)[0];
		if (!topic) {
			notFound = true;
		}
	});
</script>

<Seo
	title={topic ? topic.topic : 'Topic'}
	desc={topic
		? topic.content.replace(/<[^>]+>/g, '').substring(0, 150)
		: 'View this topic on NWU Vaal GKSS community.'}
/>

{#if !topic}
	{#if notFound}
		<NotFoundPage
			title="Topic not found"
			homeUrl="/community"
			message="Sorry, this topic does not exist, it might have been deleted by its owner."
		/>
	{:else}
		<div class="flex min-h-[50vh] flex-col items-center justify-center" transition:fly>
			<div class="loading loading-spinner loading-lg text-primary"></div>
			<p class="mt-4 text-lg font-medium">Loading topic...</p>
		</div>
	{/if}
{:else}
	<div
		class="mx-auto max-w-3xl space-y-4 rounded-lg bg-white shadow-sm"
		in:fly={{ x: 100, duration: 400 }}
		out:fade={{ duration: 300 }}
	>
		<!-- Header Section -->
		<header class="border-b p-4">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center space-x-3">
					<button
						on:click={() => history.back()}
						class="btn btn-circle btn-ghost btn-sm text-black hover:bg-gray-100"
					>
						<ArrowLeft size={20} />
					</button>
					<div class="flex items-center">
						<div class="avatar mr-2">
							<div class="h-8 w-8 overflow-hidden rounded-full">
								<img src={topic.member.image} alt={topic.member.username} class="object-cover" />
							</div>
						</div>
						<div class="flex items-center text-sm">
							<a href={`/community/${topic.member.username}`} class="font-medium hover:underline"
								>{topic.member.fullName}</a
							>
							<Dot size={16} class="text-gray-400" />
							<span class="text-gray-500">{moment(topic.created_at).fromNow()}</span>
						</div>
					</div>
				</div>
				<button class="btn btn-ghost btn-sm">
					<MoreVertical size={20} />
				</button>
			</div>

			<h1 class="mb-2 text-2xl font-bold">{topic.topic}</h1>
			<div class="content whitespace-pre-wrap text-gray-600">{@html topic.content}</div>
		</header>

		<!-- Image Carousel -->
		{#if topic.topic_images.length > 0}
			<div class="relative h-[400px] w-full bg-gray-100">
				<img
					src={topic.topic_images[currentImageIndex]}
					alt={`Image ${currentImageIndex + 1}`}
					class="h-full w-full object-contain"
				/>
				{#if topic.topic_images.length > 1}
					<div class="absolute inset-0 flex items-center justify-between px-4">
						<button
							class="btn btn-circle btn-sm bg-white/80 hover:bg-white"
							on:click={() => navigateImage('prev')}
						>
							<ChevronLeft size={20} />
						</button>
						<button
							class="btn btn-circle btn-sm bg-white/80 hover:bg-white"
							on:click={() => navigateImage('next')}
						>
							<ChevronRight size={20} />
						</button>
					</div>
					<div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
						{#each topic.topic_images as _, index}
							<button
								class="h-2 w-2 rounded-full transition-colors {index === currentImageIndex
									? 'bg-primary'
									: 'bg-gray-300'}"
								on:click={() => (currentImageIndex = index)}
							/>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Engagement Section -->
		<div class="flex items-center space-x-2 px-4 py-2">
			<div class="tooltip" data-tip={`${topic.topic_views.length} views`}>
				<button class="btn btn-ghost btn-sm gap-2">
					<ChartNoAxesColumn size={18} />
					<span class="text-sm">{topic.topic_views.length}</span>
				</button>
			</div>
			<div class="tooltip" data-tip="Comments">
				<button class="btn btn-ghost btn-sm gap-2">
					<MessageCircleMore size={18} />
					<span class="text-sm">{topic.comment.length}</span>
				</button>
			</div>
			<button
				on:click={() => shareTopic(topic.topic, location.href)}
				class="btn btn-ghost btn-sm gap-2"
			>
				<Share2 size={18} />
				<span class="text-sm">Share</span>
			</button>
		</div>

		<!-- Comments Section -->
		<section class="border-t">
			<h2 class="p-4 text-lg font-semibold">Comments</h2>
			<div class="divide-y">
				{#if topic.comment.length === 0}
					<p class="px-4 py-8 text-center text-gray-500">
						No comments yet. Be the first to share your thoughts!
					</p>
				{:else}
					{#each topic.comment as comment}
						<article id={comment.id} class="p-4 hover:bg-gray-50">
							<div class="mb-2 flex items-center justify-between">
								<div class="flex items-center space-x-2">
									<div class="avatar">
										<div class="h-6 w-6 overflow-hidden rounded-full">
											<img
												src={comment.member.image}
												alt={comment.member.username}
												class="object-cover"
											/>
										</div>
									</div>

									<a
										href={`/community/${comment.member.username}`}
										class="text-sm font-medium hover:underline">{comment.member.fullName}</a
									>
									<span class="text-sm text-gray-500">
										{moment(comment.created_at).fromNow()}
									</span>
								</div>
								<button class="btn btn-circle btn-ghost btn-sm">
									<MoreVertical size={16} />
								</button>
							</div>
							<p class="pl-8 text-gray-700">{comment.content}</p>
							<div class="mt-2 flex items-center space-x-2 pl-8">
								<button class="btn btn-ghost btn-xs gap-1">
									<Forward size={14} />
									<span>Reply</span>
								</button>
								<button class="btn btn-ghost btn-xs gap-1">
									<Share2 size={14} />
									<span>Share</span>
								</button>
							</div>
						</article>
					{/each}
				{/if}
			</div>
		</section>

		<!-- Comment Input -->
		<div class="fixed bottom-16 w-full border-t bg-white p-4 shadow-lg lg:sticky lg:bottom-10">
			<form method="post" class="flex items-center gap-2">
				<textarea
					bind:this={textarea}
					bind:value={commentInput}
					name="comment"
					id="comment"
					rows="1"
					placeholder="Add a comment..."
					class="input input-bordered max-h-[200px] min-h-[40px] flex-1 resize-none overflow-hidden bg-gray-200 py-2"
					on:input={autoResize}
				></textarea>
				<button class="btn btn-circle btn-primary flex-shrink-0" disabled={!commentInput.trim()}>
					<SendHorizontal size={18} />
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	/* Add any custom styles here */
	:global(.avatar) {
		@apply relative inline-block;
	}

	:global(.loading) {
		@apply animate-spin;
	}

	textarea {
		line-height: 1.5;
		padding-top: 8px;
		padding-bottom: 8px;
	}
	trix-editor h1,
	.content :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	trix-editor blockquote,
	.content :global(blockquote) {
		@apply border-l-4 border-gray-300 pl-4 italic text-gray-600;
	}

	trix-editor pre,
	.content :global(pre) {
		@apply rounded bg-gray-100 p-2 font-mono text-sm;
	}

	trix-editor a,
	.content :global(a) {
		@apply text-blue-600 underline;
	}

	trix-editor ul,
	.content :global(ul) {
		@apply list-inside list-disc;
	}

	trix-editor ol,
	.content :global(ol) {
		@apply list-inside list-decimal;
	}
</style>
