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
<div class="h-full w-full space-y-4 p-4" transition:slide>
	<div class="flex w-full items-center justify-between rounded-xl bg-white p-4 shadow-md">
		<div>
			<h1 class="text-2xl font-bold">ProjectSpace</h1>
			<p class="text-sm text-gray-600">Discover and collaborate on amazing projects</p>
		</div>
		<button
			onclick={() => projectSpaceModal.showModal()}
			class="btn btn-primary flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
		>
			Submit Project <PlusCircle />
		</button>
	</div>

	<div class="max-h-[90svh] space-y-4 overflow-auto">
		<a
			href="/community/leaderboard#projects"
			class="flex items-center gap-4 rounded-lg border border-gray-300 bg-gradient-to-br from-black to-red-400 p-5 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-2xl"
		>
			<ChartNoAxesColumnIcon size="40px" />
			<div>
				<h1 class="text-xl font-bold">Rankings</h1>
				<p class="text-sm">Click to view</p>
			</div>
		</a>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each data.projects as project}
				<Project {project} />
			{/each}
		</div>
	</div>
</div>
