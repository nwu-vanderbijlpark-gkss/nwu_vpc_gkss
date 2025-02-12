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
	import MemberCard from '../../../components/MemberCard.svelte';
	import Loading from '../../../components/Loading.svelte';

	let text = $state('');
	let isLoading = $state(false);
	let results = $state([]); //topic results array
	let project_results = $state([]); //project results array
	let member_results = $state([]); //members results array
	let filter = $state('none'); //filter, can be none, projects, topics or members
	let fav_id = $state([]);
	const setFavId = () => {
		let fav = localStorage.getItem('fav_ids');
		if (fav) {
			fav_id = JSON.parse(fav);
		}
	};

	const setFilter = (text) => (filter = text);
	onMount(() => {
		setFavId();
	});
	let { data } = $props();
	const handleSearch = (event) => {
		//clear all the result arrays
		isLoading = true;
		results = [];
		project_results = [];
		member_results = [];
		if (text.length < 3 && text.length > 0) return 'searching...';
		text = text.toLowerCase();
		let textTokens = text.split(/\s+/);

		/**Helper method for finding the text within given data string*/
		const isFound = (data) => {
			let found = false;
			for (let i = 0; i < textTokens.length; i++) {
				if (data) {
					if (data.toLowerCase().includes(textTokens[i])) {
						found = true;
					}
				}
			}
			return found;
		};

		/**searching in topics*/
		if (filter == 'none' || filter == 'topics') {
			for (let i = 0; i < data.allTopics.length; i++) {
				let post = data.allTopics[i];
				const topicMatch = isFound(post.topic);
				const contentMatch = isFound(post.content);
				const tagsMatch = isFound(post.tags);

				if (topicMatch || contentMatch || tagsMatch) {
					results.push(post); //add the post in the results array
					isLoading = false;
				}
			}
		}

		/**searching in projects*/
		if (filter == 'none' || filter == 'projects') {
			for (const project of data.projects) {
				const nameMatch = isFound(project.name);
				const linkMatch = isFound(project.link);
				const descriptionMatch = isFound(project.description);
				const technologiesMatch = isFound(project.technologies);
				if (nameMatch || linkMatch || descriptionMatch || technologiesMatch) {
					project_results.push(project);
					isLoading = false;
				}
			}
		}
		/**searching in members*/
		if (filter == 'none' || filter == 'members') {
			for (const member of data.members) {
				const nameMatch = isFound(member.name + ' ' + member.surname);
				const usernameMatch = isFound(member.username);
				const qualificationMatch = isFound(member.qualification);
				const interestsMatch = isFound(member.interests);

				if (nameMatch || usernameMatch || qualificationMatch || interestsMatch) {
					member_results.push(member);
					isLoading = false;
				}
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
	// function to handle multiple terms
	function highlightText(fullText, match) {
		if (!match) return fullText;

		// Split the match variable into individual words or phrases
		const terms = match.split(/\s+/); // Split by spaces or other delimiters

		// Create a regex to match all terms
		const regex = new RegExp(`(${terms.join('|')})`, 'gi');

		// Highlight matching terms in the full text
		return fullText
			.split(regex)
			.map((part) =>
				terms.some((term) => part.toLowerCase() === term.toLowerCase())
					? `<span class="bg-primary/30">${part}</span>`
					: part
			)
			.join('');
	}
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
				onkeyup={() => handleSearch()}
				type="search"
				placeholder="Search here..."
			/>
			<button class="btn btn-ghost"><Search /></button>
		</form>
	</section>

	{#if isLoading}
		<Loading />
	{/if}
	{#if results.length > 0 || project_results.length > 0 || member_results.length > 0}
		<div class="bg-white p-2">
			<p class="text-sm text-info">
				{results.length + project_results.length + member_results.length} results found
			</p>
			<div class="flex gap-3 p-2">
				{#each [{ show: 'none', text: 'All' }, { show: 'projects', text: 'Projects' }, { show: 'topics', text: 'Topics' }, { show: 'members', text: 'Members' }] as filterBtn}
					<button
						class={'btn btn-sm ' +
							`${filter == filterBtn.show ? 'btn-primary border border-red-200' : 'btn-ghost bg-gray-200'}`}
						onclick={() => setFilter(filterBtn.show)}>{filterBtn.text}</button
					>
				{/each}
			</div>
		</div>

		<div class="max-h-[80vh] divide-y overflow-auto">
			{#if member_results.length > 0 && (filter == 'none' || filter == 'members')}
				<h2 class="py-3 text-lg">Members</h2>
				<div transition:slide class="flex w-full flex-col gap-2 p-2 lg:flex-row lg:flex-wrap">
					{#each member_results as member}
						<MemberCard {member} {text} {highlightText} />
					{/each}
				</div>
			{/if}
			{#if results.length > 0 && (filter == 'none' || filter == 'topics')}
				<h2 class="py-3 text-lg">Topics</h2>
				{#each results as topic}
					<Topic {topic} {text} {highlightText} />
				{/each}
			{/if}
			{#if project_results.length > 0 && (filter == 'none' || filter == 'projects')}
				<h2 class="py-3 text-lg">Projects</h2>
				<div transition:slide class="flex w-full flex-col gap-2 p-2 lg:flex-row lg:flex-wrap">
					{#each project_results as project}
						<Project {project} {text} {highlightText} />
					{/each}
				</div>
			{/if}
		</div>
	{:else if text.length > 3}
		<p>No results for: {text}</p>
	{:else}
		<p>Start typing your search query</p>
	{/if}
</div>
