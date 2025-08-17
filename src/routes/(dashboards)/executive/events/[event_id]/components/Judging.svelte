<script>
	import Loading from '$lib/components/Loading.svelte';
	import { text } from '@sveltejs/kit';
	import { User } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { event } = $props();
	let judges = $state([]);
	//view state, initial Judges
	let view = $state('Judges');

	let isLoading = $state(true);

	/**JUDGES*/
	//Judge form state
	const addJudgeForm = $state({
		name: '',
		email: '',
		clear: () => {
			addJudgeForm.name = '';
			addJudgeForm.email = '';
		},
		event: event
	});
	const submitJudge = async () => {
		isLoading = true;
		judges.push(addJudgeForm);
		await fetch('/api/event/judge', {
			method: 'POST',
			body: JSON.stringify({ data: addJudgeForm })
		});
		//TODO, send email to the judge
		//addJudgeModal.close();
		addJudgeForm.clear();
		await getData();
	};

	/**JUDGING CRITERIA*/
	//the judging criteria array state
	let judgingCriteria = $state([
		{
			id: crypto.randomUUID(),
			title: '',
			description: '',
			max_points: '',
			event_id: event.id
		}
	]);

	//function to add a new criteria in the criteria array
	const addCriteria = () => {
		judgingCriteria.push({
			id: crypto.randomUUID(),
			title: '',
			description: '',
			max_points: '',
			event_id: event.id
		});
	};

	//used to send the criteria array to the database
	const publishCriteria = async () => {
		isLoading = true;
		localStorage.setItem('criteria', JSON.stringify(judgingCriteria));

		await fetch('/api/event/criteria', {
			method: 'POST',
			body: JSON.stringify({ data: judgingCriteria })
		});

		await getData();
	};

	//used for getting data onmount and when a new item has been added
	const getData = async () => {
		isLoading = true;
		//get the judges and judging criteria
		const judgesPromise = await fetch('/api/event/judge?event=' + event.id);
		const criteriaPromise = await fetch('/api/event/criteria?event=' + event.id);
		const [judgesResponse, criteriaResponse] = await Promise.all([judgesPromise, criteriaPromise]);
		const judgeRes = await judgesResponse.json();
		const critRes = await criteriaResponse.json();

		if (judgeRes.success) {
			judges = judgeRes.data;
		}

		if (critRes.success && critRes.data.length) {
			judgingCriteria = critRes.data;
		}
		isLoading = false;
	};

	onMount(async () => {
		await getData();
	});
</script>

<section class="w-full space-y-4">
	{#if isLoading}
		<Loading text="Loading Please wait..." />
	{:else}
		<div class="flex w-full flex-col items-center justify-between lg:flex-row">
			<h2 class="text-xl">
				{view} ({view == 'Judges' ? judges.length : judgingCriteria.length})
			</h2>
			<div class="w-full lg:w-fit">
				<p class="text-xs">View:</p>
				<select bind:value={view} class="select select-bordered w-full bg-gray-100">
					<option value="Judges">Judges</option>
					<option value="Judging Criteria">Judging criteria</option>
				</select>
			</div>
		</div>
		{#if view == 'Judges'}
			<!-- Add Judge Modal -->
			<dialog id="addJudgeModal" class="modal">
				<div class="modal-box bg-gray-50">
					<h3 class="text-lg font-bold">Add Judge</h3>
					<p class="py-4">The judge will be sent an email with a link to the judging portal</p>
					<label class="form-control w-full">
						<p>Full Name</p>
						<input
							type="text"
							name="judgeName"
							class="input input-bordered border-2 bg-gray-200"
							id="judgeName"
							placeholder="The full name of the judge"
							bind:value={addJudgeForm.name}
						/>
					</label>
					<label class="form-control w-full">
						<p>Email</p>
						<input
							type="email"
							name="judgeEmail"
							class="input input-bordered border-2 bg-gray-200"
							id="judgeEmail"
							placeholder="The email used for inviting the judge"
							bind:value={addJudgeForm.email}
						/>
					</label>
					<div class="modal-action grid w-full grid-cols-2">
						<form method="dialog" class="w-full">
							<button class="btn w-full">Cancel</button>
						</form>
						<button class="btn btn-primary" onclick={submitJudge}>Add</button>
					</div>
				</div>
			</dialog>
			<!--Add judge button and the judges-->
			<div class="flex w-full flex-wrap items-center gap-2">
				<button class="btn btn-primary" onclick={() => addJudgeModal.showModal()}
					>Add a Judge</button
				>
				{#each judges as judge}
					<button class="flex flex-col items-start rounded-lg border bg-gray-200 p-4 text-lg">
						<User />
						{judge.fullname}
						<p class="text-xs">{judge.email}</p>
					</button>
				{/each}
			</div>
		{:else}
			<!--Judging criteria-->
			<div class="space-y-2 divide-y">
				{#each judgingCriteria as criteria, i}
					<div class="flex flex-col gap-2">
						<p>Criteria {i + 1}</p>
						<input
							type="text"
							bind:value={judgingCriteria[i].title}
							name="title_{i}"
							class="input input-bordered bg-gray-200"
							placeholder="Criteria"
						/>
						<textarea
							bind:value={judgingCriteria[i].description}
							name="description_{i}"
							class="textarea textarea-bordered bg-gray-200"
							placeholder="Describe this criteria"
						></textarea>
						<input
							type="number"
							bind:value={judgingCriteria[i].max_points}
							name="maxPoints_{i}"
							class="input input-bordered bg-gray-200"
							placeholder="Max points for this criteria"
						/>
					</div>
				{/each}
				<button class="btn-bordered btn" onclick={addCriteria}>Add Criteria</button>
				<button class="btn btn-primary" onclick={publishCriteria}>Publish Judging Criteria</button>
			</div>
		{/if}
	{/if}
</section>
