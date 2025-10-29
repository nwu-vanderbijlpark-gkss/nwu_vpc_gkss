<script>
	import {
		Bot,
		Brain,
		ChartBar,
		ChartColumnBig,
		CodeXml,
		Dot,
		FileEdit,
		Forward,
		Home,
		Lightbulb,
		LogIn,
		MessageCircle,
		MessageCircleMore,
		MoreHorizontal,
		PlusCircle,
		Search,
		ThumbsDown,
		ThumbsUp,
		User,
		Users,
		X
	} from 'lucide-svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { page } from '$app/stores';
	import { models } from '$lib/state.svelte.js';

	let { children, data } = $props();

	let popularTopics = $state(data.most_viewed.slice(0, 3));
	let images = $state([]);
	let error = $state();
	const convertToMB = (bytes) => {
		return (bytes / (1024 * 1024)).toFixed(0);
	};
	const handleFileChange = (event) => {
		for (const image of event.target.files) {
			if (convertToMB(image.size) < 50) {
				if (images.includes(image)) {
					error = 'You already chose chose this file ' + image.name;
				} else {
					images = [...images, image];
					error = null;
				}
			} else {
				error = 'Cannot upload files above 50MB';
			}
		}
		event.target.value = '';
	};
	async function handleSubmit(event) {
		event.preventDefault();
		isLoading = true;
		const formData = new FormData(event.target);

		if (images.length > 0) {
			error = '';
			// Append each file to the FormData object
			images.forEach((file, index) => {
				formData.append(`files[]`, file); // `files[]` ensures it's handled as an array on the server
			});
			// Send the FormData to the SvelteKit action using fetch
		}
		await fetch('/community?/addTopic', {
			method: 'POST',
			body: formData
		});
		//event.target.submit();
		location.reload();
	}
	let isLoading = $state(false);

	//for quizzes
	let quizzes = $state([]);
	const fetchQuizzes = async () => {
		try {
			const response = await fetch('/api/quiz/fetchQuizzes', {
				method: 'GET'
			});
			const res = await response.json();
			if (res.success) {
				quizzes = res.quizzes.filter((quiz) => moment(quiz.due).isAfter(moment()));
				models.context += 'Available Quizzes: ' + JSON.stringify(quizzes);
			}
		} catch (error) {
			console.error('Quiz fetch error:', error);
		} finally {
		}
	};

	onMount(() => {
		// Initial fetch
		fetchQuizzes();

		// Set up polling every 30 seconds
		const interval = setInterval(fetchQuizzes, 30000);

		// Clear interval on component unmount
		return () => clearInterval(interval);
	});
</script>

