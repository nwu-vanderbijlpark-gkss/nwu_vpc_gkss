<script>
	import { ArrowUpRightFromSquare, ArrowUpRightIcon, Building, Calendar } from 'lucide-svelte';
	import moment from 'moment';
	import { page } from '$app/stores';

	let { opportunity, text, showContent } = $props();

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

<div class="flex h-full flex-col p-3">
	<!-- Category Badge -->
	<span class="badge badge-primary mb-4 self-start text-sm">
		{@html highlightText(opportunity.type.toUpperCase(), text)}
	</span>

	<!-- Title -->
	<h2 class="hover:text-primary-600 mb-2 text-lg font-bold text-gray-900 transition-colors">
		{@html highlightText(opportunity.title, text)}
	</h2>
	{#if showContent}
		<main class="content py-4">
			{@html opportunity.content}
		</main>
	{/if}

	<!-- Details -->
	<div class="flex-1 space-y-3">
		<time class="text-xs text-gray-500" datetime={opportunity.created_at}>
			Posted {moment(opportunity.created_at).fromNow()}
		</time>
		<div class="flex items-center gap-2 text-gray-600">
			<Calendar class="h-5 w-5" />
			<span class="text-sm">Deadline: {opportunity.deadline}</span>
		</div>
		{#if opportunity.organization}
			<div class="flex items-center gap-2 text-gray-600">
				<Building class="h-5 w-5" />
				<span class="text-sm">{@html highlightText(opportunity.organization, text)}</span>
			</div>
		{/if}
	</div>

	<!-- Action Button -->
	{#if $page.url.pathname == '/community/opportunities' || $page.url.pathname == '/community'}
		<a href="/community/opportunities/{opportunity.id}" class="btn btn-primary mt-4 w-full">
			View Details
			<ArrowUpRightFromSquare />
		</a>
	{/if}
</div>

<style>
	@import 'tailwindcss';
	@plugin 'daisyui';
	.content :global(a) {
		color: #2563eb;
		text-decoration: underline;
	}
	trix-editor h1,
	.content :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	trix-editor blockquote,
	.content :global(blockquote) {
		@apply border-l-4 border-gray-300 pl-4 text-gray-600 italic;
	}

	trix-editor pre,
	.content :global(pre) {
		@apply rounded bg-gray-100 p-2 font-mono text-sm;
	}

	trix-editor a,
	.content :global(a) {
		@apply text-blue-600 underline;
	}

	trix-editor ul,
	.content :global(ul) {
		@apply list-inside list-disc;
	}

	trix-editor ol,
	.content :global(ol) {
		@apply list-inside list-decimal;
	}
</style>
