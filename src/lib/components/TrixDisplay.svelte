<script>
	import sanitizeHtml from 'sanitize-html'; // Hypothetical import for sanitization

	let { content = $bindable() } = $props();

	// Sanitize content and children if provided
</script>

<article class="w-full rounded-lg text-black" role="article">
	{@html sanitizeHtml(content)}
</article>

<style>
	article :global(h1) {
		@apply mb-2 text-2xl font-bold text-black;
	}

	article :global(blockquote) {
		@apply border-l-4 pl-4 italic text-black;
	}

	article :global(pre) {
		@apply rounded p-2 font-mono text-sm;
	}

	article :global(a) {
		@apply text-blue-600 underline;
	}

	article :global(ul) {
		@apply list-inside list-disc;
	}

	article :global(ol) {
		@apply list-inside list-decimal;
	}
</style>
