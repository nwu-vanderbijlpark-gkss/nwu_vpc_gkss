<script>
	import { enhance } from '$app/forms';
	import moment from 'moment';
	import { fade, fly, slide } from 'svelte/transition';
	import Loading from '../../../components/Loading.svelte';

	// Profile editing
	let isEditing = $state(false);
	let editedData = $state({ ...memberData });
	let { memberData } = $props();
	let member = $state(memberData);
	const handleProfileSave = () => {
		member = editedData;
		isEditing = false;
	};
	let isLoading = $state(false);
</script>

<!-- Profile content -->
<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="rounded-xl bg-white p-6 shadow-md"
>
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-2xl font-semibold text-base-100">Personal Information</h2>
		{#if !isEditing}
			<button class="btn btn-primary" onclick={() => (isEditing = true)}>Edit Profile</button>
		{/if}
	</div>

	{#if isEditing}
		{#if isLoading}
			<Loading />
		{:else}
			<form
				method="post"
				action="?/editProfile"
				class="grid grid-cols-1 gap-6 md:grid-cols-2"
				use:enhance={(form) => {
					isLoading = true;
					location.reload();
					form.onsubmit = () => {
						isLoading = true;
						location.reload();
					};
					form.onsuccess = () => {
						location.reload(); // Reload page after successful submission
					};
				}}
			>
				{#each [{ label: 'First Name', key: 'name' }, { label: 'Last Name', key: 'surname' }, { label: 'Date of Birth', key: 'date_of_birth', type: 'date' }, { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] }, { label: 'Qualification', key: 'qualification' }, { label: 'Year of Study', key: 'year_of_study', type: 'select', options: ['1st', '2nd', '3rd', '4th'] }] as field}
					<div>
						<label class="block text-sm font-medium text-gray-700">{field.label}</label>
						{#if field.type === 'select'}
							<select
								class="input input-bordered mt-1 w-full bg-gray-200"
								bind:value={editedData[field.key]}
								name={field.key}
								id={field.key}
							>
								{#each field.options as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
						{:else}
							<input
								type={field.type || 'text'}
								class="input input-bordered mt-1 w-full bg-gray-200"
								bind:value={editedData[field.key]}
								name={field.key}
								id={field.key}
							/>
						{/if}
					</div>
				{/each}

				<div class="flex justify-end space-x-4 md:col-span-2">
					<button class="btn-outline-primary btn" type="button" onclick={() => (isEditing = false)}
						>Cancel</button
					>
					<button class="btn btn-primary" type="submit">Save Changes</button>
				</div>
			</form>
		{/if}
	{:else}
		<div class="grid grid-cols-1 gap-6 text-base-200 md:grid-cols-2">
			{#each [{ label: 'First Name', value: member.name }, { label: 'Last Name', value: member.surname }, { label: 'Date of Birth', value: moment(member.date_of_birth).format('MMMM D, YYYY') }, { label: 'Gender', value: member.gender }, { label: 'Qualification', value: member.qualification }, { label: 'Year of Study', value: member.year_of_study }] as field}
				<div>
					<h3 class="text-sm font-medium text-gray-500">{field.label}</h3>
					<p class="mt-1">{field.value}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
