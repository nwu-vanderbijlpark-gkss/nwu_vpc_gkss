<script>
	import {
		ArrowUpRightFromSquare,
		ChartNoAxesColumnIcon,
		MessageSquare,
		PlusCircle,
		Star,
		ThumbsUp,
		Trophy
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import Project from '../../../components/Project.svelte';
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
			>Submit Project <PlusCircle /></button
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
				<Project {project} />
			{/each}
		</div>
	</div>
</div>
