<script>
	import { ArrowLeft, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import Topic from '$lib/components/Topic.svelte';
	import MemberCard from '$lib/components/MemberCard.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Opportunity from '$lib/components/Opportunity.svelte';
	import Seo from '$lib/components/SEO.svelte';

	// Using Svelte 5 runes for reactive state
	let text = $state(''); // Search text
	let isLoading = $state(false);
	let results = $state([]);
	let num_results = $state(0);
	let member_results = $state([]);
	let opportunity_results = $state([]);
	let filter = $state('none'); // possible values: 'none', 'topics', 'members'
	let fav_id = $state([]);

	// Set favorite IDs from localStorage
	const setFavId = () => {
		const fav = localStorage.getItem('fav_ids');
		if (fav) {
			fav_id = JSON.parse(fav);
		}
	};

	const setFilter = (val) => {
		filter = val;
		if (val === 'topics') {
			num_results = results.length;
		} else if (val === 'members') {
			num_results = member_results.length;
		} else if (val === 'opportunity') {
			num_results = opportunity_results.length;
		} else {
			num_results = results.length + member_results.length + opportunity_results.length;
		}
	};

	// On mount, check the URL for the search term and set it if present
	onMount(() => {
		setFavId();

		// Get the URL search parameters
		const urlParams = new URLSearchParams(window.location.search);
		const searchTerm = urlParams.get('s');
		if (searchTerm) {
			text = searchTerm; // Set search term from URL
			handleSearch(new Event('submit')); // Perform search immediately
		}
	});

	// Get initial data passed via $props()
	let { data } = $props();

	// Debounce function for input events
	let debounceTimeout = $state();
	function debouncedSearch() {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			// Create a synthetic event to pass to the handler
			handleSearch(new Event('submit'));
		}, 300);
	}

	// Form submission handler – using native "onsubmit"
	function handleSearch(e) {
		// Set the `s` query parameter in the URL
		// Update the query parameter without reloading the page and without adding a new history entry
		history.replaceState(null, '', `?s=${encodeURIComponent(text)}`);
		e.preventDefault();
		isLoading = true;
		results = [];
		member_results = [];

		if (text.length < 1) {
			isLoading = false;
			return;
		}

		const searchTerm = text.toLowerCase();
		const tokens = searchTerm.split(/\s+/).filter(Boolean);

		const isFound = (str) => {
			return str && tokens.some((token) => str.toLowerCase().includes(token));
		};

		if (filter === 'none' || filter === 'topics') {
			results = data.allTopics.filter(
				(post) => isFound(post.topic) || isFound(post.content) || isFound(post.tags)
			);
		}
		if (filter === 'none' || filter === 'members') {
			member_results = data.members.filter(
				(member) =>
					isFound(member.name + ' ' + member.surname) ||
					isFound(member.username) ||
					isFound(member.qualification) ||
					isFound(member.interests)
			);
		}
		if (filter === 'none' || filter === 'opportunity') {
			opportunity_results = data.opportunities.filter(
				(opportunity) =>
					isFound(opportunity.title) ||
					isFound(opportunity.type) ||
					isFound(opportunity.content) ||
					isFound(opportunity.organization)
			);
		}

		isLoading = false;
	}

	// Handler to toggle favorite status
	const handleFavorite = (topic) => {
		let favorites = JSON.parse(localStorage.getItem('fav')) || [];
		let fav_ids = [];
		let exists = false;
		favorites = favorites.filter((fav) => {
			if (fav.id === $state.snapshot(topic).id) {
				exists = true;
				return false;
			}
			fav_ids.push(fav.id);
			return true;
		});
		if (!exists) {
			favorites.push($state.snapshot(topic));
			fav_ids.push($state.snapshot(topic).id);
		}
		localStorage.setItem('fav', JSON.stringify(favorites));
		localStorage.setItem('fav_ids', JSON.stringify(fav_ids));
		setFavId();
	};

	// Highlight matching tokens in text
	function highlightText(fullText, match) {
		if (!match) return fullText;
		const terms = match.split(/\s+/).filter(Boolean);
		const regex = new RegExp(`(${terms.join('|')})`, 'gi');
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

<Seo title="Search" desc="Search topics, members, and opportunities within our community." />

<main transition:fly class="mx-auto max-w-4xl py-6">
	<header class="-mt-5 flex items-center rounded-lg bg-white p-2">
		<button
			class="p-2 text-lg focus:outline-none"
			onclick={() => history.back(-1)}
			aria-label="Go back"
		>
			<ArrowLeft class="h-6 w-6" />
		</button>
		<h1 class="text-xl font-bold sm:text-2xl">Search</h1>
	</header>

	<section class="rounded-lg bg-white p-4">
		<form onsubmit={handleSearch} class="flex items-center" role="search" aria-label="Search form">
			<input
				class="flex-1 rounded border border-gray-300 p-2 focus:border-red-800 focus:ring focus:outline-none"
				bind:value={text}
				oninput={debouncedSearch}
				type="search"
				placeholder="Type to search..."
				aria-label="Search input"
			/>
			<button
				class="text-primary ml-3 p-2 hover:text-red-800 focus:outline-none"
				type="submit"
				aria-label="Submit search"
			>
				<Search class="h-6 w-6" />
			</button>
		</form>
	</section>

	{#if isLoading}
		<section class="flex justify-center">
			<Loading />
		</section>
	{/if}

	<section>
		{#if results.length > 0 || member_results.length > 0 || opportunity_results.length > 0}
			<div class="rounded-lg bg-white p-4">
				<p class="text-sm text-gray-600">
					{num_results} results found
				</p>
				<div class="mt-3 flex flex-wrap gap-2">
					{#each [{ show: 'none', text: 'All' }, { show: 'topics', text: 'Topics' }, { show: 'members', text: 'Members' }, { show: 'opportunity', text: 'Opportunities' }] as btn}
						<button
							class={'cursor-pointer px-3 py-1' +
								(filter === btn.show
									? 'bg-primary text-primary border-primary border-b-2'
									: 'bg-gray-100 text-gray-700')}
							onclick={() => setFilter(btn.show)}
						>
							{btn.text}
						</button>
					{/each}
				</div>
			</div>

			<div class="mt-4 space-y-8">
				{#if member_results.length > 0 && (filter === 'none' || filter === 'members')}
					<section aria-labelledby="members-heading">
						<h2 id="members-heading" class=" pb-2 text-lg font-semibold">Members</h2>
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{#each member_results as member}
								<MemberCard {member} {text} {highlightText} />
							{/each}
						</div>
					</section>
				{/if}

				{#if results.length > 0 && (filter === 'none' || filter === 'topics')}
					<section aria-labelledby="topics-heading">
						<h2 id="topics-heading" class=" pb-2 text-lg font-semibold">Topics</h2>
						<div class="space-y-4">
							{#each results as topic}
								<Topic
									{topic}
									{text}
									{highlightText}
									onclickFavorite={() => handleFavorite(topic)}
								/>
							{/each}
						</div>
					</section>
				{/if}
				{#if opportunity_results.length > 0 && (filter === 'none' || filter === 'opportunity')}
					<section aria-labelledby="Opportunities-heading">
						<h2 id="topics-heading" class=" pb-2 text-lg font-semibold">Opportunities</h2>
						<div class="space-y-4">
							{#each opportunity_results as opportunity}
								<Opportunity {opportunity} {text} showContent={true} />
							{/each}
						</div>
					</section>
				{/if}
			</div>
		{:else if text.length > 3}
			<p class="text-center text-gray-600">No results found for "{text}"</p>
		{:else}
			<p class="text-center text-gray-600">Start typing your search query...</p>
		{/if}
	</section>
</main>
