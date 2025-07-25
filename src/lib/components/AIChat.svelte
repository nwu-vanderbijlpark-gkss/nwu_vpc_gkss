<script>
	import { afterNavigate, goto } from '$app/navigation';
	import { models } from '$lib/state.svelte';
	import { marked } from 'marked';
	import {
		Bot,
		BotMessageSquare,
		Maximize2,
		Mic,
		Minimize,
		Minimize2,
		Send,
		Trash2,
		Volume2Icon,
		X
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';

	let { isMobile } = $props();

	//messages from user will have the sender as "user", from ai as "assistant"
	let messages = $state([
		{
			sender: 'assistant',
			message:
				'Hi there! 👋 How can I assist you today?\nTips: you can ask me to take you to any page, I will try my best!'
		}
	]);

	let formMessage = $state(''); //for the message input

	//chat states.
	let chat = $state({
		state: 'minimized', //closed, minimized or open
		isTyping: false,
		isRedirecting: false,
		redirectPage: '',
		model: null,
		element: null,
		isSpeaking: false,
		isRecording: false
	});

	//this handles chat state, accepts a state, and sets it to the chat object and sets it also in the localstorage
	const handleChatStateChange = (state) => {
		chat.state = state;
		localStorage.setItem('chatState', chat.state);
		if (chat.state == 'open') {
			setTimeout(() => scrollToBottom(chat.element), 10);
		}
	};

	//when the user chooses a different model
	let modelIndex = $state(Math.floor(Math.random() * models.data.length)); //the model index. initially a random model.
	const handleModelChange = () => {
		//sets the model given the index
		chat.model = models.getModel(modelIndex);
	};

	const handleSubmit = async (e) => {
		//when the submit button in the messege input form is clicked.
		e.preventDefault();
		if (formMessage.length === 0) {
			//cannot sent empty message
			return;
		}

		//add the message to the array, which will render it on the document
		messages.push({
			sender: 'user',
			message: formMessage.trim()
		});

		//scroll to the bottom of the chat field element
		setTimeout(() => scrollToBottom(chat.element), 1);

		//simulate ai chat to be typing while an api request is sent, while we wait for a response
		chat.isTyping = true;

		//if there is no model chosen yet, choose a random model
		if (!chat.model) {
			//get a random model
			chat.model = models.getRandomModel();
		}

		//add the question, also add some relevant context and chat history
		models.question = formMessage.trim() + '\nCurrent page is ' + $page.url.pathname;

		console.log(models.promptMessage());
		//call the api, wait for the response
		const req = await fetch('/api/ai', {
			method: 'POST',
			body: JSON.stringify({ model: chat.model.id, message: models.promptMessage() })
		});

		//the response
		const response = await req.json();

		//we have received the response, then the ai has finished typing
		chat.isTyping = false;

		//if these messages appear, then an error has occured
		const errorResponses = ['safe', 'unsafe\nS7'];

		//if the response failed, then let the user choose a different model
		if (!response.success || errorResponses.includes(response.response)) {
			//add it to the messages
			messages.push({
				sender: 'assistant',
				message: 'This model could not process your prompt, try a different model'
			});
			chat.model = models.getRandomModel();
		}

		//trim any additional spaces
		let answer = response.response.trim();

		//if this model thinks, we do not want to show it, we will remove that part
		if (answer.includes('<think>')) {
			answer = handleThinking(answer);
		}

		//handle the redirect by the ai
		answer = handleAutoRedirect(answer);

		//add the response to the messages array
		messages.push({
			sender: 'assistant',
			message: answer
		});

		//set the chat history on the local storage
		localStorage.setItem('lclGeekAiMsgs', JSON.stringify(messages));

		//read the ai response aloud, to make it fun nyana
		speak(answer);

		//scroll to the bottom of the chat field element
		setTimeout(() => scrollToBottom(chat.element), 1);

		//clear the form message input for a new message
		formMessage = '';
	};

	const scrollToBottom = (node) => {
		//scrolls to the bottom of a node(html element)
		node.scroll({
			top: node.scrollHeight,
			behaviour: 'smooth'
		});
	};

	const handleThinking = (answer) => {
		//removes the text from the start of <think> to the end of </think>
		const tag = 'think>';
		const endIndex = answer.indexOf('</' + tag);
		return answer.substring(endIndex + tag.length + 2).trim();
	};

	const handleAutoRedirect = (answer) => {
		//searches for the code instructed to the ai, if found, then extract the page to navigate to
		const inLower = answer.toLowerCase();

		const searchString = 'redirect(';

		//if the ai wants to redirect the user
		if (inLower.includes(searchString)) {
			//get the page,
			const startIndex = inLower.lastIndexOf(searchString) + searchString.length;
			const endIndex = inLower.indexOf(')', startIndex);
			let page = inLower.substring(startIndex, endIndex);

			if (page.includes('home')) {
				page = ''; //root page
			}

			answer =
				'Taking you to ' +
				page +
				' page\n' +
				answer.replace(inLower.substring(startIndex - searchString.length, endIndex + 1), '');

			chat.isRedirecting = true;
			chat.redirectPage = page;
			goto('/' + page); //redirect
			return answer;
		}

		return answer; //return the text as it was
	};

	onMount(() => {
		//get the chat state from local storage, it remembers
		chat.state = localStorage.getItem('chatState') || 'minimized';
		//fetch local messages with the ai
		const lclMessages = localStorage.getItem('lclGeekAiMsgs');
		if (lclMessages) {
			messages = JSON.parse(lclMessages);
		}
	});

	const handleSpeechToText = (e) => {
		//set isrecording to true
		chat.isRecording = true;

		//we need to make sure the browser has the speech recognition
		if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
			try {
				const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
				const recognition = new SpeechRecognition();
				recognition.lang = 'en-US';
				recognition.interimResults = false;
				recognition.maxAlternatives = 1;

				//turn the speech to text and submit form
				recognition.onresult = (event) => {
					const voiceInput = event.results[0][0].transcript;
					formMessage = voiceInput;
					chat.isRecording = false;
					handleSubmit(e);
				};

				//start the recognition
				recognition.start();
			} catch (error) {
				chat.isRecording = false;
				alert('Something went wrong while starting speech recognition.');
			}
		} else {
			chat.isRecording = false;
		}
	};

	const speak = (text) => {
		//accepts text and turns it into speech
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = 'en-ZA';
		utterance.pitch = 1;
		utterance.rate = 1;
		utterance.volume = 1;

		//set voice, any voice based on the client
		const setVoiceAndSpeak = () => {
			const voices = speechSynthesis.getVoices();

			// Try to find a male voice (preferring en-ZA or English)
			const maleVoice =
				voices.find(
					(v) => v.lang === 'en-ZA' && /male|david|google uk english male/i.test(v.name)
				) ||
				voices.find(
					(v) => /en/.test(v.lang) && /male|david|google uk english male/i.test(v.name)
				) ||
				voices.find((v) => /en/.test(v.lang)); // fallback

			if (maleVoice) {
				utterance.voice = maleVoice;
			}

			speechSynthesis.speak(utterance);
			//show the speaker icon, if its clicked itll stop the speaking/speechsynthesis
			chat.isSpeaking = true;
		};

		// Voices may not be loaded yet
		if (speechSynthesis.getVoices().length === 0) {
			speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
		} else {
			setVoiceAndSpeak();
		}
	};

	const clearChat = () => {
		if (confirm('Clear chat?')) {
			localStorage.clear('lclGeekAiMsgs');
			messages = [];
			messages.push({
				sender: 'assistant',
				message:
					'Hi there! 👋 How can I assist you today?\nTips: you can ask me to take you to any page, I will try my best!'
			});
		}
	};
