<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { getRandomColor } from '$lib';
	import CheckListTool from '$lib/components/executive/CheckListTool.svelte';
	import ResourcesTool from '$lib/components/executive/ResourcesTool.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import TrixDisplay from '$lib/components/TrixDisplay.svelte';
	import TrixEditor from '$lib/components/TrixEditor.svelte';
	import { ArrowLeft, CloudUpload, ListChecks, NotebookText, Presentation } from 'lucide-svelte';

	let { data } = $props();
	const { meeting } = data;

	const tools = [
		{
			name: 'Agenda',
			id: 'agenda',
			color: getRandomColor(),
			icon: ListChecks,
			view: CheckListTool
		},
		{
			name: 'Minutes',
			id: 'minutes',
			color: getRandomColor(),
			icon: NotebookText,
			view: ResourcesTool
		}
	];

	const getToolData = async (tool_id) => {
		const req = await fetch(`/api/ex/meeting?meeting=${meeting.id}&tool=${tool_id}`, {
			method: 'GET'
		});
		const res = await req.json();
		if (res.success) {
			//announcements = res.data;
			pageState.toolData = res.data[0];
			if (pageState.toolData) pageState.editorValue = res.data[0].content;
		} else {
			//error
		}
		pageState.isLoading = false;
	};
	const updateToolData = async (e) => {
		e.preventDefault();
		pageState.isLoading = true;
		const req = await fetch(
			`/api/ex/meeting?meeting=${meeting.id}&tool=${pageState.view.id}&toolId=${pageState.toolData?.id || 1}`,
			{
				method: 'POST',
				body: JSON.stringify({ data: { content: pageState.editorValue } })
			}
		);
		const res = await req.json();
		if (res.success) {
			//announcements = res.data;
			pageState.toolData = res.data[0];
			pageState.editView = false;
		} else {
			//error
		}
		pageState.isLoading = false;
	};

	let pageState = $state({
		isLoading: false,
		view: null, //if null then show the home page
		editView: false,
		toolData: null,
		editorValue: '<p>Add your content here</p>',
		clear: () => {
			pageState.toolData = null;
			pageState.view = null;
			pageState.editorValue = '<p>Add your content here</p>';
		}
	});
	const toggleEditView = () => {
		//use the current page state view.
		pageState.editView = !pageState.editView;
	};

	afterNavigate(async ({ from, to }) => {
		pageState.clear();
		pageState.isLoading = true;
		const id = to.url.searchParams.get('tool') || null;
		if (id) {
			pageState.view = tools.find((tool) => tool.id == id);
			await getToolData(id);
			pageState.isLoading = false;

			//getToolData(id);
		} else {
			//pass
			pageState.view = null;
			pageState.isLoading = false;
		}
	});
</script>

<div class="w-full space-y-4 overflow-auto p-5 text-black lg:max-h-[90svh]">
	<div class="flex items-center justify-between">
		<h1 class="flex items-center text-xl font-bold">
			<button type="button" class="btn btn-ghost m-0" onclick={() => history.back()}
				><ArrowLeft /></button
			>
			{meeting.name}
		</h1>
	</div>

	<p>{meeting.date}</p>

	<div class="flex items-center justify-between">
		<h2 class="text-md font-bold">
			Meeting {pageState.view ? pageState.view.name : 'Tools'}
		</h2>
		{#if pageState.view}
			<button class="btn btn-primary" onclick={toggleEditView}
				>{pageState.editView ? 'View' : 'Edit'}</button
			>
		{/if}
	</div>

	{#if pageState.isLoading}
		<div class="flex w-full items-center justify-center text-black">
			<Loading text="  " />
		</div>
	{:else if !pageState.view}
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
	{:else if pageState.editView}
		<form method="POST" onsubmit={updateToolData} class="flex flex-col gap-4 bg-white p-4">
			<TrixEditor id="{meeting.id}-{pageState.view.id}" bind:value={pageState.editorValue} />
			<button type="submit" class="btn btn-primary">Submit Changes</button>
		</form>
	{:else}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="w-full bg-white" ondblclick={toggleEditView}>
			<TrixDisplay content={pageState.editorValue} />
		</div>
	{/if}
</div>
