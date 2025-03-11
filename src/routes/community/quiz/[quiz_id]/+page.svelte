<script>
	import { LogIn } from 'lucide-svelte';
	import TakeQuiz from '../../../../components/TakeQuiz.svelte';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte'; // or framework equivalent

	import moment from 'moment';
	let { data } = $props();
	let quiz = $state(data.quiz);
	function shuffleQuestions() {
		const questions = [...quiz.quiz_questions];
		for (let i = questions.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[questions[i], questions[j]] = [questions[j], questions[i]];
		}
		quiz.quiz_questions = questions;
	}
	if (!data.error) {
		shuffleQuestions();
	}
	let alreadyCompleted = $state(data.alreadyCompleted);

	let intervalId = $state();
	let isClosed = $state(false);

	const checkDueTime = () => {
		// Add safety checks
		if (!quiz || alreadyCompleted) return;

		// Compare using time range rather than exact match

		// More realistic comparison (with buffer)
		if (moment(quiz.due).isSameOrBefore(moment())) {
			// Clear interval immediately
			isClosed = true;
			alreadyCompleted = true;

			clearInterval(intervalId);
			// Update state before navigation
		}
	};

	onMount(() => {
		// Check immediately first
		checkDueTime();

		// Set interval with cleanup
		intervalId = setInterval(checkDueTime, 1000 * 15); // 15 seconds is better
	});

	// Critical: Clear interval on component unmount
	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<title>{quiz ? quiz.title : 'Quiz'} | NWU Vaal GKSS</title>
{#if data.isLoggedIn}
	{#if isClosed}
		<div class="flex min-h-screen items-center justify-center">
			<div class="alert alert-warning mx-auto max-w-md animate-pulse">
				<div class="flex items-center gap-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					<div>
						<h3 class="text-lg font-bold">Time's up! ⏳</h3>
						<p class="text-sm">
							This quiz has officially closed. Stay tuned for more challenges! 🚀
						</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<TakeQuiz {alreadyCompleted} {quiz} />
	{/if}
{:else}
	<div class="rounded-xl border-2 border-dashed p-8 text-center">
		<div class="mx-auto max-w-xs space-y-4">
			<LogIn class="mx-auto h-12 w-12 text-primary" />
			<h4 class="text-xl font-semibold">Join the Community</h4>
			<p class="mb-4 text-gray-600">Sign in to be able to take quizzes</p>
			<a href="/login" class="btn btn-primary w-full gap-2">
				<LogIn class="h-5 w-5" />
				Login to Continue
			</a>
		</div>
	</div>
{/if}
