<script>
	import { uploadImage } from '$lib';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let { value = $bindable(), id } = $props();

	const handleEditorValueChange = () => {
		value = document.getElementById(id).value;
	};

	onMount(() => {
		handleEditorValueChange();

		addEventListener('trix-attachment-add', async (event) => {
			const attachment = event.attachment;
			if (attachment.file) {
				event.preventDefault();
				const url = await uploadImage(attachment.file, id, supabase);

				if (url) {
					attachment.setAttributes({
						url: url,
						href: url,
						filename: attachment.file.name
					});

					// Important: Remove file reference to prevent Trix from using local file
					attachment.file = undefined;
				}
			}
		});
	});
</script>

<main>
	<trix-toolbar id="{id}Toolbar"></trix-toolbar>
	<input {id} type="hidden" name={id} bind:value />
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<trix-editor id="{id}Editor" onkeyup={handleEditorValueChange} toolbar="{id}Toolbar" input={id}
	></trix-editor>
</main>

<style>
	trix-editor {
		min-height: 200px;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		padding: 1rem;
	}

	trix-editor :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	trix-editor :global(blockquote) {
		@apply border-l-4 border-gray-300 pl-4 italic text-gray-600;
	}

	trix-editor :global(pre) {
		@apply rounded bg-gray-100 p-2 font-mono text-sm;
	}

	trix-editor :global(a) {
		@apply text-blue-600 underline;
	}

	trix-editor :global(ul) {
		@apply list-inside list-disc;
	}

	trix-editor :global(ol) {
		@apply list-inside list-decimal;
	}
</style>
