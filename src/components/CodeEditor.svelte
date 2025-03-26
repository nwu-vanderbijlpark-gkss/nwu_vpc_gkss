<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { css } from '@codemirror/lang-css';
	import { html } from '@codemirror/lang-html';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { debounce } from 'throttle-debounce';
	import DOMPurify from 'dompurify';
	import JSZip from 'jszip';
	import { onMount } from 'svelte';

	// State management
	let activeTab = $state('html');
	let htmlCode = $state(
		'<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>GKSS Editor</title>\n\t</head>\n\t<body>\n\t\t<h1>Welcome to GKSS!</h1>\n\t</body>\n</html>'
	);
	let cssCode = $state('body {\n font-family: Arial;\n padding: 20px;\n }');
	let jsCode = $state("<script>\n\n\tconsole.log('Javascript does not work yet.')\n\n<script/>");
	let consoleOutput = $state([]);
	let previewCode = $state(`
    <style>""</style>
    <main>Welcome to GKSS</main>
  `);

	const handleCodeChange = () => {
		localStorage.setItem('previewCode', JSON.stringify({ cssCode, jsCode, htmlCode }));
		previewCode = `
            <style>${cssCode}</style>
            ${htmlCode}
            ${jsCode}
        `;
	};
	// Export as ZIP
	function exportProject() {
		const zip = new JSZip();
		zip.file('index.html', htmlCode);
		zip.file('style.css', cssCode);
		zip.file('script.js', jsCode);
		zip.generateAsync({ type: 'blob' }).then((blob) => {
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'gkss-project.zip';
			link.click();
		});
	}
	let isMounted = $state(false);
	onMount(() => {
		let localPreviewCode = localStorage.getItem('previewCode');
		if (localPreviewCode) {
			const obj = JSON.parse(localPreviewCode);
			jsCode = obj.jsCode;
			cssCode = obj.cssCode;
			htmlCode = obj.htmlCode;
			previewCode = `
            <style>${cssCode}</style>
            ${htmlCode}
            ${jsCode}
        `;
		}
		isMounted = true;
		// Message handler
	});
</script>

{#if isMounted}
	<div class="editor-container">
		<!-- Tabs -->
		<div class="tabs">
			<button class:active={activeTab === 'html'} onclick={() => (activeTab = 'html')}>HTML</button>
			<button class:active={activeTab === 'css'} onclick={() => (activeTab = 'css')}>CSS</button>
			<button class:active={activeTab === 'js'} onclick={() => (activeTab = 'js')}
				>JavaScript</button
			>
			<button class="export" onclick={exportProject}>Export ZIP</button>
		</div>

		<!-- Editors -->
		<div class="editors">
			{#if activeTab === 'html'}
				<CodeMirror
					on:change={handleCodeChange}
					bind:value={htmlCode}
					extensions={[html(), oneDark]}
					class="editor"
				/>
			{:else if activeTab === 'css'}
				<CodeMirror
					on:change={handleCodeChange}
					bind:value={cssCode}
					extensions={[css(), oneDark]}
					class="editor"
				/>
			{:else}
				<CodeMirror
					on:change={handleCodeChange}
					bind:value={jsCode}
					extensions={[javascript(), oneDark]}
					class="editor"
				/>
			{/if}
		</div>

		<!-- Preview & Console -->
		<div class="preview-section">
			<iframe
				srcdoc={previewCode}
				title="preview"
				id="preview"
				sandbox="allow-scripts"
				class="preview"
			></iframe>
			<div class="console">
				<div class="console-header">Console Output</div>
				<div class="console-content">
					{#each consoleOutput as line}
						<div class="console-line">{line}</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.editor-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto 1fr;
		height: 100vh;
		gap: 10px;
		padding: 10px;
		background: #1e1e1e;
	}

	.tabs {
		grid-column: 1 / -1;
		display: flex;
		gap: 5px;
		padding: 5px;
		background: #252526;
	}

	button {
		padding: 8px 15px;
		background: #2d2d2d;
		border: none;
		color: #d4d4d4;
		cursor: pointer;
		border-radius: 3px;
	}

	button.active {
		background: #37373d;
	}

	.export {
		margin-left: auto;
		background: #007acc;
	}

	.editors {
		height: calc(100vh - 60px);
	}

	.preview-section {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 60px);
	}

	.preview {
		flex: 2;
		border: 1px solid #333;
		background: white;
	}

	.console {
		flex: 1;
		background: #1e1e1e;
		color: #d4d4d4;
		font-family: monospace;
		padding: 10px;
		overflow: auto;
	}

	.console-header {
		font-weight: bold;
		margin-bottom: 10px;
	}

	.console-line {
		padding: 2px 0;
	}

	.cm-editor {
		height: 100%;
	}
</style>
