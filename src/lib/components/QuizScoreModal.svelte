<script>
	let { score, totalPoints, showScore, quiz, userAnswers } = $props();
</script>

{#if showScore}
	<!-- Slide-in Score Panel -->
	<div class="pointer-events-none fixed inset-0 z-50 flex justify-end">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="pointer-events-auto absolute inset-0 bg-black/50 backdrop-blur-sm"
			onclick={() => (showScore = false)}
		></div>

		<!-- Panel -->
		<div
			class="pointer-events-auto relative z-10 h-full w-full max-w-md translate-x-0 transform overflow-y-auto bg-base-200 p-6 shadow-xl transition-transform duration-300"
		>
			<h3 class="mb-4 text-xl font-bold text-white">Quiz Results</h3>

			<div class="mb-6 text-center">
				{#if Math.round((score / totalPoints) * 100) < 50}
					<div class="text-4xl font-bold text-primary">{score}/{totalPoints}</div>
					<div class="text-lg text-primary">
						({Math.round((score / totalPoints) * 100)}%)
					</div>
				{:else}
					<div class="text-4xl font-bold text-success">{score}/{totalPoints}</div>
					<div class="text-lg text-success">
						({Math.round((score / totalPoints) * 100)}%)
					</div>
				{/if}
			</div>

			<div class="divider"></div>

			<!-- Answers Review -->
			<div class="space-y-4 text-white">
				{#each quiz.quiz_questions as question, qi}
					<div class="rounded-lg border border-base-content/20 bg-base-100 p-4">
						<div class="mb-2 font-bold">{question.text}</div>
						<div class="mb-2 text-sm">
							Your answer: {userAnswers[qi] ?? 'No answer'}
						</div>
						<div class="text-sm font-medium">
							<!-- User's Answer -->
							<div
								class={userAnswers[qi]?.toLowerCase() ===
								(question.type === 'multipleChoice'
									? question.options[question.correctOption]?.toLowerCase()
									: question.correctAnswer?.toLowerCase())
									? 'text-success'
									: 'text-error'}
							>
								{userAnswers[qi]?.toLowerCase() ===
								(question.type === 'multipleChoice'
									? question.options[question.correctOption]?.toLowerCase()
									: question.correctAnswer?.toLowerCase())
									? '✅ Your answer is correct!'
									: `❌ Your answer is incorrect!`}
							</div>

							<!-- Correct Answer -->
							<div class="text-white">
								Correct answer:
								<span class="font-semibold text-success">
									{#if question.type === 'multipleChoice'}
										{question.options[question.correctOption]}
									{:else if question.type === 'trueFalse'}
										{question.correctAnswer ? 'true' : 'false'}
									{:else}
										{question.correctAnswer}
									{/if}
								</span>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-6 text-right">
				<button class="btn btn-sm" onclick={() => (showScore = false)}>Close</button>
			</div>
		</div>
	</div>
{/if}
