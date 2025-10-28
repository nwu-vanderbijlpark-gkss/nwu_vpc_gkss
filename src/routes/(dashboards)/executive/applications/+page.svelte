<script>
	import Seo from '$lib/components/SEO.svelte';
	import { Calendar, CheckCircle, Eye, Trash2, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import moment from 'moment';
	import { gkssConfig } from '$lib/config.ts';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { notifications } from '$lib/stores';

	let { data, form } = $props();

	let periods = $state(data.periods || []);
	let showCreateModal = $state(false);
	let newPeriod = $state({
		year: new Date().getFullYear(),
		open_date: '',
		close_date: ''
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		let { data: period, error } = await supabase
			.from('application_period')
			.insert(newPeriod)
			.select()
			.single();

		if (error) notifications.add({ type: 'error', message: error.message });

		showCreateModal = false;

		newPeriod = { year: new Date().getFullYear(), open_date: '', close_date: '' };

		notifications.add({ type: 'success', message: 'Application Document created successfully' });

		period = { ...period, applications: [] };
		periods.push(period);
	};
	const handleDelete = async (id) => {};
</script>

<Seo
	title="Manage Applications"
	desc="Review and manage applications for the {gkssConfig.name} executive team. Schedule interviews, accept, or reject applicants to build a vibrant student leadership community."
/>

<div transition:fly={{ y: 50, duration: 500 }} class="bg-base-100 min-h-screen p-4 sm:p-6">
	<!-- Header Section -->
	<div class="mb-8 flex flex-col items-center justify-between gap-4 lg:flex-row">
		<h1 class="text-base-content text-2xl font-semibold sm:text-3xl">Manage Applications</h1>
		<button class="btn btn-primary" onclick={() => (showCreateModal = true)}
			>Create Applications</button
		>
	</div>

	<!-- Periods Table -->
	<div class="bg-base-100 overflow-x-auto rounded-lg shadow-xl">
		<table class="text-base-content w-full text-left text-xs sm:text-sm">
			<thead class="bg-base-200 text-base-content/70 sticky top-0 z-10 text-xs uppercase">
				<tr>
					<th class="px-4 py-3 font-medium sm:px-6 sm:py-4">Name</th>
					<th class="px-4 py-3 font-medium sm:px-6 sm:py-4">Open date</th>
					<th class="px-4 py-3 font-medium sm:px-6 sm:py-4">Closing date</th>
					<th class="px-4 py-3 font-medium sm:px-6 sm:py-4">Applicants</th>
					<th class="px-4 py-3 text-center font-medium sm:px-6 sm:py-4">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each periods as period}
					<tr
						onclick={() => goto(`/executive/applications/${period.id}`)}
						class="hover:bg-base-200/50 cursor-pointer border-b transition-colors"
					>
						<td class="px-4 py-3 font-semibold sm:px-6 sm:py-4">
							Applications for {period.year}
						</td>
						<td class="max-w-[120px] truncate px-4 py-3 sm:max-w-[150px] sm:px-6 sm:py-4">
							{period.open_date}
						</td>
						<td class="max-w-[100px] truncate px-4 py-3 sm:px-6 sm:py-4">
							{period.close_date}
						</td>
						<td class="px-4 py-3 sm:px-6 sm:py-4">
							{period.applications.length}
						</td>
						<td class="px-4 py-3 sm:px-6 sm:py-4">
							<div class="flex flex-col justify-center gap-2 sm:flex-row">
								<button
									onclick={() => handleDelete(period.id)}
									class="btn btn-ghost btn-xs text-error sm:btn-sm"
								>
									<Trash2 class="mr-1 h-4 w-4" /> Delete
								</button>
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-4 py-3 sm:px-6 sm:py-4 text-center text-base-content/60">
							No application documents found.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Schedule Interview Modal -->
	{#if showCreateModal}
		<dialog class="modal modal-open modal-bottom sm:modal-middle">
			<div class="modal-box bg-base-100">
				<div class="flex items-center justify-between">
					<h3 class="text-base-content text-lg font-bold">Create application document</h3>
					<button class="" onclick={() => (showCreateModal = false)}>
						<X />
					</button>
				</div>
				<p>This is for applications for leadership positions</p>

				<form onsubmit={handleSubmit} class="mt-4 flex w-full flex-col gap-5">
					<label class="form-control w-full">
						<span class="label-text text-base-content font-medium">For Year</span>
						<input
							type="number"
							name="year"
							placeholder="Enter the year the applications are for"
							bind:value={newPeriod.year}
							class="input input-bordered"
							required
						/>
					</label>
					<label class="form-control w-full">
						<span class="label-text text-base-content font-medium">Open Date</span>
						<input
							type="date"
							name="open_date"
							bind:value={newPeriod.open_date}
							class="input input-bordered"
							required
						/>
					</label>
					<label class="form-control w-full">
						<span class="label-text text-base-content font-medium">Closing date</span>
						<input
							type="date"
							name="close_date"
							bind:value={newPeriod.close_date}
							class="input input-bordered"
							required
						/>
					</label>
					<button type="submit" class="btn btn-primary">Save Application Document</button>
				</form>
			</div>
		</dialog>
	{/if}
</div>

<style>
	@import 'tailwindcss';
	@plugin 'daisyui';
	table,
	td,
	tr,
	th,
	h1,
	h3 {
		@apply text-base-content;
	}
	.modal-box {
		@apply bg-base-100;
	}
	.input,
	.textarea {
		@apply transition-all duration-300;
	}
	.input:focus,
	.textarea:focus {
		@apply ring-primary ring-2;
	}
	/* Ensure table is compact but readable */
	table {
		min-width: 600px; /* Reduced to fit more screens */
	}
	/* Smooth scrollbar for mobile */
	.overflow-x-auto::-webkit-scrollbar {
		height: 8px;
	}
	.overflow-x-auto::-webkit-scrollbar-thumb {
		@apply bg-base-300 rounded-full;
	}
	.overflow-x-auto::-webkit-scrollbar-track {
		@apply bg-base-100;
	}
</style>
