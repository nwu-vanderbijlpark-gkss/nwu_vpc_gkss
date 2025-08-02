<script>
	import { User } from 'lucide-svelte';

	const judges = $state([
		{
			name: 'John Doe',
			email: 'johndoe@gmail.com'
		},
		{
			name: 'Kabza Maleu',
			email: 'kbxmel@gmail.com'
		},
		{
			name: 'Kabza MaleuLeeyyeyyeyeyey',
			email: 'kbxmeluuuuuuuuu@gmail.com'
		}
	]);
	//view state, initial Judges
	let view = $state('Judges');

	/**JUDGES*/
	//Judge form state
	const addJudgeForm = $state({
		name: '',
		email: '',
		clear: () => {
			addJudgeForm.name = '';
			addJudgeForm.email = '';
		}
	});
	const submitJudge = () => {
		judges.push(addJudgeForm);
		//TODO, send email to the judge
		addJudgeModal.close();
		addJudgeForm.clear();
	};

	/**JUDGING CRITERIA*/
	//the judging criteria array state
	const judgingCriteria = $state([
		{
			title: '',
			description: '',
			maxPoints: ''
		}
	]);

	//function to add a new criteria in the criteria array
	const addCriteria = () => {
		judgingCriteria.push({
			title: '',
			description: '',
			maxPoints: ''
		});
	};

	//used to send the criteria array to the database
	const publishCriteria = () => {
		localStorage.setItem('criteria', JSON.stringify(judgingCriteria));
	};
</script>

<section class="w-full space-y-4">
	<div class="flex w-full items-center justify-between">
		<h2 class="text-xl">
			{view} ({view == 'Judges' ? judges.length : judgingCriteria.length})
		</h2>
		<div>
			<p class="text-xs">View:</p>
			<select bind:value={view} class="select select-bordered bg-gray-100">
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
				<p class="py-4">The judge will be sent an email with login details</p>
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
			<button class="btn btn-primary" onclick={() => addJudgeModal.showModal()}>Add a Judge</button>
			{#each judges as judge}
				<button class="flex flex-col items-start rounded-lg border bg-gray-200 p-4 text-lg">
					<User />
					{judge.name}
					<p class="text-xs">{judge.email}</p>
				</button>
			{/each}
		</div>
	{:else}
		<!--Judging criteria-->
		<div class="space-y-2">
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
						bind:value={judgingCriteria[i].maxPoints}
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
</section>