<main transition:slide class="flex min-h-screen divide-x bg-gray-200">
	<div class="hidden min-h-screen w-2/12 flex-col items-center bg-white p-2 text-black lg:flex">
		<ul class="menu min-h-full w-full space-y-1 p-2">
			<h2 class="menu-title text-primary border-b text-xl font-bold">Community</h2>
			<li>
				<a
					href="/community/search"
					class="navItem text-lg"
					class:selected={$page.url.pathname === '/community/search'}><Search /> Search</a
				>
			</li>
			<li>
				<a
					href="/community"
					class="navItem text-lg"
					data-sveltekit-preload-data
					class:selected={$page.url.pathname === '/community'}><Home /> Feed</a
				>
			</li>
			<li>
				<a
					class:selected={$page.url.pathname === '/community/quiz'}
					href="/community/quiz"
					class="navItem text-lg"
					><FileEdit />Quizzes
					<div class="badge badge-primary">{quizzes.length}</div></a
				>
			</li>

			<li>
				<a
					class:selected={$page.url.pathname === '/community/idea-generator'}
					href="/community/idea-generator"
					class="navItem text-lg"><Brain /> Idea Generator</a
				>
			</li>

			<li>
				<a
					class:selected={$page.url.pathname === '/community/leaderboard'}
					href="/community/leaderboard"
					class="navItem text-lg"><ChartColumnBig /> LeaderBoard</a
				>
			</li>

			{#if data.isLoggedIn}
				<li>
					<a
						class:selected={$page.url.pathname.includes('/community/opportunities')}
						href="/community/opportunities"
						class="navItem text-lg"><Users /> Opportunities</a
					>
				</li>
				<li>
					<a
						class:selected={$page.url.pathname === '/community/profile'}
						href="/community/profile"
						class="navItem text-lg"><User /> Profile</a
					>
				</li>
				<li>
					<button onclick={() => createModal.show()} class="btn btn-primary"
						><PlusCircle /> Create</button
					>
				</li>
			{:else}
				<li>
					<a
						href="/login"
						class="bg-primary hover:bg-primary/90 text-lg text-white hover:text-black"
						><LogIn />Login</a
					>
				</li>
			{/if}
		</ul>
	</div>

	<!-- Main Content -->
	<div
		class="mb-20 w-full overflow-auto overflow-x-hidden bg-white text-black lg:mb-10 lg:max-h-screen lg:flex-1 lg:p-4"
	>
		{@render children()}
	</div>

	<!-- Right Sidebar -->
	<div
		class="hidden min-h-screen w-64 flex-col items-center space-y-4 bg-white p-4 text-black lg:flex"
	>
		<div class="w-full space-y-4">
			<!-- Popular Topics -->
			<div class="space-y-3 rounded-lg border p-3">
				<h2 class="text-lg font-semibold text-black">Popular Topics</h2>
				{#each popularTopics as topic, index}
					<a
						href={`/community/topic/${topic.id}`}
						class="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100"
					>
						<span class="w-4 text-sm font-medium text-gray-500">{index + 1}.</span>
						<span class="flex-1 truncate text-base">{topic.topic}</span>
					</a>
				{/each}
			</div>
			<div class="space-y-3 rounded-lg border p-3">
				<h2 class="text-lg font-semibold text-black">Open Quizzes</h2>

				{#if quizzes.length == 0}
					<p class="text-gray-400">No quizzes for today😓</p>
				{/if}
				{#each quizzes as quiz}
					<a
						href={`/community/quiz/${quiz.id}`}
						class="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100"
					>
						<span class="truncate text-base">{quiz.title}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	<div
		class="dock fixed right-1 bottom-1 left-1 w-full rounded-2xl border-t bg-white py-2 shadow-lg lg:hidden"
	>
		<a
			href="/community"
			class:selected={$page.url.pathname === '/community'}
			data-sveltekit-preload-data
			class="hover:text-primary flex flex-col items-center text-sm text-gray-600 transition"
		>
			<Home class="h-5 w-5" />
			<span>Feed</span>
		</a>

		<a
			href="/community/search"
			class:selected={$page.url.pathname === '/community/search'}
			class="hover:text-primary flex flex-col items-center text-sm text-gray-600 transition"
		>
			<Search class="h-5 w-5" />
			<span>Search</span>
		</a>

		<button
			onclick={() => createModal.show()}
			class="text-primary flex flex-col items-center text-sm font-semibold"
		>
			<div class="bg-primary rounded-full p-2 text-white shadow-lg">
				<PlusCircle class="h-6 w-6" />
			</div>
			<span>Create</span>
		</button>

		<a
			href="/community/quiz"
			class:selected={$page.url.pathname === '/community/quiz'}
			class="hover:text-primary relative flex flex-col items-center text-sm text-gray-600 transition"
		>
			<div class="relative">
				<FileEdit />
				<span
					class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
				>
					{quizzes.length}
				</span>
			</div>
			<span>Quizzes</span>
		</a>

		<button
			onclick={() => moreModal.show()}
			class="hover:text-primary flex flex-col items-center text-sm text-gray-600 transition"
		>
			<MoreHorizontal class="h-5 w-5" />
			<span>More</span>
		</button>
	</div>
</main>
<!--Create modal FOR MOBILE-->
<dialog id="createModal" class="modal modal-bottom sm:modal-middle z-50">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Create</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn"><X />Close</button>
				</form>
			</div>
		</div>
		<div class="text-whte flex flex-col items-center p-2">
			<ul class="menu min-h-full w-full space-y-2 p-2">
				{#if data.isLoggedIn}
					<li>
						<a
							onclick={() => createModal.close()}
							class:selected={$page.url.pathname === '/community/leaderboard'}
							href="/community/create-topic"
							class="navItem flex text-lg"><MessageCircle /> Create a Topic</a
						>
					</li>
					<li>
						<a
							onclick={() => createModal.close()}
							href="/community/quiz/create"
							class="navItem text-lg"><FileEdit /> Create a Quiz</a
						>
					</li>

					<li>
						<a
							onclick={() => createModal.close()}
							class:selected={$page.url.pathname === '/community/idea-generator'}
							href="/community/opportunities/create"
							class="navItem text-lg"><Brain /> Post an opportunity</a
						>
					</li>
				{:else}
					<p>You need to login to create content</p>
					<li>
						<a href="/login" class="navItem flex text-lg">
							<LogIn class="h-5 w-5" />
							<span>Login</span>
						</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</dialog>
<!--Menu/More modal FOR MOBILE-->
<dialog id="moreModal" class="modal modal-bottom sm:modal-middle z-50">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">More links</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn"><X />Close</button>
				</form>
			</div>
		</div>
		<div class="text-whte flex flex-col items-center p-2">
			<ul class="menu min-h-full w-full space-y-2 p-2">
				<li>
					<a
						onclick={() => moreModal.close()}
						class:selected={$page.url.pathname === '/community/leaderboard'}
						href="/community/leaderboard"
						class="navItem flex text-lg"><ChartColumnBig /> LeaderBoard</a
					>
				</li>

				<li>
					<a
						onclick={() => moreModal.close()}
						class:selected={$page.url.pathname === '/community/opportunities'}
						href="/community/opportunities"
						class="navItem flex text-lg"
					>
						<Users class="h-5 w-5" />
						<span>Opportunities</span>
					</a>
				</li>

				<li>
					<a
						onclick={() => moreModal.close()}
						class:selected={$page.url.pathname === '/community/idea-generator'}
						href="/community/idea-generator"
						class="navItem text-lg"><Brain /> Idea Generator</a
					>
				</li>
				{#if data.isLoggedIn}
					<li>
						<a
							onclick={() => moreModal.close()}
							class:selected={$page.url.pathname === '/community/event-groups'}
							href="/community/event-groups"
							class="navItem text-lg"><Users /> Event Groups</a
						>
					</li>
					<li>
						<a
							onclick={() => moreModal.close()}
							class:selected={$page.url.pathname === '/community/ideas'}
							href="/community/ideas"
							class="navItem text-lg"><Lightbulb /> Saved ideas</a
						>
					</li>
					<li>
						<a
							onclick={() => moreModal.close()}
							class:selected={$page.url.pathname === '/community/profile'}
							href="/community/profile"
							class="navItem flex text-lg"
						>
							<User class="h-5 w-5" />
							<span>Profile</span>
						</a>
					</li>
				{:else}
					<li>
						<a onclick={() => moreModal.close()} href="/login" class="navItem flex text-lg">
							<LogIn class="h-5 w-5" />
							<span>Login</span>
						</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</dialog>

<style>
	@import 'tailwindcss';
	@plugin 'daisyui';
	.selected {
		@apply link-primary font-bold;
	}
</style>
