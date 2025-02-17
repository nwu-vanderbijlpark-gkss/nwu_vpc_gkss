<script>
	import { LogIn, X } from 'lucide-svelte';
	import { SendHorizontal,PlusCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import MarkDown from '../../../components/MarkDown.svelte';
	import Loading from '../../../components/Loading.svelte';
	import Project from '../../../components/Project.svelte';

	let { data } = $props();
	let form = $state({ name: '', description: '', link: '' });
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
	onMount(() => {});

	let website = $state();
</script>

<title>Tools & Projects | NWU Vaal GKSS</title>

<div class="flex h-screen flex-col">
	<!-- Header -->
	<header class="border-b bg-gray-50 px-4 py-6">
		<div class="mx-auto flex max-w-4xl justify-between">
			<span>
				<h1 class="text-2xl font-bold tracking-tight text-primary md:text-3xl">Tools & Projects</h1>
				<p class="mt-1 text-sm text-gray-600">
					Discover and share open source AI tools with the community
				</p>
			</span>

			<button onclick={() => submitToolModal.show()} class="btn btn-primary text-white">
				<h2 class="text-lg font-semibold flex gap-2 items-center">Submit Project<PlusCircle/>  </h2> 
			</button>
		</div>
	</header>

	<main class="flex-1 bg-gray-50">
		{#if data.isLoggedIn}
			<!-- Logged-in Content -->
			<section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				<ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each projects as project}
						<Project {project}/>
					{/each}
				</ul>
			</section>
		{:else}
			<!-- Guest Content -->
			<div class="mx-auto max-w-md px-4 py-12">
				<div class="rounded-xl border bg-white p-8 text-center shadow-sm">
					<div class="space-y-5">
						<div class="bg-primary-100 mx-auto w-max rounded-full p-4">
							<LogIn class="h-8 w-8 text-primary" />
						</div>
						<div class="space-y-2">
							<h2 class="text-xl font-semibold text-gray-900">Join Our Developer Community</h2>
							<p class="text-gray-600">
								Sign in to access AI tools repository and contribute your own
							</p>
						</div>
						<a
							href="/login"
							class="hover:bg-primary-dark inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-white transition-all"
						>
							<LogIn class="h-5 w-5" />
							Continue with Login
						</a>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
<!-- Add tool Modal-->
<dialog id="submitToolModal" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Submit tool/Project</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn"><X />Close</button>
				</form>
			</div>
		</div>
		{#if data.isLoggedIn && !isLoading}
			<form method="post" onsubmit={handleSubmit} class="flex w-full flex-col gap-5">
				<label class="form-control w-full">
					<p>Name</p>
					<input
						type="text"
						placeholder="The name of the tool"
						class="input input-bordered"
						name="name"
						bind:value={form.name}
					/>
				</label>
				<label class="form-control w-full">
					<p>Link to tool</p>
					<input
						type="url"
						bind:value={form.link}
						placeholder="https://"
						class="input input-bordered"
						name="link"
					/>
				</label>
				<label class="form-control w-full">
					<p>Description</p>
					<textarea
						class="textarea textarea-bordered"
						name="description"
						id="description"
						placeholder="Add the tool's description"
						required
						bind:value={form.description}
					></textarea>
				</label>
				<button type="submit" class="btn btn-primary text-white">Submit</button>
			</form>
		{:else if isLoading}
			<Loading />
		{:else}
			<p class="py-4 text-sm">You need to login to be able to submit a tool</p>
			<a href="/login" class="btn btn-primary w-full text-white">Login here</a>
		{/if}
	</div>
</dialog>
