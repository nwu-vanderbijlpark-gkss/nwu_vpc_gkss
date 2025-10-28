<script>
	import Seo from '$lib/components/SEO.svelte';
	import { currentUser } from '$lib/state.svelte.js';
	import { notifications } from '$lib/stores.js';
	import { CheckCheck, LogIn, Settings } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, fly, slide } from 'svelte/transition';

	let { data } = $props();

	let message = $state();
	let output = $state();

	let isLoading = $state(false);
	const models = [
		'gemma2-9b-it',
		'llama-3.1-8b-instant',
		'llama-3.2-11b-vision-preview',
		'llama-3.2-1b-preview',
		'llama-3.2-3b-preview',
		'llama-3.2-90b-vision-preview',
		'llama-3.3-70b-specdec',
		'llama-3.3-70b-versatile',
		'llama-guard-3-8b',
		'llama3-70b-8192',
		'llama3-8b-8192',
		'mixtral-8x7b-32768',
		'qwen-2.5-32b',
		'qwen-2.5-coder-32b'
	];

	let model = $state(models[Math.floor(Math.random() * models.length)]); //choosing a random model
	let options = $state({
		size: 5,
		year_of_study: currentUser.data ? currentUser.data.year_of_study : 'any',
		qualification: currentUser.data ? currentUser.data.qualification : 'Computer Science',
		interests: currentUser.data ? currentUser.data.interests : 'anything',
		technologies: 'any'
	});
	async function handleSubmit(e) {
		message = `Return only a JavaScript array with exactly ${options.size} objects. Do not include any additional text, markdown formatting, or explanations. Each object must have the keys 'title', 'full_description', 'image', 'technologies','domain'. The 'full_description' should include a concise guide on how to start the project (such as initial setup, key steps, and tools required) as well as a summary of its main functions and benefits. Each project idea must be creative, feasible, and tailored for a ${options.year_of_study} ${options.qualification} student interested in ${options.interests}, ${options.technologies}. Ensure the output is valid JavaScript with no extra commentary or formatting.`;
		//e.preventDefault();
		isLoading = true;
		options.size = options.size > 5 ? 5 : options.size; //restrict to max of 5 projects

		const response = await fetch('/community/ai-api', {
			method: 'POST',
			body: JSON.stringify({ message, model }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();

		if (!result.success) {
			notifications.add({
				type: 'error',
				message: 'Failed to generate ideas. Please choose a different model.'
			});

			isLoading = false;
		}
		output = result.response.replace('`', '');
		isLoading = false;
	}

	let showToast = $state(false);

	async function handleSave(project) {
		const response = await fetch('/community/save-ideas', {
			method: 'POST',
			body: JSON.stringify({ project }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await response.json();
		if (res.success) {
			notifications.add({
				type: 'success',
				message: 'Project Idea saved.'
			});
		}
	}

	let parsedOutput = $state([]);

	$effect(() => {
		if (output) {
			try {
				parsedOutput = JSON.parse(output);
			} catch (e) {
				model = models[Math.floor(Math.random() * models.length)];
			}
		}
	});
</script>

<Seo
	title="AI Project Generator"
	desc="Generate custom project ideas tailored to your interests and study level with our AI-powered project generator."
/>

<div class="min-h-screen bg-gray-50" transition:fly>
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-4">
					<div>
						<h1 class="text-2xl font-bold text-gray-900">AI Project Generator</h1>
						<div class="mt-1 flex items-center gap-2">
							<span class="text-sm text-gray-600">Powered by</span>
							<span class="rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
								{model}
							</span>
						</div>
					</div>
				</div>
				<div class="flex items-center gap-3">
					<button
						onclick={handleSubmit}
						class="btn btn-primary inline-flex items-center gap-2"
						disabled={isLoading}
					>
						{#if isLoading}
							<div class=" loading loading-spinner loading-sm text-white"></div>
							Generating...
						{:else}
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							Generate Ideas
						{/if}
					</button>
					<button
						class="btn btn-outline text-black hover:text-black"
						onclick={() => optionsModal.show()}
					>
						<Settings class="h-4 w-4" />
						<span class="">Options</span>
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if isLoading && !parsedOutput.length}
			<div class="flex flex-col items-center justify-center py-12">
				<div
					class="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
				></div>
				<p class="text-gray-600">Crafting {options.size} custom project ideas...</p>
			</div>
		{:else if parsedOutput.length > 0}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each parsedOutput as project}
					<article
						class="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
					>
						<div class="p-6">
							<div class="mb-4 flex items-start justify-between">
								<h3 class="text-lg font-semibold text-gray-900">{project.title}</h3>
								{#if project.domain}
									<span
										class="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800"
									>
										{project.domain}
									</span>
								{/if}
							</div>

							<p class="mb-4 text-sm leading-relaxed text-gray-600">{project.full_description}</p>

							{#if project.technologies?.length}
								<div class="border-t pt-4">
									<h4 class="mb-3 text-sm font-medium text-gray-900">Tech Stack</h4>
									<div class="flex flex-wrap gap-2">
										{#each project.technologies as tech}
											<span
												class="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium ring-1 ring-gray-200 ring-inset"
											>
												{tech}
											</span>
										{/each}
									</div>
								</div>
							{/if}
							{#if currentUser.data}
								<button onclick={() => handleSave(project)} class="btn btn-primary my-5 w-full"
									>Save</button
								>
							{:else}
								<a href="/login" class="btn btn-primary my-5 w-full">
									<LogIn /> Login to save projects</a
								>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="rounded-xl bg-white p-8 text-center shadow-sm">
				<div class="mx-auto max-w-md space-y-4">
					<div class="text-indigo-600">
						<svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-medium text-gray-900">No projects generated yet</h3>
					<p class="text-sm text-gray-600">
						Click the generate button to create custom project ideas based on your preferences.
					</p>
				</div>
			</div>
		{/if}
	</main>

	<!-- Options Modal -->
	<dialog id="optionsModal" class="modal modal-bottom sm:modal-middle">
		<div class="modal-box max-w-2xl text-white">
			<h3 class="mb-6 text-2xl font-bold">Generation Settings</h3>
			<div class="space-y-6">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<label class="block">
						<span class="mb-2 block text-sm font-medium">Number of Projects</span>
						<input
							type="number"
							min="1"
							max="5"
							bind:value={options.size}
							class="input input-bordered w-full"
						/>
					</label>
					<label class="block">
						<span class="mb-2 block text-sm font-medium">Model</span>
						<select bind:value={model} class="select select-bordered w-full">
							{#each models as mdl}
								<option value={mdl}>{mdl}</option>
							{/each}
						</select>
					</label>
				</div>

				<div class="space-y-4">
					<label class="block">
						<span class="mb-2 block text-sm font-medium">Description</span>
						<textarea
							bind:value={options.interests}
							class="textarea textarea-bordered w-full"
							placeholder="Give infomation, describe your interests, e.g., AI, web development, etc."
						></textarea>
					</label>
				</div>
			</div>

			<div class="modal-action">
				<form method="dialog">
					<button class="btn">Close</button>
					<button class="btn btn-primary ml-3" onclick={handleSubmit}>Apply & Regenerate</button>
				</form>
			</div>
		</div>
	</dialog>
</div>
