<script>
	import sanitizeHtml from 'sanitize-html'; // Hypothetical import for sanitization

	let { content = $bindable() } = $props();

	// Sanitize content and children if provided
</script>

<article class="w-full rounded-lg text-black" role="article">
	{@html sanitizeHtml(content)}
</article>

<style>
	@import 'tailwindcss';
	@plugin 'daisyui';

	article {
		min-height: 200px;
		border-radius: 0.5rem;
		padding: 1rem;
		@apply wrap-anywhere;
	}

	article :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	article :global(blockquote) {
		@apply border-l-4 pl-4 italic;
		border-color: var(--primary-color); /* user color for left border */
	}

	article :global(pre) {
		@apply rounded p-2 font-mono text-sm;
	}

	article :global(a) {
		@apply underline;
		color: var(--primary-color); /* user color for links */
	}

	article :global(ul) {
		@apply list-inside list-disc;
	}

	article :global(ol) {
		@apply list-inside list-decimal;
	}

	article :global(ul li::marker),
	article :global(ol li::marker) {
		color: var(--primary-color); /* user color for bullets/numbers */
	}
</style>
