<!-- CodingTest.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import CodeMirror from 'svelte-codemirror-editor';
	import { java } from '@codemirror/lang-java';
	import { javascript } from '@codemirror/lang-javascript';
	import { python } from '@codemirror/lang-python';
	import { php } from '@codemirror/lang-php';
	import { cpp } from '@codemirror/lang-cpp';

	// Configuration
	const JUDGE0_URL = '';
	const API_KEY = '';

	// Type definitions
	type LanguageConfig = {
		name: string;
		extension: string;
		mode: any;
		template: string;
	};

	type TestCase = {
		input: string;
		expected: string;
		description?: string;
	};

	type Result = {
		input: string;
		expected: string;
		actual: string;
		passed: boolean;
		time?: number;
		memory?: number;
	};

	// Component state
	let code = $state('');
	let language = $state('71');
	let testCases = $state<TestCase[]>([]);
	let results = $state<Result[]>([]);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	//demo tests
	testCases = [
		{
			input: '5\n3',
			expected: '8',
			description: 'Add two positive numbers'
		},
		{
			input: '-2\n7',
			expected: '5',
			description: 'Add negative and positive numbers'
		},
		{
			input: '10\n-5',
			expected: '5',
			description: 'Handle subtraction'
		}
	];
	// Supported languages
	const LANGUAGES: Record<string, LanguageConfig> = {
		'71': {
			name: 'Python',
			extension: 'py',
			mode: python(),
			template: 'def solution(input):\n    # Your code here\n    pass'
		},
		'63': {
			name: 'JavaScript',
			extension: 'js',
			mode: javascript(),
			template: 'function solution(input) {\n  // Your code here\n  return input;\n}'
		},
		'62': {
			name: 'Java',
			extension: 'java',
			mode: java(),
			template:
				'public class Solution {\n    public static String solution(String input) {\n        // Your code here\n        return input;\n    }\n}'
		},
		'54': {
			name: 'C++',
			extension: 'cpp',
			mode: cpp(),
			template:
				'#include <iostream>\nusing namespace std;\n\nstring solution(string input) {\n    // Your code here\n    return input;\n}'
		}
	};

	// Initialize code with template
	$effect(() => {
		if (LANGUAGES[language] || !code) {
			code = LANGUAGES[language].template;
		}
	});

	// Load test cases
	onMount(async () => {
		code = LANGUAGES['71'].template;
		/*
		try {
			const res = await fetch('/tests.json');
			if (!res.ok) throw new Error('Failed to load test cases');
			testCases = await res.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error occurred';
		}
            */
	});

	async function submitCode() {
		if (!API_KEY) {
			error = 'Judge0 API key not configured';
			return;
		}

		isLoading = true;
		error = null;
		results = [];

		try {
			for (const [index, test] of testCases.entries()) {
				const response = await executeCode(code, test.input);

				if (response.status?.id !== 3) {
					// Status 3 = finished
					throw new Error(`Execution failed for test ${index + 1}`);
				}

				results = [
					...results,
					{
						input: test.input,
						expected: test.expected,
						actual: response.stdout?.trim() || response.stderr,
						passed: response.stdout?.trim() === test.expected,
						time: response.time,
						memory: response.memory
					}
				];
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Submission failed';
		} finally {
			isLoading = false;
		}
	}

	async function executeCode(code: string, input: string) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 10000);

		try {
			const response = await fetch(`${JUDGE0_URL}/submissions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-RapidAPI-Key': API_KEY,
					'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
				},
				body: JSON.stringify({
					source_code: code,
					language_id: language,
					stdin: input,
					redirect_stderr_to_stdout: true,
					wait: true
				}),
				signal: controller.signal
			});

			if (!response.ok) throw new Error('API request failed');
			return await response.json();
		} finally {
			clearTimeout(timeout);
		}
	}

	function formatOutput(output: string) {
		return output.length > 100 ? `${output.slice(0, 97)}...` : output;
	}
</script>

<div class="min-h-screen w-full bg-white">
	<div class="container">
		{#if error}
			<div class="error-banner">{error}</div>
		{/if}

		<div class="toolbar">
			<select bind:value={language} class="language-select">
				{#each Object.entries(LANGUAGES) as [id, lang]}
					<option value={id}>{lang.name}</option>
				{/each}
			</select>

			<button onclick={submitCode} disabled={isLoading} class:loading={isLoading}>
				{#if isLoading}
					<svg class="spinner" viewBox="0 0 50 50">
						<circle cx="25" cy="25" r="20" fill="none" stroke-width="5" />
					</svg>
					Testing...
				{:else}
					Submit Code
				{/if}
			</button>
		</div>

		<CodeMirror bind:value={code} extensions={[LANGUAGES[language]?.mode]} class="editor" />

		<div class="results-container">
			<h2>Test Results ({results.length}/{testCases.length})</h2>

			{#if results.length > 0}
				<div class="stats">
					<span class="passed">{results.filter((r) => r.passed).length} passed</span>
					<span class="failed">{results.filter((r) => !r.passed).length} failed</span>
				</div>
			{/if}

			<div class="results">
				{#each results as result, i}
					<div class="result-item {result.passed ? 'passed' : 'failed'}">
						<div class="result-header">
							<span class="status">{result.passed ? '✅' : '❌'} Test {i + 1}</span>
							{#if result.time && result.memory}
								<span class="metrics">
									{result.time}ms • {result.memory}KB
								</span>
							{/if}
						</div>

						{#if !result.passed}
							<div class="result-details">
								<div><strong>Input:</strong> {formatOutput(result.input)}</div>
								<div><strong>Expected:</strong> {formatOutput(result.expected)}</div>
								<div><strong>Received:</strong> {formatOutput(result.actual)}</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.error-banner {
		background: #ffebee;
		color: #c62828;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}

	.toolbar {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.language-select {
		padding: 0.5rem 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		@apply text-black;
	}

	button {
		padding: 0.5rem 1.5rem;
		background: #007acc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: opacity 0.2s;

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}

		&.loading {
			background: #005999;
		}
	}

	.spinner {
		width: 1.2rem;
		height: 1.2rem;
		animation: rotate 1s linear infinite;

		circle {
			stroke: currentColor;
			stroke-linecap: round;
			stroke-dasharray: 90, 150;
			stroke-dashoffset: 0;
		}
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	.results-container {
		margin-top: 2rem;
		background: #f8f9fa;
		border-radius: 8px;
		padding: 1.5rem;
		@apply text-black;
	}

	.stats {
		margin-bottom: 1rem;
		display: flex;
		gap: 1rem;
		font-weight: 500;

		.passed {
			color: #2e7d32;
		}
		.failed {
			color: #c62828;
		}
	}

	.result-item {
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

		&.passed {
			border-left: 4px solid #2e7d32;
		}

		&.failed {
			border-left: 4px solid #c62828;
		}
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.metrics {
		font-size: 0.9em;
		color: #666;
	}

	.result-details {
		font-size: 0.9em;
		border-top: 1px solid #eee;
		padding-top: 0.5rem;
		margin-top: 0.5rem;
		@apply text-black;

		div {
			margin: 0.3rem 0;
		}
	}
</style>
