<script>
	import {
		ArrowLeft,
		ChartNoAxesColumn,
		Dot,
		Forward,
		MessageCircleMore,
		Search,
		Share2,
		Star,
		StarOff
	} from 'lucide-svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Topic from '../../../components/Topic.svelte';
	import Project from '../../../components/Project.svelte';

	let text = $state('');
	let results = $state([]); //results array
	let project_results = $state([]);
	let fav_id = $state([]);
	const setFavId = () => {
		let fav = localStorage.getItem('fav_ids');
		if (fav) {
			fav_id = JSON.parse(fav);
		}
	};

	onMount(() => {
		setFavId();
	});
	let { data } = $props();
	const handleSearch = (event) => {
		results = [];
		project_results = [];
		text = text.toLowerCase();
		let textTokens = text.split(/\s+/);

		const isFound = (data) => {
			let found = false;
			for (let i = 0; i < textTokens.length; i++) {
				if (data.toLowerCase().includes(textTokens[i])) {
					found = true;
				}
			}
			return found;
		};
		for (let i = 0; i < data.allTopics.length; i++) {
			let post = data.allTopics[i];
			const topicMatch = isFound(post.topic);
			const contentMatch = isFound(post.content);
			const tagsMatch = isFound(post.tags);

			if (topicMatch || contentMatch || tagsMatch) {
				results.push(post); //add the post in the results array
			}
		}
		for (const project of data.projects) {
			const nameMatch = isFound(project.name);
			const linkMatch = isFound(project.link);
			const descriptionMatch = isFound(project.description);
			const technologiesMatch = isFound(project.technologies);
			if (nameMatch || linkMatch || descriptionMatch || technologiesMatch) {
				project_results.push(project);
			}
		}
	};

	const handleFavorite = (topic) => {
		//have 2 stores in localstorage
		//fav: holds the complete info of the topics and fav_ids holds only the ids of the topic for quick operations
		//get the favorites item in localstorage
		let favorites = JSON.parse(localStorage.getItem('fav'));
		let fav_ids = [];
		if (favorites) {
			let exists = false;
			let newArray = [];
			for (let i = 0; i < favorites.length; i++) {
				let favorite = favorites[i];
				if (favorite.id == $state.snapshot(topic).id) {
					//item exists in the array, skip it
					exists = true;
				} else {
					//push the item into the new array
					newArray.push(favorite);
					fav_ids.push(favorite.id);
				}
			}
			if (!exists) {
				//the topic does not exist, push to the array
				newArray.push($state.snapshot(topic));
				fav_ids.push($state.snapshot(topic).id);
			}
			//update the favorites item in localstorage
			localStorage.setItem('fav', JSON.stringify(newArray));
			localStorage.setItem('fav_ids', JSON.stringify(fav_ids));
		} else {
			//the favorites item in localstorage does not exist, set a new one
			localStorage.setItem('fav', JSON.stringify([$state.snapshot(topic)]));
			localStorage.setItem('fav_ids', JSON.stringify([$state.snapshot(topic).id]));
		}
		setFavId();
	};
</script>

<title>Search {text} | NWU Vaal GKSS</title>
<div class="space-y-1 divide-y" transition:slide>
	<section class="flex w-full items-center gap-3 rounded-lg bg-white p-2">
		<span class="flex items-center">
			<button class="btn btn-ghost rounded-full" onclick={history.back(-1)}><ArrowLeft /></button>
		</span>

		<form onsubmit={() => handleSearch()} class="flex w-full items-center">
			<input
				class="input input-bordered w-full bg-gray-50"
				bind:value={text}
				onkeydown={() => handleSearch()}
				type="search"
				placeholder="Search here..."
			/>
			<button class="btn btn-ghost"><Search /></button>
		</form>
	</section>

	{#if results.length > 0}
		<p class="bg-white p-2 text-sm text-info">{results.length} results found</p>
		<div class="max-h-[80vh] divide-y overflow-auto">
			{#each results as topic}
				<Topic {topic} {text} />
			{/each}
			<h2 class="py-3 text-lg font-bold">Projects</h2>
			{#each project_results as project}
				<Project {project} {text} />
			{/each}
		</div>
	{:else if text.length > 0}
		<p>No results for: {text}</p>
	{:else}
		<p>Start typing your search query</p>
	{/if}
</div>
