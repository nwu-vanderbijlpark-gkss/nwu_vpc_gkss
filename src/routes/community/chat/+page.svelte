<script>
	import { LogIn } from 'lucide-svelte';
	import { SendHorizontal } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let { data } = $props();
	let message = $state('');
	let responses = $state(data.chat ? JSON.parse(data.chat) : []); //read the past messages or initialize an empty chat
	const models = [
		'deepseek-r1-distill-llama-70b',
		'deepseek-r1-distill-qwen-32b',
		'gemma2-9b-it',
		'llama-3.1-8b-instant',
		'llama-3.2-11b-vision-preview',
		'llama-3.2-1b-preview',
		'llama-3.2-3b-preview',
		'llama-3.2-90b-vision-preview',
		'llama-3.3-70b-specdec',
		'llama-3.3-70b-versatile',
		'llama-guard-3-8b',
		'llama3-70b-8192',
		'llama3-8b-8192',
		'mixtral-8x7b-32768',
		'qwen-2.5-32b',
		'qwen-2.5-coder-32b'
	];
	let model = $state(models[0]);
	async function handleSubmit(e) {
		e.preventDefault();
		if (message.length > 0) {
			const response = await fetch('/community/ai-chat', {
				method: 'POST',
				body: JSON.stringify({ message, model, responses }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const result = await response.json();
			responses.push({ message: message, response: result.response, model: model });
			message = '';
		}
	}
	onMount(() => {});
	let textarea;

	// Auto-resize function for textarea
	const autoResize = (e) => {
		e.target.style.height = 'auto';
		e.target.style.height = `${e.target.scrollHeight}px`;
	};
	let chatContainer;
	let isTyping = $state(false);
	let isSending = $state(false);
	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (message.trim()) handleSubmit(e);
		}
	};
	// Auto-scroll to bottom when new messages are added
	$derived: if (chatContainer) {
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}
</script>

<div class="flex h-screen flex-col">
	<!-- Header -->
	<header class="border-b p-4">
		<div class="mx-auto max-w-4xl">
			<h1 class="text-xl font-bold text-primary">Geek AI Chat</h1>
			<p class="text-sm text-gray-500">
				Using: <select
					bind:value={model}
					class="select select-bordered border-gray-600 bg-white font-bold"
				>
					{#each models as mod}
						<option>{mod}</option>
					{/each}
				</select>
			</p>
		</div>
	</header>
	{#if data.isLoggedIn}
		<!-- Chat Messages -->
		<div class="chat-container relative flex-1">
			<div class="mx-auto h-full max-w-4xl overflow-y-auto p-4" bind:this={chatContainer}>
				<div class="flex min-h-full flex-col justify-end space-y-4">
					{#each responses as response, i}
						<!-- User Message -->
						<div class="chat chat-end" in:fade={{ duration: 200 }}>
							<div class="avatar chat-image">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
								>
									<span class="text-xs">You</span>
								</div>
							</div>
							<div
								class="group chat-bubble chat-bubble-primary relative max-w-2xl whitespace-pre-wrap"
							>
								{response.message}
								{#if response.status === 'error'}
									<div
										class="tooltip tooltip-left absolute -right-2 top-1/2 -translate-y-1/2"
										data-tip="Failed to send"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-error"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
											/>
										</svg>
									</div>
								{/if}
							</div>
							<div class="chat-footer mt-1 flex items-center gap-1 text-xs opacity-50">
								{new Date(response.timestamp).toLocaleTimeString()}
								{#if response.status === 'sending'}
									<span class="loading loading-spinner loading-xs"></span>
								{/if}
							</div>
						</div>

						<!-- Bot Response -->
						<div class="chat chat-start" in:fade={{ duration: 200 }}>
							<div class="avatar chat-image">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.307L4.2 15.3m15.6 0l2.082 2.082a.75.75 0 01-.233 1.231 18.272 18.272 0 01-7.569 1.685 18.272 18.272 0 01-7.57-1.685.75.75 0 01-.232-1.23L4.2 15.3"
										/>
									</svg>
								</div>
							</div>
							<div class="chat-bubble chat-bubble-accent max-w-2xl whitespace-pre-wrap">
								{response.response}
							</div>
							<div class="chat-footer mt-1 flex items-center gap-1 text-xs opacity-50">
								{new Date(response.timestamp).toLocaleTimeString()}
								{#if response.status === 'processing'}
									<span class="loading loading-dots loading-xs"></span>
								{/if}
							</div>
						</div>
					{/each}

					<!-- Typing Indicator -->
					{#if isTyping}
						<div class="chat chat-start" transition:fade>
							<div class="avatar chat-image">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.307L4.2 15.3m15.6 0l2.082 2.082a.75.75 0 01-.233 1.231 18.272 18.272 0 01-7.569 1.685 18.272 18.272 0 01-7.57-1.685.75.75 0 01-.232-1.23L4.2 15.3"
										/>
									</svg>
								</div>
							</div>
							<div class="chat-bubble chat-bubble-accent">
								<span class="loading loading-dots loading-sm"></span>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Input Area -->
		<div class="fixed bottom-16 w-full border-t bg-white shadow-lg lg:sticky lg:bottom-10">
			<form class="mx-auto max-w-4xl p-4" onsubmit={handleSubmit}>
				<div class="join w-full">
					<textarea
						bind:value={message}
						class="join-item textarea textarea-bordered flex-1 resize-none overflow-hidden bg-gray-200"
						placeholder="Type your message..."
						rows="1"
						oninput={autoResize}
						onkeydown={handleKeyDown}
						aria-label="Chat input"
					/>
					<button
						class="btn btn-primary join-item rounded-r-lg disabled:text-black"
						type="submit"
						disabled={!message.trim() || isSending}
						aria-label="Send message"
					>
						{#if isSending}
							<span class="loading loading-spinner loading-sm"></span>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
								/>
							</svg>
						{/if}
					</button>
				</div>
				<p class="mt-2 text-xs text-gray-500">Shift + Enter for new line • Enter to send</p>
			</form>
		</div>
	{:else}
		<div class="rounded-xl border-2 border-dashed p-8 text-center">
			<div class="mx-auto max-w-xs space-y-4">
				<LogIn class="mx-auto h-12 w-12 text-primary" />
				<h4 class="text-xl font-semibold">Join the community</h4>
				<p class="mb-4 text-gray-600">Sign in to experience this feature</p>
				<a href="/login" class="btn btn-primary w-full gap-2">
					<LogIn class="h-5 w-5" />
					Login to Continue
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.chat-container {
		scroll-behavior: smooth;
	}

	.chat-bubble {
		transition: all 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.fade {
		animation: fadeIn 0.3s ease-out;
	}
</style>
