<script>
	import { marked } from 'marked';
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import 'highlight.js/styles/github-dark-dimmed.css';

	let { content } = $props();

	// Configure Marked with custom settings
	marked.setOptions({
		highlight: (code, lang) => {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		},
		langPrefix: 'hljs language-',
		breaks: true,
		gfm: true,
		smartypants: true
	});

	// Add custom renderers
	const renderer = new marked.Renderer();

	renderer.link = (href, title, text) => {
		return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`;
	};

	renderer.image = (href, title, text) => {
		return `<img src="${href}" alt="${text}" loading="lazy" title="${title || ''}" class="rounded-lg">`;
	};

	let html = $state('');
	let error = $state(null);

	// Process markdown reactively
	$derived: {
		try {
			const raw = marked(content, { renderer });
			html = DOMPurify.sanitize(raw, {
				ALLOWED_TAGS: [
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'blockquote',
					'p',
					'a',
					'ul',
					'ol',
					'li',
					'code',
					'pre',
					'em',
					'strong',
					'hr',
					'br',
					'div',
					'span',
					'img',
					'table',
					'thead',
					'tbody',
					'tr',
					'th',
					'td'
				],
				ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'loading']
			});
			error = null;
		} catch (e) {
			error = e.message;
		}
	}

	// Add copy to clipboard functionality
	function copyCode(event) {
		const button = event.target.closest('button');
		if (!button) return;

		const code = button.nextElementSibling?.textContent;
		if (code) {
			navigator.clipboard.writeText(code).then(() => {
				button.textContent = 'Copied!';
				setTimeout(() => (button.textContent = 'Copy'), 2000);
			});
		}
	}
</script>

{#if error}
	<div class="error-message">Error rendering markdown: {error}</div>
{:else}
	<div class="markdown-container" on:click={copyCode}>
		{@html html}
	</div>
{/if}

<style>
	.markdown-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
		color: var(--text-primary);
		line-height: 1.6;
	}

	/* Headings */
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 1.5em 0 0.5em;
		font-weight: 600;
		scroll-margin-top: 2rem;
	}

	h1 {
		font-size: 2.2rem;
		border-bottom: 2px solid var(--border);
	}
	h2 {
		font-size: 1.8rem;
	}
	h3 {
		font-size: 1.5rem;
	}

	/* Code blocks */
	pre {
		position: relative;
		margin: 1.5rem 0;
		padding: 1.5rem;
		border-radius: 8px;
		background: var(--code-bg);
		overflow-x: auto;
	}

	pre > button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem 0.5rem;
		background: var(--code-copy-bg);
		border: none;
		border-radius: 4px;
		color: var(--code-copy-text);
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	pre:hover > button {
		opacity: 1;
	}

	code {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.9em;
	}

	/* Inline code */
	code:not(pre code) {
		padding: 0.2em 0.4em;
		border-radius: 4px;
		background: var(--inline-code-bg);
		color: var(--inline-code-text);
	}

	/* Lists */
	ul,
	ol {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	li {
		margin: 0.5rem 0;
	}

	/* Blockquotes */
	blockquote {
		margin: 1.5rem 0;
		padding: 0.5rem 1.5rem;
		border-left: 4px solid var(--blockquote-border);
		background: var(--blockquote-bg);
		color: var(--blockquote-text);
		border-radius: 4px;
	}

	/* Tables */
	table {
		width: 100%;
		margin: 1.5rem 0;
		border-collapse: collapse;
		background: var(--table-bg);
		border-radius: 8px;
		overflow: hidden;
	}

	th,
	td {
		padding: 0.75rem;
		border: 1px solid var(--table-border);
		text-align: left;
	}

	th {
		background: var(--table-header-bg);
		font-weight: 600;
	}

	/* Links */
	a {
		color: var(--link-color);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease;
	}

	a:hover {
		border-bottom-color: currentColor;
	}

	.error-message {
		color: #dc2626;
		padding: 1rem;
		background: #fef2f2;
		border-radius: 4px;
		margin: 1rem 0;
	}
</style>
