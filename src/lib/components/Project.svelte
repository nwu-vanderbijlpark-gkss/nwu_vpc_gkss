<script>
	import { ArrowUpRightFromSquare, Eye, MessageSquare, Star, ThumbsUp } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import moment from 'moment';

	let { project, form, text } = $props();
	let isHovered = $state(false);
	let showRatingInput = $state(false);
	let hoverRating = $state(0);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	let rateButtonRef;
	let rating = $state(0);
	onMount(() => {
		//calculate average
		let i = 0;
		let sum = 0;
		if (project.rating) {
			for (const rate of project.rating) {
				sum += rate.rating;
				i++;
			}
		}
		rating = sum / i;
	});
	function handleStarHover(rating) {
		hoverRating = rating;
	}

	function handleStarLeave() {
		hoverRating = 0;
	}

	async function handleRate(rating, id) {
		try {
			isSubmitting = true;
			errorMessage = '';
			successMessage = '';

			const data = new FormData();
			data.append('id', id);
			data.append('rating', rating);

			const response = await fetch('/community/projectspace?/rateProject', {
				body: data,
				method: 'POST'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to submit rating');
			}

			//project.rating = rating;
			successMessage = 'Rating submitted successfully!';

			// Hide success message after 3 seconds
			setTimeout(() => {
				successMessage = '';
				showRatingInput = false;
			}, 3000);
		} catch (error) {
			errorMessage = error.message || 'Failed to submit rating';
		} finally {
			isSubmitting = false;
		}
	}

	function handleEscape(e) {
		if (e.key === 'Escape') {
			showRatingInput = false;
			errorMessage = '';
			successMessage = '';
		}
	}
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

<a
	href={`/community/tools/${project.id}`}
	class="hover:border-primary-300 focus:ring-primary-500 group relative flex h-full flex-col bg-white p-6 transition-all hover:shadow-md focus:outline-none focus:ring-2"
>
	<div class="mb-4 flex items-center gap-3">
		<div>
			<p class="text-sm font-medium text-gray-700">
				{@html highlightText(project.Member.name, text)}
				{@html highlightText(project.Member.surname, text)}
			</p>
			{#if project.created_at}
				<time class="text-xs text-gray-500" datetime={project.created_at}>
					{moment(project.created_at).fromNow()}
				</time>
			{/if}
		</div>
	</div>

	<div class="flex flex-1 flex-col">
		<h2 class="group-hover:text-primary-600 mb-2 text-xl font-semibold text-gray-900">
			{@html highlightText(project.name, text)}
		</h2>
		<p class="mb-4 line-clamp-3 flex-1 text-base text-gray-600">
			{@html highlightText(project.description, text)}
		</p>

		<div class="mt-auto flex flex-wrap items-center justify-between gap-2">
			<span
				class="flex items-center gap-3 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
			>
				<Eye />{project.project_views.length} view{project.project_views.length > 1 ? 's' : ''}
			</span>

			<p class="text-sm text-gray-500">{project.type}</p>
		</div>
	</div>
</a>
