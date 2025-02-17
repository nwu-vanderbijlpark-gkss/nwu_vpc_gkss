<script>
	import { onMount } from 'svelte';
	import NotFoundPage from '../../../../components/NotFoundPage.svelte';

	let { data } = $props();
	let notFound = $state(false);
	let project = $state();
	onMount(() => {
		const id = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
		project = data.projects.filter((project) => project.id == id)[0];
		if (!project) {
			notFound = true;
		}
	});
</script>

{#if !project}
	{#if notFound}
		<NotFoundPage
			title="Project not found"
			homeUrl="/community"
			message="Sorry, this project does not exist, it might have been deleted by its owner."
		/>
	{:else}
		<div class="flex min-h-[50vh] flex-col items-center justify-center" transition:fade>
			<div class="loading loading-spinner loading-lg text-primary"></div>
			<p class="mt-4 text-lg font-medium">Loading project...</p>
		</div>
	{/if}
{:else}
	<title>{project.name} | NWU Vaal GKSS</title>
	<iframe
		src={project.link.includes('http') ? project.link : `https://${project.link}`}
		title={project.name}
		width="100%"
		height="600"
		style="border:none;"
	></iframe>
{/if}
