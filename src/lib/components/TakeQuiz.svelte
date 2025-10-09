<script>
	import { audioStore, notifications } from '$lib/stores';
	import moment from 'moment';
	import { onDestroy, onMount } from 'svelte';
	import QuizScoreModal from './QuizScoreModal.svelte';
	import { ChevronLeft, ChevronRight, LucideBadgeCheck } from 'lucide-svelte';

	let { quiz, alreadyCompleted, isAuthor } = $props();

	let userAnswers = $state({});
	let currentQuestion = $state(0);
	let showScore = $state(false);
	let score = $state(0);
	let remainingTime = $state(quiz?.time_limit ? Number(quiz?.time_limit) * 60 : 0); //if the time limit exists, make it in seconds
	let totalPoints = $state(0);

	const handleAnswer = (questionIndex, answer) => {
		userAnswers = { ...userAnswers, [questionIndex]: answer };
	};

	const calculateScore = async () => {
		if (userAnswers[0] == undefined) {
			alert('You need to answer the quiz first');
			return;
		}
		// Cleanup the countdown when the member sbmits the quiz
		if (countdownCleanup) countdownCleanup();
		let calculatedScore = 0;
		totalPoints = quiz.quiz_questions.reduce((acc, q) => acc + q.points, 0);

		quiz.quiz_questions.forEach((q, index) => {
			const userAnswer = userAnswers[index];
			if (userAnswers.length == index) return;
			switch (q.type) {
				case 'multipleChoice':
					if (userAnswer.toLowerCase() === q.options[q.correctOption].toLowerCase())
						calculatedScore += q.points;

					break;
				case 'shortAnswer':
					if (userAnswer?.toLowerCase() === q.correctAnswer.toLowerCase())
						calculatedScore += q.points;
					break;
				case 'trueFalse':
					if (userAnswer === q.correctAnswer);

					calculatedScore += q.points;
					break;
			}
		});

		score = calculatedScore;
		showScore = true;
		//break if user has already completed the quiz
		if (alreadyCompleted || isAuthor) {
			return;
		}
		alreadyCompleted = true;

		const response = await fetch('/api/quiz/submitQuizAttempt', {
			method: 'POST',
			body: JSON.stringify({ points: score, quiz_id: quiz.id })
		});

		let data = {
			subject: 'Quiz Submission',
			message: `You have attempted the following quiz: <b>${quiz.title}</b>,<br/>
		Your score: <b>${score} / ${totalPoints}</b><br/>Well Done👨🏿‍💻😊<br/>	`
		};

		const res = await fetch('/api/sendEmail', {
			method: 'POST',
			body: JSON.stringify({ data })
		});
		//send a notification
		notifications.add({
			type: 'success',
			message: 'Quiz submitted successfully!'
		});
		// Request permission
		function requestNotificationPermission() {
			if ('Notification' in window) {
				Notification.requestPermission().then((permission) => {
					if (permission === 'granted') {
					}
				});
			}
		}

		// Send browser notification
		function sendBrowserNotification(title, options) {
			if ('Notification' in window && Notification.permission === 'granted') {
				new Notification(title, options);
			}
		}

		// Usage
		requestNotificationPermission();
		sendBrowserNotification('Submission', {
			body: `Congrats on the submission of the quiz, your score ${score} / ${totalPoints}`,
			icon: '/logo.png'
		});
	};

	const handleNext = () => {
		if (currentQuestion < quiz.quiz_questions.length - 1) {
			currentQuestion++;
		}
	};

	const handlePrevious = () => {
		if (currentQuestion > 0) {
			currentQuestion--;
		}
	};
	let copyMessages = [
		'You are not allowed to copy this quiz👨🏿‍💻😊',
		"Whuu my lord🥺, don't cheat please🥺",
		"ChatGPT Master😓, we don't do that here🥺",
		'This is not efundi🥺',
		'Why?Why?Why?Why?🥺',
		'🥺Keo thuse?',
		"The quiz is not that hard, don't cheat.",
		"We understand🥺, but you can't copy this",
		"A whole Geek!! Don't copy to gpt"
	];
	let countdownCleanup = $state(null);

	let startCountdown = () => {
		if (quiz.time_limit && Number(quiz.time_limit) > 0) {
			let timeoutId;
			const interval = setInterval(() => {
				if (remainingTime === 0) {
					clearInterval(interval);
					timeoutId = setTimeout(() => {
						audioStore.playSound('/sounds/funny-no-time.mp3');
					}, 80000);
					alert('Time is up!');
					location = '/community/quiz';
				}
				if (remainingTime > 0) {
					remainingTime--;
				} else {
					clearInterval(interval);
				}
			}, 1000);
			// Cleanup function for this countdown
			return () => {
				clearInterval(interval);
				clearTimeout(timeoutId);
			};
		}
	};

	onMount(() => {
		introModal.showModal();
		const modalCheckInterval = setInterval(() => {
			if (!introModal.open) {
				// Start countdown and store cleanup function
				countdownCleanup = startCountdown();
				clearInterval(modalCheckInterval);
			}
		}, 1000);
		// Cleanup the modal check interval
		return () => clearInterval(modalCheckInterval);
	});

	onDestroy(() => {
		// Cleanup the countdown when component is destroyed
		if (countdownCleanup) countdownCleanup();
	});
</script>

