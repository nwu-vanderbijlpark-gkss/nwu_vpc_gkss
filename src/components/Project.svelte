<script>
	import { ArrowUpRightFromSquare, MessageSquare, Star, ThumbsUp } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';

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

<svelte:window onkeydown={handleEscape} />

<div
	class="card relative w-full space-y-4 border bg-white p-5 transition-all duration-300 hover:shadow-lg lg:w-[400px]"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	role="article"
>
	<!-- Header with title and rating -->
	<div class="flex w-full items-center justify-between">
		<div class="space-y-1">
			<h1 class="text-xl font-bold text-gray-900">{@html highlightText(project.name, text)}</h1>
			<a
				href={`/community/${project.Member.username}`}
				class="text-sm text-blue-600 transition-colors hover:text-blue-800"
			>
				by {project.Member.username}
			</a>
		</div>
		<div class="flex items-center gap-1 font-bold">
			<Star color="gold" fill="gold" size={20} />
			{rating?.toFixed(1) || '0.0'}
		</div>
	</div>

	<!-- Project Image -->
	<div class="relative h-[200px] w-full overflow-hidden rounded-lg">
		<img
			src={project.image}
			alt={project.name}
			class="h-full w-full object-cover transition-transform duration-300"
			class:scale-110={isHovered}
		/>
	</div>

	<!-- Description -->
	<p class="line-clamp-2 text-gray-600">{@html highlightText(project.description, text)}</p>

	<!-- Action Buttons -->
	<div class="flex items-center justify-between">
		<div class="relative flex items-center gap-2">
			<button
				bind:this={rateButtonRef}
				class="btn btn-ghost flex items-center gap-2 bg-gray-100 transition-colors hover:bg-gray-200 disabled:opacity-50"
				onclick={() => (showRatingInput = !showRatingInput)}
				disabled={isSubmitting}
				aria-expanded={showRatingInput}
				aria-haspopup="true"
				aria-controls="rating-popup"
			>
				<ThumbsUp size={18} /> Rate
			</button>

			{#if showRatingInput}
				<div
					id="rating-popup"
					class="absolute bottom-12 left-0 min-w-[200px] rounded-lg border bg-white p-3 shadow-lg"
					transition:scale={{ duration: 200 }}
					role="dialog"
					aria-label="Rate this project"
				>
					<div class="space-y-3">
						<div class="flex justify-center gap-1" role="radiogroup" aria-label="Star rating">
							{#each Array(5) as _, i}
								<button
									role="radio"
									aria-checked={i < (hoverRating || rating)}
									aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
									onclick={() => !isSubmitting && handleRate(i + 1, project.id)}
									onmouseenter={() => handleStarHover(i + 1)}
									onmouseleave={handleStarLeave}
									disabled={isSubmitting}
									class="rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
								>
									<Star
										size={24}
										color={i < (hoverRating || rating) ? 'gold' : 'gray'}
										fill={i < (hoverRating || rating) ? 'gold' : 'none'}
									/>
								</button>
							{/each}
						</div>

						{#if isSubmitting}
							<p class="text-center text-sm text-gray-600" role="status">Submitting rating...</p>
						{/if}

						{#if errorMessage}
							<p class="text-center text-sm text-red-500" role="alert" transition:fly={{ y: 10 }}>
								{errorMessage}
							</p>
						{/if}

						{#if successMessage}
							<p
								class="text-center text-sm text-green-500"
								role="status"
								transition:fly={{ y: 10 }}
							>
								{successMessage}
							</p>
						{/if}
					</div>
				</div>
			{/if}

			<button
				class="btn btn-ghost flex items-center gap-2 bg-gray-100 transition-colors hover:bg-gray-200"
				aria-label="Add comment"
			>
				<MessageSquare size={18} /> Comment
			</button>
		</div>
		<a
			href={project.link.includes('http') ? project.link : `https://${project.link}`}
			target="_blank"
			rel="noopener noreferrer"
			class="btn btn-ghost flex items-center gap-2 border transition-colors hover:bg-gray-50"
			aria-label="View project"
		>
			<ArrowUpRightFromSquare size={18} /> View
		</a>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
