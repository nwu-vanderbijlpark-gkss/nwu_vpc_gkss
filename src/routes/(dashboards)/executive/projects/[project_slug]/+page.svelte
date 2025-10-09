<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import CheckListTool from '$lib/components/executive/CheckListTool.svelte';
	import ResourcesTool from '$lib/components/executive/ResourcesTool.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { ArrowLeft, CloudUpload, ListChecks, Presentation } from 'lucide-svelte';

	const projects = [
		{
			name: 'General 25',
			slug: 'general',
			description: 'The main project, daily project',
			is_complete: false,
			deadline: '31 Nov 2025',
			member: {
				name: 'Lethabo Maepa',
				email: 'lethabomaepa11@gmail.com'
			}
		},
		{
			name: 'Internal Hackathon 25',
			slug: 'internal-hackathon25',
			description: 'The internal hackathon project',
			is_complete: true,
			deadline: '22 Aug 2025',
			member: {
				name: 'Moses Motsoenyane',
				email: 'tevez11moses@gmail.com'
			}
		}
	];
	function getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		let r, g, b, luminance;

		do {
			color = '#';
			for (let i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}

			// Convert hex to RGB
			r = parseInt(color.slice(1, 3), 16);
			g = parseInt(color.slice(3, 5), 16);
			b = parseInt(color.slice(5, 7), 16);

			// Calculate luminance
			luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

			// Keep looping until we get a dark color (luminance threshold can be adjusted)
		} while (luminance > 128); // 0-255 scale, lower is darker

		return color;
	}

	const tools = [
		{
			name: 'Checklist',
			id: 'checklist',
			color: getRandomColor(),
			icon: ListChecks,
			view: CheckListTool
		},
		{
			name: 'Resources',
			id: 'resources',
			color: getRandomColor(),
			icon: CloudUpload,
			view: ResourcesTool
		}
	];
	const getToolData = async (tool_id) => {
		const req = await fetch(`/api/project?proj=${project.slug}&tool=${tool_id}`, {
			method: 'GET'
		});
		const res = await req.json();
		if (res.success) {
			//announcements = res.data;
		} else {
			//error
		}
	};

	const project = $state(projects.filter((proj) => proj.slug == $page.params.project_slug)[0]);
	let pageState = $state({
		isLoading: false,
		view: null //if null then show the home page
	});

	afterNavigate(({ from, to }) => {
		pageState.isLoading = true;
		const id = to.url.searchParams.get('tool') || null;
		if (id) {
			pageState.view = tools.find((tool) => tool.id == id).view;

			//getToolData(id);
		} else {
			//pass
			pageState.view = null;
		}
		pageState.isLoading = false;
	});
</script>

<div class="w-full space-y-4 p-4 text-black">
	<div class="flex items-center justify-between">
		<h1 class="flex items-center text-xl font-bold">
			<button type="button" class="btn btn-ghost m-0" onclick={() => history.back()}
				><ArrowLeft /></button
			>
			{project.name}
		</h1>
		<p class="{project.is_complete ? 'text-success' : 'text-yellow-600'} text-sm">
			{project.is_complete ? 'Completed' : 'Mark as complete'}
		</p>
	</div>

	<p>{project.description}</p>

	{#if pageState.isLoading}
		<div class="flex w-full items-center justify-center text-black">
			<Loading text="  " />
		</div>
	{:else if !pageState.view}
		<h2 class="text-md font-bold">Tools for this Project</h2>
		<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
			{#each tools as tool}
				<a
					href={$page.url.pathname + '?tool=' + tool.id}
					style="background: {tool.color}"
					class=" flex w-full flex-col items-center justify-center rounded-2xl p-5 text-white shadow-xl hover:opacity-50"
				>
					<tool.icon />
					{tool.name}
				</a>
			{/each}
		</div>
	{:else}
		<pageState.view />
	{/if}
</div>
