<script>
	import { onMount } from 'svelte';
	import NotFoundPage from '../../../../components/NotFoundPage.svelte';
	import { ArrowLeft, ArrowUpRightFromSquare, Eye } from 'lucide-svelte';

	let { data } = $props();
	let notFound = $state(false);
	let project = $state(data.project);
	onMount(() => {});
</script>

{#if !project}
	{#if notFound}
		<NotFoundPage
			title="project not found"
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
	<div class="mockup-browser mb-20 border border-base-300">
		<div class="mockup-browser-toolbar">
			<button
				onclick={() => history.back()}
				class="btn btn-circle btn-ghost btn-sm hover:bg-gray-100"
			>
				<ArrowLeft size={20} />
			</button>
			<div class="input border border-base-300 bg-gray-200 text-red-500">
				{project.link.includes('http') ? project.link : `https://${project.link}`}
			</div>
		</div>
		<div class="flex flex-col justify-center border-t border-base-300">
			<div class="flex justify-between p-2">
				<span
					class="tooltip tooltip-right flex cursor-pointer items-center gap-2"
					data-tip={`Number of people who viewed this ${project.type}`}
					><Eye />{project.project_views.length} view{project.project_views.length > 1
						? 's'
						: ''}</span
				>
				<a
					target="_blank"
					href={project.link.includes('http') ? project.link : `https://${project.link}`}
					class="btn btn-primary m-2">Visit this {project.type} <ArrowUpRightFromSquare /></a
				>
			</div>
			<iframe
				src={project.link.includes('http') ? project.link : `https://${project.link}`}
				title={project.name}
				width="100%"
				height="600"
			></iframe>
		</div>
	</div>
{/if}
