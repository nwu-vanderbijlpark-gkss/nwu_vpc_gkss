<script>
	let { content } = $props();
</script>

<article class=" w-full rounded-lg text-black">
	{@html content}
</article>

<style>
	article {
		min-height: 200px;
		border-radius: 0.5rem;
		padding: 1rem;
	}

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