</script>

<!--When the chat is closed, display on the ASK LeeAI button-->
{#if chat.state == 'closed'}
	<button
		onclick={() => handleChatStateChange('open')}
		class="btn btn-accent fixed bottom-16 right-8 z-[100] lg:bottom-4"
	>
		<BotMessageSquare />
		Ask GeekAI
	</button>
{:else}
	<!--When the chat is not closed/ is open or minimized-->

	<div
		class=" fixed z-[100] mx-[4svw] flex shadow-lg lg:right-4 lg:m-0 {chat.state == 'open'
			? 'bottom-1 h-[98svh]'
			: 'bottom-16 lg:bottom-2'} w-[92svw] flex-col justify-between rounded-2xl border border-white bg-base-200 p-2
        shadow-xl lg:w-2/6"
		transition:slide
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<header
			name="header"
			id="header"
			data-name="header"
			onclick={(e) => {
				if (chat.state == 'minimized' && e.target.dataset.name == 'header') {
					handleChatStateChange('open');
				}
			}}
			class="flex items-center justify-between p-2"
		>
			<div>
				<div class="flex w-full flex-col items-center justify-center">
					<Bot />
					<h3 class="flex text-lg font-bold">GeekAI Assistant</h3>
				</div>
				<p class="text-xs text-green-700">{chat.isTyping ? 'typing...' : ''}</p>
			</div>
			<div class="flex gap-2">
				{#if chat.isSpeaking}
					<button
						class="btn btn-ghost"
						onclick={() => {
							speechSynthesis.cancel();
							chat.isSpeaking = false;
						}}
					>
						<Volume2Icon />
					</button>
				{/if}
				{#if chat.state == 'minimized'}
					<button class="btn btn-ghost" onclick={() => handleChatStateChange('open')}>
						<Maximize2 />
					</button>
				{:else}
					<button class="btn btn-ghost text-primary" onclick={clearChat}>
						<Trash2 />
					</button>
					<button class="btn btn-ghost" onclick={() => handleChatStateChange('minimized')}>
						<Minimize2 />
					</button>
				{/if}
				<button class="btn btn-ghost text-primary" onclick={() => handleChatStateChange('closed')}>
					<X />
				</button>
			</div>
		</header>
		{#if chat.state == 'open'}
			<main
				bind:this={chat.element}
				class="h-full w-full space-y-2 overflow-auto p-2"
				transition:slide
			>
				<div class="flex w-full flex-col items-center justify-center">
					<Bot size="50" />
					<h3 class="flex text-lg font-bold">GeekAI Assistant</h3>
				</div>
				{#each messages as message}
					{#if message.sender == 'assistant'}
						<div class="chat chat-start">
							<div class="avatar chat-image">
								<div class="w-5 overflow-visible">
									<Bot />
								</div>
							</div>
							<div
								class="prose chat-bubble overflow-clip whitespace-pre-wrap bg-[#262626] p-2 text-gray-100"
							>
								{@html marked(message.message)}
							</div>
						</div>
					{:else}
						<div class="chat chat-end">
							<div
								class="chat-bubble overflow-clip whitespace-pre-wrap rounded-xl bg-primary p-2 text-white"
							>
								{message.message}
							</div>
						</div>
					{/if}
				{/each}
				{#if chat.isTyping}
					<div class="flex w-full justify-start">
						<div class="rounded-xl p-2 text-gray-100">
							<div class="loading loading-dots loading-lg"></div>
						</div>
					</div>
				{/if}
				{#if chat.isRedirecting}
					<div class="w-full">
						<div class="max-w-2/3 end-0 whitespace-pre-wrap rounded-xl">
							Taking you to: {chat.redirectPage}
						</div>
					</div>
				{/if}
			</main>
			<div transition:slide class="my-2 flex items-center gap-3">
				Model:
				<select class="select select-ghost" bind:value={modelIndex} onchange={handleModelChange}>
					{#each models.data as llm, i}
						<option value={i}>{llm.id}</option>
					{/each}
				</select>
			</div>
			<form
				transition:slide
				method="POST"
				onsubmit={handleSubmit}
				class="flex w-full items-center gap-1 border-t border-base-100 p-2 shadow-lg"
			>
				<textarea
					class="input input-bordered w-full"
					bind:value={formMessage}
					type="text"
					placeholder="Ask me anything"
				></textarea>
				{#if formMessage.length == 0}
					<button
						onclick={handleSpeechToText}
						type="button"
						variant="ghost"
						class="btn {chat.isRecording ? 'btn-primary animate-pulse' : 'btn-ghost'} rounded-full"
					>
						<Mic />
					</button>
				{:else}
					<button
						disabled={formMessage.length == 0}
						type="submit"
						variant="ghost"
						class="btn btn-ghost"
					>
						<Send />
					</button>
				{/if}
			</form>
		{/if}
	</div>
{/if}

<style>
	.prose :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	.prose :global(blockquote) {
		@apply border-l-4 pl-4 italic;
	}

	.prose :global(pre) {
		@apply rounded p-2 font-mono text-sm;
	}

	.prose :global(a) {
		@apply underline;
	}

	.prose :global(ul) {
		@apply list-inside list-disc;
	}

	.prose :global(ol) {
		@apply list-inside list-decimal;
	}

	.prose :global(ul li::marker),
	.prose :global(ol li::marker) {
	}
</style>