<dialog id="introModal" class="modal h-screen w-screen">
	<div class="modal-box text-white">
		<h3 class="text-lg font-bold">{quiz.title}</h3>
		{#if isAuthor}
			<p class="py-4 text-red-500">
				You're the author of this quiz, so you cannot receive points if you attempt the quiz
			</p>
		{/if}
		{#if quiz?.time_limit && Number(quiz?.time_limit) > 0}
			<p class="py-4 text-red-500">This quiz has a time limit of {quiz?.time_limit} minutes</p>
		{/if}
		<p class="py-4">
			You may attempt this quiz unlimited number of times, but only the first attempt will be
			recorded
		</p>
		<p>This is quiz is due on {moment(quiz.due).format('MMMM Do YYYY, h:mm:ss a')}</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-primary">Proceed</button>
			</form>
		</div>
	</div>
</dialog>
<div
	class="container mx-auto max-w-3xl p-4"
	oncopy={(e) => {
		e.preventDefault();
		alert(copyMessages[Math.floor(Math.random() * copyMessages.length)]);
	}}
>
	{#if true}<!--- Trying to make everyone attempt the quiz always, but if they've already completed it, they won't get their score recorded -->
		<!-- Quiz Header -->
		<div class="mb-8 text-center">
			{#if quiz.time_limit && Number(quiz.time_limit) > 0}
				<div class="flex w-full items-center gap-2">
					<progress
						class="progress {(remainingTime / (quiz.time_limit * 60)) * 100 > 50
							? 'progress-success'
							: 'progress-primary'}  h-6 w-full text-black"
						value={(remainingTime / (quiz.time_limit * 60)) * 100}
						max="100"
					>
					</progress>
					<div
						class="mt-2 grid auto-cols-max grid-flow-col gap-5 rounded-box bg-gray-200 p-2 text-center"
					>
						<div class="flex flex-col">
							<span class="countdown font-mono text-lg">
								<span style={`--value: ${Math.floor(remainingTime / 60)}`}
									>{Math.floor(remainingTime / 60)}</span
								>
							</span>
							min
						</div>
						<div class="flex flex-col">
							<span class="countdown font-mono text-lg">
								<span style={`--value: ${remainingTime % 60}`}></span>
							</span>
							sec
						</div>
					</div>
				</div>
			{/if}
			<h1 class="mb-2 text-3xl font-bold">{quiz.title}</h1>
			<div
				class="unselectable text-sm text-gray-500"
				oncopy={(e) => {
					e.preventDefault();
					alert(copyMessages[Math.floor(Math.random() * copyMessages.length)]);
				}}
			>
				<div class="mx-auto max-w-sm overflow-hidden rounded-lg">
					<div class="px-5">
						<div class="h-2.5 w-full rounded-full bg-zinc-700">
							<div
								style="width: {((currentQuestion + 1) / quiz.quiz_questions.length) * 100}%"
								class="h-2.5 rounded-full bg-blue-600"
							></div>
						</div>
						<div class="mt-3 flex items-center justify-between">
							<span class="text-sm"
								>Question {currentQuestion + 1} of {quiz.quiz_questions.length}
							</span>
							<span class="animate-pulse text-sm"
								>{(((currentQuestion + 1) / quiz.quiz_questions.length) * 100).toFixed(1)}% Complete</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Questions -->
		{#each quiz.quiz_questions as question, qi}
			{#if qi === currentQuestion}
				<div class="card mb-6 w-full border">
					<div class="card-body">
						<!-- Question Text -->

						{#if question.image != 'none'}
							<h2 class="card-title mb-4 text-lg">{question.text}</h2>
							<img class="aspect-video h-[200px]" src={question.image} alt={`Question-${qi}`} />
						{:else}
							<h2 class="mb-4 text-lg">{question.text}</h2>
						{/if}

						<!-- Multiple Choice -->
						{#if question.type === 'multipleChoice'}
							<div class="space-y-2">
								{#each question.options as option, oi}
									<label
										class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-200"
									>
										<input
											type="radio"
											name="options-{oi}"
											class="radio-primary radio"
											checked={userAnswers[qi] === option}
											onchange={() => handleAnswer(qi, option)}
										/>
										<span>{option}</span>
									</label>
								{/each}
							</div>

							<!-- True/False -->
						{:else if question.type === 'trueFalse'}
							<div class="flex flex-col gap-4 rounded-lg border p-4">
								<label class="flex items-center gap-2">
									<input
										type="radio"
										name={`tf-${qi}`}
										class="radio-primary radio"
										checked={userAnswers[qi] === true}
										onchange={() => handleAnswer(qi, true)}
									/>
									True
								</label>
								<label class="flex items-center gap-2">
									<input
										type="radio"
										name={`tf-${qi}`}
										class="radio-primary radio"
										checked={userAnswers[qi] === false}
										onchange={() => handleAnswer(qi, false)}
									/>
									False
								</label>
							</div>

							<!-- Short Answer -->
						{:else}
							<div class="form-control">
								<textarea
									class="textarea textarea-bordered bg-gray-100"
									placeholder="Type your answer here"
									bind:value={userAnswers[qi]}
								></textarea>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		{/each}

		<!-- Navigation Controls -->
		<div class="mt-6 flex justify-between">
			<button
				class="btn btn-outline bg-gray-100 text-black"
				onclick={handlePrevious}
				disabled={currentQuestion === 0}
			>
				<ChevronLeft /> Previous
			</button>

			{#if currentQuestion === quiz.quiz_questions.length - 1}
				<button class="btn btn-primary" onclick={calculateScore}>
					Submit Quiz <LucideBadgeCheck />
				</button>
			{:else}
				<button class="btn btn-primary" onclick={handleNext}> Next <ChevronRight /></button>
			{/if}
		</div>
		<QuizScoreModal {score} {totalPoints} {showScore} {quiz} {userAnswers} />
	{/if}
</div>

<style>
	.unselectable {
		user-select: none; /* Standard syntax */
		-webkit-user-select: none; /* Safari/Chrome */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* IE/Edge */
	}
</style>
