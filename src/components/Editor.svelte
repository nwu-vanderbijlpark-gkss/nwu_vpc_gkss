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
