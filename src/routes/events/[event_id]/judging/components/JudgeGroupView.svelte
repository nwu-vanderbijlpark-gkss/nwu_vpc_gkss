<script>
	import TrixDisplay from '$lib/components/TrixDisplay.svelte';
	import { ArrowLeft, ArrowLeftCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const group = {
		name: 'HiInnovators',
		members: ['Lethabo Maepa', 'John Who', 'Ben Yet', 'Crazy Ben'],
		details: '<h1>These are our details and files</h1>'
	};

	let judgingCriteria = $state();
	onMount(() => {
		judgingCriteria = JSON.parse(localStorage.getItem('criteria'));
	});

	const handleSubmit = (e) => {
		e.preventDefault();
	};
</script>

<div class="w-full space-y-4 p-5">
	<div class="flex items-center gap-2">
		<button onclick={() => history.back()}> <ArrowLeft /> </button>
		<h2 class="text-xl font-bold">{group.name}</h2>
	</div>
	<div>
		<div class="divider">Details & files</div>
		<TrixDisplay content={group.details} />
	</div>

	<div class="divider">Judging criteria</div>
	<form onsubmit={handleSubmit} class="flex w-full flex-col items-start gap-2">
		{#each judgingCriteria as criteria}
			<div class="grid w-full grid-cols-3 items-center rounded-xl border-2 bg-gray-100 p-2">
				<div class=" col-span-2">
					<h3>{criteria.title}</h3>
					<p class="text-sm">
						{criteria.description}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<input
						type="number"
						min="0"
						max={Number(criteria.maxPoints)}
						name="points"
						placeholder="Points obtained"
						class="input bg-white"
					/>
					<p class="text-lg font-bold">/{criteria.maxPoints}</p>
				</div>
			</div>
		{/each}
		<button class="btn btn-primary w-full">Submit Results</button>
	</form>
</div>
