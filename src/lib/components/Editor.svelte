<script>
	import { onMount } from 'svelte';

	let Quill;
	let editor;
	let content = '';

	onMount(async () => {
		// Import Quill only on the client
		const QuillModule = await import('quill');
		Quill = QuillModule.default;

		// Initialize the editor
		editor = new Quill('#editor', {
			theme: 'snow',
			modules: {
				toolbar: [
					['bold', 'italic', 'underline'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					['link', 'image']
				]
			}
		});

		// Listen for content changes
		editor.on('text-change', () => {
			content = editor.getContents(); // Get JSON output
			console.log(content);
		});
	});
</script>

<!-- Editor container -->
<div id="editor" style="height: 200px; border: 1px solid #ccc;"></div>

<style>
	@import 'tailwindcss';
	@plugin 'daisyui';
	trix-editor {
		min-height: 200px;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		padding: 1rem;
	}

	trix-editor :global(h1),
	.content :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	trix-editor :global(blockquote),
	.content :global(blockquote) {
		@apply border-l-4 border-gray-300 pl-4 text-gray-600 italic;
	}

	trix-editor :global(pre),
	.content :global(pre) {
		@apply rounded bg-gray-100 p-2 font-mono text-sm;
	}

	trix-editor :global(a),
	.content :global(a) {
		@apply text-blue-600 underline;
	}

	trix-editor :global(ul),
	.content :global(ul) {
		@apply list-inside list-disc;
	}

	trix-editor :global(ol),
	.content :global(ol) {
		@apply list-inside list-decimal;
	}
</style>
