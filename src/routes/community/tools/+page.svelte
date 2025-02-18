<script>
	import { LogIn, X } from 'lucide-svelte';
	import { SendHorizontal, PlusCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import MarkDown from '../../../components/MarkDown.svelte';
	import Loading from '../../../components/Loading.svelte';
	import Project from '../../../components/Project.svelte';

	let { data } = $props();
	let form = $state({ name: '', description: '', link: '', type: 'Tool' });
	let projects = $state(data.projects);
	let isLoading = $state(false);
	let responses = $state(data.chat ? JSON.parse(data.chat) : []); //read the past messages or initialize an empty chat
	const models = [
		'deepseek-r1-distill-llama-70b',
		'deepseek-r1-distill-qwen-32b',
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
	let model = $state(models[0]);
	async function handleSubmit(e) {
		e.preventDefault();
		isLoading = true;

		if (form.name.length > 0 && form.link.length > 0 && form.description.length > 0) {
			const response = await fetch('/community/tools/addTool', {
				method: 'POST',
				body: JSON.stringify({ form }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const result = await response.json();
			projects = result.projects;
			isLoading = false;
			submitToolModal.close();
		}
	}
	// Tab management
	let tab = $state('all');
	const handleHashChange = () => {
		const validTabs = ['all', 'projects', 'tools'];
		const newTab = location.hash.replace('#', '');
		tab = validTabs.includes(newTab) ? newTab : 'all';
	};

	onMount(() => {
		window.addEventListener('hashchange', handleHashChange);
		handleHashChange();
		isLoading = false;
		return () => window.removeEventListener('hashchange', handleHashChange);
	});

	let website = $state();
</script>

<title>Tools & Projects | NWU Vaal GKSS</title>
<div class="flex h-screen flex-col">
	<!-- Header - Adjusted for mobile stacking -->
	<header class="border-b bg-gray-50 px-4 py-4 sm:py-6">
		<div class="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:justify-between">
			<div class="flex-1">
				<h1 class="text-xl font-bold tracking-tight text-primary sm:text-2xl md:text-3xl">
					Tools & Projects
				</h1>
				<p class="mt-1 text-sm text-gray-600">
					Discover and share open source tools and showcase projects.
				</p>
			</div>

			<div class="flex items-center justify-between gap-4">
				<nav aria-label="Tool categories" class="flex flex-wrap gap-2">
					{#each [{ id: 'all', label: 'All' }, { id: 'projects', label: 'Projects' }, { id: 'tools', label: 'Tools' }] as btn}
						<a
							href="#{btn.id}"
							class="rounded px-2 py-1 text-sm sm:px-3 sm:text-base"
							class:bg-primary={tab === btn.id}
							class:text-white={tab === btn.id}
							class:bg-gray-100={tab !== btn.id}
							class:text-gray-700={tab !== btn.id}
							aria-current={tab === btn.id ? 'page' : undefined}
						>
							{btn.label}
						</a>
					{/each}
				</nav>
				<button onclick={() => submitToolModal.show()} class="btn btn-primary text-white sm:btn-md">
					<span class="flex items-center gap-1 sm:gap-2">
						<span class="">Submit Project</span>
						<PlusCircle class="h-4 w-4 sm:h-5 sm:w-5" />
					</span>
				</button>
			</div>
		</div>
	</header>

	<main class="flex-1 bg-gray-50">
		{#if data.isLoggedIn}
			<!-- Grid adjusted for mobile -->
			<section class="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
				<ul role="list" class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
					{#each projects as project}
						{#if tab === 'all' || tab.includes(project.type.toLowerCase())}
							<Project {project} />
						{/if}
					{/each}
				</ul>
			</section>
		{:else}
			<!-- Guest content optimized for mobile -->
			<div class="mx-auto max-w-md px-4 py-8 sm:py-12">
				<div class="rounded-xl border bg-white p-6 text-center shadow-sm sm:p-8">
					<div class="space-y-4 sm:space-y-5">
						<div class="bg-primary-100 mx-auto w-max rounded-full p-3 sm:p-4">
							<LogIn class="h-6 w-6 text-primary sm:h-8 sm:w-8" />
						</div>
						<div class="space-y-2">
							<h2 class="text-lg font-semibold text-gray-900 sm:text-xl">
								Join Our Developer Community
							</h2>
							<p class="text-sm text-gray-600 sm:text-base">
								Sign in to access AI tools repository and contribute your own
							</p>
						</div>
						<a
							href="/login"
							class="hover:bg-primary-dark inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition-all sm:py-3"
						>
							<LogIn class="h-4 w-4 sm:h-5 sm:w-5" />
							Continue with Login
						</a>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<!-- Modal adjustments for mobile -->
<dialog id="submitToolModal" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box max-h-[90vh] overflow-y-auto text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold">Submit tool/Project</p>
			<form method="dialog">
				<button class="btn btn-circle btn-ghost btn-sm"><X class="h-4 w-4" /></button>
			</form>
		</div>
		{#if data.isLoggedIn && !isLoading}
			<form method="post" onsubmit={handleSubmit} class="flex w-full flex-col gap-3 sm:gap-4">
				<label class="form-control w-full">
					<p class="text-sm sm:text-base">Name</p>
					<input
						type="text"
						placeholder="Tool name"
						class="input input-sm input-bordered sm:input-md"
						name="name"
						bind:value={form.name}
					/>
				</label>
				<label class="form-control w-full">
					<p class="text-sm sm:text-base">Link</p>
					<input
						type="url"
						bind:value={form.link}
						placeholder="Website link, Github repo link, etc."
						class="input input-sm input-bordered sm:input-md"
						name="link"
					/>
				</label>
				<label class="form-control w-full">
					<p class="text-sm sm:text-base">Type</p>
					<select
						class="select select-bordered select-sm sm:select-md"
						name="type"
						placeholder="Project or Tool"
						bind:value={form.type}
					>
						<option value="Project">Project</option>
						<option value="Tool">Tool</option>
					</select>
				</label>
				<label class="form-control w-full">
					<p class="text-sm sm:text-base">Description</p>
					<textarea
						class="textarea textarea-bordered textarea-sm sm:textarea-md"
						name="description"
						placeholder="Description"
						required
						bind:value={form.description}
					></textarea>
				</label>
				<button type="submit" class="btn btn-primary btn-sm text-white sm:btn-md">Submit</button>
			</form>
		{:else if isLoading}
			<Loading />
		{:else}
			<p class="py-4 text-sm">You need to login to submit a tool</p>
			<a href="/login" class="btn btn-primary btn-sm w-full text-white sm:btn-md">Login</a>
		{/if}
	</div>
</dialog>
