<script>
	import { LogIn, PlusCircle, X } from 'lucide-svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { notifications } from '$lib/stores';
	import Seo from '$lib/components/SEO.svelte';
	import { gkssConfig } from '$lib/config.ts';

	let { data } = $props();
	let images = $state([]);
	let error = $state();
	let isLoading = $state(false);

	const convertToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(0);

	const handleFileChange = (event) => {
		const newImages = Array.from(event.target.files);
		const invalidFiles = newImages.filter((file) => convertToMB(file.size) >= 50);

		if (invalidFiles.length > 0) {
			error = `Cannot upload files above 50MB: ${invalidFiles.map((f) => f.name).join(', ')}`;
			if (navigator.vibrate) {
				navigator.vibrate(200);
			}
			return;
		}

		const duplicates = newImages.filter((file) =>
			images.some((existing) => existing.name === file.name && existing.size === file.size)
		);

		if (duplicates.length > 0) {
			error = `Duplicate files detected: ${duplicates.map((f) => f.name).join(', ')}`;
			if (navigator.vibrate) {
				navigator.vibrate(200);
			}
			return;
		}

		images = [...images, ...newImages];
		error = null;
		event.target.value = '';
	};

	async function handleSubmit(event) {
		event.preventDefault();
		isLoading = true;

		try {
			const formData = new FormData(event.target);
			images.forEach((file) => formData.append('files[]', file));

			const response = await fetch('/community?/addTopic', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) throw new Error('Submission failed');
			notifications.add({
				type: 'success',
				message: 'Topic created successfully!'
			});
			window.location = '/community';
		} catch (e) {
			error = 'Failed to create topic. Please try again.';
			isLoading = false;
			if (navigator.vibrate) {
				navigator.vibrate(200);
			}
		}
	}
</script>

<Seo
	title="Create Topic"
	desc="Start a new discussion topic in the {gkssConfig.name} community forum and engage with fellow students."
/>

<div class="mx-auto max-w-2xl p-5" transition:fly>
	{#if isLoading}
		<Loading text="Creating your topic..." />
	{:else}
		<div class="mb-6 space-y-1">
			<h3 class="flex items-center gap-2 text-2xl font-bold">
				<PlusCircle class="text-primary h-6 w-6" />
				Create New Topic
			</h3>
			<p class="text-sm text-gray-500">Start a meaningful discussion with the community</p>
		</div>

		{#if data.email}
			<form onsubmit={handleSubmit} class="space-y-6">
				<!-- Title Input -->
				<div class="space-y-2">
					<label for="topic" class="block font-medium text-gray-700">
						Topic Title
						<span class="text-error">*</span>
					</label>
					<input
						type="text"
						name="topic"
						required
						placeholder="e.g. Best study techniques for finals"
						class="input input-bordered focus:ring-primary w-full bg-gray-100 focus:ring-2"
					/>
				</div>

				<!-- Content Input -->
				<div class="space-y-2">
					<label for="content" class="block font-medium text-gray-700">
						Detailed Description
						<span class="text-error">*</span>
					</label>
					<main>
						<trix-toolbar id="contentToolbar"></trix-toolbar>
						<input id="content" type="hidden" name="content" />
						<trix-editor toolbar="contentToolbar" input="content"></trix-editor>
					</main>
				</div>

				<!-- File Upload -->
				<div class="space-y-3">
					<label for="images" class="block font-medium text-gray-700">
						Add Media
						<span class="text-sm font-normal">(Max 50MB per file)</span>
					</label>

					<div class="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
						<div class="mb-4 flex flex-wrap gap-3">
							{#each images as image, index}
								<div class="group relative">
									<button
										type="button"
										onclick={() => images.splice(index, 1)}
										class="btn btn-circle btn-xs border-error bg-error absolute -top-2 -right-2 text-white hover:scale-105"
									>
										<X class="h-3 w-3" />
									</button>
									<img
										src={URL.createObjectURL(image)}
										alt={image.name}
										class="h-20 w-20 rounded-lg object-cover shadow-sm transition-opacity group-hover:opacity-80"
									/>
								</div>
							{/each}
						</div>

						<label class="cursor-pointer">
							<input
								type="file"
								name="images"
								accept="image/*"
								multiple
								onchange={handleFileChange}
								class="hidden bg-gray-100"
							/>
							<div class="btn btn-ghost gap-2">
								<PlusCircle class="h-5 w-5" />
								Click to upload or drag and drop
							</div>
						</label>
					</div>

					{#if error}
						<div class="alert alert-error p-3 text-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<span>{error}</span>
						</div>
					{/if}
				</div>

				<!-- Tags Input -->
				<div class="space-y-2">
					<label for="tags" class="block font-medium text-gray-700"> Add Tags </label>
					<input
						type="text"
						name="tags"
						placeholder="e.g. study-tips, programming, exam-prep"
						class="input input-bordered focus:ring-primary w-full bg-gray-100 focus:ring-2"
					/>
					<p class="text-sm text-gray-500">Separate tags with commas (max 5 tags)</p>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					class="btn btn-primary w-full gap-2 transition-transform hover:scale-[1.01]"
					disabled={isLoading}
				>
					{#if isLoading}
						<span class="loading loading-spinner"></span>
						Creating...
					{:else}
						<PlusCircle class="h-5 w-5" />
						Publish Topic
					{/if}
				</button>
			</form>
		{:else}
			<div class="rounded-xl border-2 border-dashed p-8 text-center">
				<div class="mx-auto max-w-xs space-y-4">
					<LogIn class="text-primary mx-auto h-12 w-12" />
					<h4 class="text-xl font-semibold">Join the Discussion</h4>
					<p class="mb-4 text-gray-600">
						Sign in to share your knowledge and engage with the community
					</p>
					<a href="/login" class="btn btn-primary w-full gap-2">
						<LogIn class="h-5 w-5" />
						Login to Continue
					</a>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	@import 'tailwindcss';
	@plugin 'daisyui';
	trix-editor {
		min-height: 200px;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		padding: 1rem;
	}

	trix-editor :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	trix-editor :global(blockquote) {
		@apply border-l-4 border-gray-300 pl-4 text-gray-600 italic;
	}

	trix-editor :global(pre) {
		@apply rounded bg-gray-100 p-2 font-mono text-sm;
	}

	trix-editor :global(a) {
		@apply text-blue-600 underline;
	}

	trix-editor :global(ul) {
		@apply list-inside list-disc;
	}

	trix-editor :global(ol) {
		@apply list-inside list-decimal;
	}
</style>
