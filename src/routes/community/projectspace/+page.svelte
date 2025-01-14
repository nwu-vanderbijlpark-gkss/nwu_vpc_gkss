<script>
	import {
		ArrowUpRightFromSquare,
		ChartNoAxesColumnIcon,
		MessageSquare,
		Star,
		ThumbsUp,
		Trophy
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	const fakeArr = [1, 2, 3, 4, 5];
	let { data } = $props();
	let projects = $state(data.projects);
</script>

<title>ProjectSpace | NWU Vaal GKSS</title>
<div class=" h-full w-full space-y-1 divide-y" transition:slide>
	<div class="flex w-full items-center justify-between rounded-lg bg-white p-2">
		<div>
			<h1 class="text-xl font-bold">ProjectSpace</h1>
			<p class="text-sm">Discover and collaborate on amazing projects</p>
		</div>
		<button onclick={() => projectSpaceModal.showModal()} class="btn btn-primary"
			>Submit Project</button
		>
	</div>
	<div class="max-h-[90svh] overflow-auto">
		<a
			href="/community/projectspace/rankings"
			class="flex items-center gap-2 rounded-lg border bg-gradient-to-br from-black to-red-400 p-5 text-white hover:shadow-xl"
		>
			<ChartNoAxesColumnIcon size="40px" />
			<div>
				<h1 class="text-xl font-bold">Rankings</h1>
				<p class="text-sm">Click to view</p>
			</div>
		</a>
		<div class="flex flex-col items-center justify-center gap-3 p-2 lg:grid lg:grid-cols-2">
			{#each projects as project}
				<div class="card w-full space-y-2 border p-5 lg:w-[400px]">
					<div class="flex w-full items-center justify-between rounded-lg bg-white p-2">
						<div>
							<h1 class="text-lg font-bold">{project.name}</h1>
							<a href={`/community/${project.Member.username}`} class="link-hover text-sm"
								>by {project.Member.username}</a
							>
						</div>
						<p class="flex font-bold"><Star color="gold" fill="gold" />4.5</p>
					</div>
					<div class="flex h-[200px] w-full items-center justify-center">
						<img src={project.image} alt="project" class="h-full w-full rounded-lg" />
					</div>
					<p class="text-gray-600">{project.description}</p>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<button class="btn btn-ghost bg-gray-200"><ThumbsUp /> Rate</button>
							<button class="btn btn-ghost bg-gray-200"><MessageSquare /> Comment</button>
						</div>
						<a
							href={project.link.includes('http') ? project.link : `https://${project.link}`}
							class="btn btn-ghost border"><ArrowUpRightFromSquare /> View</a
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
