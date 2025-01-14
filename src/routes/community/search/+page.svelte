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

	let text = $state('');
	let results = $state([]); //results array
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
			<a class="btn btn-ghost rounded-full" href="/community"><ArrowLeft /></a>
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
				<div class="bg-white p-2 hover:bg-gray-50">
					<div class="flex items-center justify-between text-sm">
						<span class="flex">
							<div class="mr-2 h-[25px] w-[25px] overflow-hidden rounded-full">
								<img class="object-fit" src={topic.Member.image} alt={topic.Member.username} />
							</div>
							<a class="link-hover" href={`/community/${topic.Member.username}`}
								>{topic.Member.username}</a
							>
							<Dot />
							<p class="text-gray-400">{moment(topic.created_at).calendar()}</p></span
						>
						<button class="btn btn-ghost" onclick={() => handleFavorite(topic)}>
							{#if fav_id.includes(topic.id)}
								<Star fill="red" color="red" />
							{:else}
								<Star />
							{/if}
						</button>
					</div>
					<a href={`/community/topic/${topic.id}`}>
						<h3 class="text-xl font-bold">{@html highlightText(topic.topic, text)}</h3>
						<p class="mt-2 text-sm text-gray-800">
							{@html highlightText(topic.content, text)}
						</p>
					</a>
					<div class="mt-5 text-xs">
						<div
							class="tooltip"
							data-tip={`${topic.topic_views.length} view${topic.topic_views.length == 1 ? '' : 's'}`}
						>
							<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
								><ChartNoAxesColumn size="20px" />
								<p>{topic.topic_views.length}</p></button
							>
						</div>
						<a
							onclick={() => commentModal.show()}
							href={`/community/topic/${topic.id}`}
							class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
							><MessageCircleMore size="20px" />
							<p>{topic.Comment.length}</p></a
						>
						<button
							onclick={() => shareTopic(topic.topic, `${location.href}/${topic.topic}/${topic.id}`)}
							class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
							><Share2 size="20px" />
							<p>Share</p></button
						>
					</div>
				</div>
			{/each}
		</div>
	{:else if text.length > 0}
		<p>No results for: {text}</p>
	{:else}
		<p>Start typing your search query</p>
	{/if}
</div>
