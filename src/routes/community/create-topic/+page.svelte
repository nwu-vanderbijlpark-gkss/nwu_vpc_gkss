<script>
	import { LogIn, PlusCircle, X } from 'lucide-svelte';
	import Loading from '../../../components/Loading.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

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
			return;
		}

		const duplicates = newImages.filter((file) =>
			images.some((existing) => existing.name === file.name && existing.size === file.size)
		);

		if (duplicates.length > 0) {
			error = `Duplicate files detected: ${duplicates.map((f) => f.name).join(', ')}`;
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
			window.location = '/community';
		} catch (e) {
			error = 'Failed to create topic. Please try again.';
			isLoading = false;
		}
	}
</script>

<div class="mx-auto max-w-2xl p-5" in:fly={{ x: 100, duration: 400 }} out:fade={{ duration: 300 }}>
	{#if isLoading}
		<Loading text="Creating your topic..." />
	{:else}
		<div class="mb-6 space-y-1">
			<h3 class="flex items-center gap-2 text-2xl font-bold">
				<PlusCircle class="h-6 w-6 text-primary" />
				Create New Topic
			</h3>
			<p class="text-sm text-gray-500">Start a meaningful discussion with the community</p>
		</div>

		{#if data.email}
			<form on:submit={handleSubmit} class="space-y-6">
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
						class="input input-bordered w-full bg-gray-100 focus:ring-2 focus:ring-primary"
					/>
				</div>

				<!-- Content Input -->
				<div class="space-y-2">
					<label for="content" class="block font-medium text-gray-700">
						Detailed Description
						<span class="text-error">*</span>
					</label>
					<textarea
						name="content"
						required
						rows="5"
						placeholder="Share your thoughts, questions, or ideas here..."
						class="textarea textarea-bordered w-full bg-gray-100 focus:ring-2 focus:ring-primary"
					></textarea>
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
										on:click={() => images.splice(index, 1)}
										class="btn btn-circle btn-xs absolute -right-2 -top-2 border-error bg-error text-white hover:scale-105"
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
								on:change={handleFileChange}
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
						class="input input-bordered w-full bg-gray-100 focus:ring-2 focus:ring-primary"
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
					<LogIn class="mx-auto h-12 w-12 text-primary" />
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
