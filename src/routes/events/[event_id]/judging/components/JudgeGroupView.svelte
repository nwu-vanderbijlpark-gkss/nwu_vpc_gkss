<script>
	import { page } from '$app/stores';
	import TrixDisplay from '$lib/components/TrixDisplay.svelte';
	import { ArrowLeft, ArrowLeftCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { group = $bindable(), info = $bindable(), judgingCriteria, judge } = $props();

	const results = $state(
		judgingCriteria.map((criteria) => {
			return {
				criteria_id: criteria.id || '',
				points: '',
				event_id: criteria.event_id || '',
				group_id: group.id || '',
				judge_id: judge.id
			};
		})
	);

	const handleSubmit = async (e) => {
		info.show();
		e.preventDefault();
		const req = await fetch('/api/event/group/result', {
			method: 'POST',
			body: JSON.stringify({ data: results })
		});
		const res = await req.json();

		info.hide();
		if (res.success) {
			info.show(
				'Results submitted successfully',
				'Please wait while we take you to choose another group...'
			);

			window.location.href = $page.url.pathname; //go to the root without searchParams
		} else {
			info.show('Failed to submit results', 'Please try again later');
		}
	};
</script>

<div class="w-full space-y-4 p-5">
	<div class="flex items-center gap-2">
		<button onclick={() => history.back()}> <ArrowLeft /> </button>
		<h2 class="text-xl font-bold">{group.name}</h2>
	</div>
	<div>
		<div class="divider">Details & files</div>
		<TrixDisplay content={group.submission} />
	</div>

	<div class="divider">Judging criteria</div>
	<form onsubmit={handleSubmit} class="flex w-full flex-col items-start gap-2">
		{#each judgingCriteria as criteria, i}
			<div class="grid w-full grid-cols-3 items-center rounded-xl border-2 bg-gray-100 p-2">
				<div class=" col-span-2">
					<h3>{criteria.title}</h3>
					<p class="overflow-clip whitespace-pre-wrap text-sm">
						{criteria.description}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<input
						type="number"
						min="0"
						max={Number(criteria.max_points)}
						name="points"
						placeholder="Points obtained"
						class="input bg-white"
						bind:value={results[i].points}
					/>
					<p class="text-lg font-bold">/{criteria.max_points}</p>
				</div>
			</div>
		{/each}
		<button class="btn btn-primary w-full">Submit Results</button>
	</form>
</div>
