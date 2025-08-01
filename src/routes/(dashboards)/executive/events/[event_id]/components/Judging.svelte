<script>
	import { User } from 'lucide-svelte';

	const judges = [
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
	];

	let view = $state('Judges');
	const judgingCriteria = $state([
		{
			title: '',
			description: '',
			maxPoints: ''
		}
	]);

	const addCriteria = () => {
		judgingCriteria.push({
			title: '',
			description: '',
			maxPoints: ''
		});
	};
</script>

<section class="w-full space-y-4">
	<div class="flex w-full items-center justify-between">
		<h2 class="text-xl">
			{view} ({view == 'Judges' ? judges.length : judgingCriteria.length})
		</h2>
		<select bind:value={view} class="select select-bordered bg-gray-100">
			<option value="Judges">Judges</option>
			<option value="Judging Criteria">Judging criteria</option>
		</select>
	</div>
	{#if view == 'Judges'}
		<div class="flex w-full flex-wrap items-center gap-2">
			<button class="btn btn-primary">Invite a Judge</button>
			{#each judges as judge}
				<button class="flex flex-col items-start rounded-lg border bg-gray-200 p-4 text-lg">
					<User />
					{judge.name}
					<p class="text-xs">{judge.email}</p>
				</button>
			{/each}
		</div>
	{:else}
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
			<button class="btn btn-primary" onclick={addCriteria}>Add Criteria</button>
		</div>
	{/if}
</section>
