<script>
	import {
		ChartNoAxesColumn,
		Eye,
		Dot,
		MessageCircleMore,
		Share2,
		Star,
		Trash
	} from 'lucide-svelte';

	let { topic, text, myProfile, deleteTopic, index } = $props();
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	let fav_id = $state([]);
	const setFavId = () => {
		let fav = localStorage.getItem('fav_ids');
		if (fav) {
			fav_id = JSON.parse(fav);
		}
	};
	onMount(() => {
		//when the document is mounted on the browser, get the fav_ids item in localstorage
		setFavId();
	});
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
				if (favorite.id == topic.id) {
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
				newArray.push(topic);
				fav_ids.push(topic.id);
			}
			//update the favorites item in localstorage
			localStorage.setItem('fav', JSON.stringify(newArray));
			localStorage.setItem('fav_ids', JSON.stringify(fav_ids));
		} else {
			//the favorites item in localstorage does not exist, set a new one
			localStorage.setItem('fav', JSON.stringify([topic]));
			localStorage.setItem('fav_ids', JSON.stringify([topic.id]));
		}
		setFavId();
	};
	// Web Share API function
	export const shareTopic = async (topicTitle, url) => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: topicTitle,
					text: `Check out this topic: ${topicTitle}`,
					url: url
				});
			} catch (error) {
				console.error('Error sharing the topic:', error);
			}
		} else {
			// Fallback to copy link
			copyToClipboard();
		}
	};
	export const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(url);
			alert('Link copied to clipboard!');
		} catch (error) {
			console.error('Failed to copy the link:', error);
		}
	};
	// it had to be duplicated cos when shared, svelte produces an error on build
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

	function getGridClass(count) {
		switch (count) {
			case 1:
				return 'grid-cols-1';
			case 2:
				return 'grid-cols-2';
			case 3:
				return 'grid-cols-2';
			case 4:
				return 'grid-cols-2';
			default:
				return 'grid-cols-2';
		}
	}

	// Helper function to get individual image classes based on position and count
	function getImageClass(total, index) {
		if (total === 1) {
			return 'col-span-1 aspect-[4/3]';
		}
		if (total === 2) {
			return 'col-span-1 aspect-square';
		}
		if (total === 3) {
			return index === 0 ? 'col-span-2 aspect-[4/3]' : 'col-span-1 aspect-square';
		}
		if (total === 4) {
			return 'col-span-1 aspect-square';
		}
		if (total >= 5) {
			return index === 0 ? 'col-span-2 aspect-[4/3]' : 'col-span-1 aspect-square';
		}
		return '';
	}

	// Get maximum images to display
	let displayImages = topic.topic_images.slice(0, 5);
	let remainingCount = Math.max(0, topic.topic_images.length - 5);
</script>

<div transition:slide class="bg-white p-2 hover:bg-gray-50">
	<div class="flex items-center justify-between text-sm">
		<span class="flex items-center">
			<div class="mr-2 h-[25px] w-[25px] overflow-hidden rounded-full">
				<img class="object-fit" src={topic.Member.image} alt={topic.Member.username} />
			</div>
			<a class=" link-hover" href={`/community/${topic.Member.username}`}>{topic.Member.fullName}</a
			>
			<Dot />
			<p class="text-gray-400">{moment(topic.created_at).fromNow()}</p></span
		>
		{#if myProfile}
			<button class="btn btn-ghost" onclick={() => deleteTopic(topic, index)}><Trash /></button>
		{:else}
			<button class="btn btn-ghost" onclick={() => handleFavorite(topic)}>
				{#if fav_id.includes(topic.id)}
					<Star fill="red" color="red" />
				{:else}
					<Star />
				{/if}
			</button>
		{/if}
	</div>
	<a href={`/community/topic/${topic.id}`}>
		<h3 class="text-xl font-bold">{@html highlightText(topic.topic, text)}</h3>
		<p class="mt-2 text-sm text-gray-800">
			{@html highlightText(topic.content, text)}
		</p>

		<div class="w-full">
			{#if displayImages.length > 0}
				<div class="grid gap-1 {getGridClass(displayImages.length)}">
					{#each displayImages as image, i}
						<div class="relative {getImageClass(displayImages.length, i)} overflow-hidden">
							<img src={image} alt="Post image {i + 1}" class="h-full w-full object-cover" />
							{#if i === 4 && remainingCount > 0}
								<div class="absolute inset-0 flex items-center justify-center bg-black/50">
									<span class="text-2xl font-bold text-white">+{remainingCount}</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</a>
	<div class="mt-5 text-xs">
		<div
			class="tooltip"
			data-tip={`${topic.topic_views.length} view${topic.topic_views.length == 1 ? '' : 's'}`}
		>
			<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
				><Eye size="20px" />
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
			onclick={() => shareTopic(topic.topic, `${location.href}/topic/${topic.id}`)}
			class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
			><Share2 size="20px" />
			<p>Share</p></button
		>
	</div>
</div>
