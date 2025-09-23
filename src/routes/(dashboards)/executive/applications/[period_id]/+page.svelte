<script>
	import Seo from '$lib/components/SEO.svelte';
	import { ArrowLeft, Calendar, CheckCircle, Eye, Trash2, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import moment from 'moment';
	import { gkssConfig } from '$lib/config.ts';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	// Assume data.applications contains applicant data with structure:
	// { id, member: { name, surname, email }, role, message, status, interview_date, interview_time, interview_notes }
	let applications = $state(data.application_period.applications || []);

	// State for scheduling interview modal
	let showScheduleModal = $state(false);
	let selectedApplicant = $state(null);
	let interviewData = $state({
		timestamp: '',
		meeting_link: 'https://meet.jit.si/gkss-2026-interview',
		notes: ''
	});

	// State for details modal
	let showDetailsModal = $state(false);
	let selectedDetailsApplicant = $state(null);

	// Handle scheduling interview
	const handleScheduleInterview = (applicant) => {
		selectedApplicant = applicant;
		interviewData = {
			timestamp: applicant.interview_timestamp || '',
			meeting_link: applicant.interview_meeting_link || '',
			notes: applicant.interview_notes || ''
		};
		showScheduleModal = true;
	};

	// Submit interview schedule
	const handleScheduleSubmit = async (e) => {
		e.preventDefault();
		let data = selectedApplicant;
		data = {
			...data,
			timestamp: interviewData.timestamp,
			meeting_link: interviewData.meeting_link,
			interview_notes: interviewData.notes
		};
		await fetch('/api/ex/applications?interview=true', {
			method: 'PUT',
			body: JSON.stringify({
				data
			})
		}).then(() => {
			// Update local state
			applications = applications.map((app) =>
				app.id === selectedApplicant.id
					? {
							...app,
							interview_timestamp: interviewData.timestamp,
							interview_notes: interviewData.notes
						}
					: app
			);
			showScheduleModal = false;
			selectedApplicant = null;
			interviewData = { timestamp: '', meeting_link: '', notes: '' };
		});
	};

	// Handle accept/reject applicant
	const handleStatusUpdate = (applicantId, status) => {
		if (confirm(`Are you sure you want to ${status} this applicant?`)) {
			let data = applications.find((app) => app.id === applicantId);
			data = {
				...data,
				status: status
			};

			fetch('/api/ex/applications?status=true', {
				method: 'PUT',
				body: JSON.stringify({ data })
			}).then(() => {
				// Update local state
				applications = applications.map((app) =>
					app.id === applicantId ? { ...app, status } : app
				);
			});

			if (status == 'accepted') {
				//add to team
				const formData = new FormData();
				formData.append('role', data.role);
				formData.append('year', new Date().getFullYear());
				formData.append('member_id', data.member.id);
				formData.append('member', JSON.stringify(data.member));

				fetch('/executive/team?/addMember', {
					method: 'POST',
					body: formData
				});
			}
		}
	};

	// Handle view details
	const handleViewDetails = (applicant) => {
		selectedDetailsApplicant = applicant;
		showDetailsModal = true;
	};
</script>

<Seo
	title="Applications for {data.application_period.year}"
	desc="Review and Applications for {data.application_period
		.year} for the {gkssConfig.name} executive team. Schedule interviews, accept, or reject applicants to build a vibrant student leadership community."
/>

<div transition:fly={{ y: 50, duration: 500 }} class="min-h-screen bg-base-100 p-4 sm:p-6">
	<!-- Header Section -->
	<div class="mb-8 flex items-center justify-between">
		<h1 class="flex items-center text-2xl font-semibold text-base-content sm:text-3xl">
			<button class="btn text-sm" onclick={() => goto('/executive/applications')}
				><ArrowLeft />
			</button>
			Applications for {data.application_period.year}
		</h1>
	</div>

	<!-- Applications Table -->
	<div class="overflow-x-auto rounded-lg bg-base-100 shadow-xl">
		<table class="w-full text-left text-xs text-base-content sm:text-sm">
			<thead class="sticky top-0 z-10 bg-base-200 text-xs uppercase text-base-content/70">
				<tr>
					<th class="px-4 py-3 font-medium sm:px-6 sm:py-4">Name</th>
					<th class="px-4 py-3 font-medium sm:px-6 sm:py-4">Email</th>
					<th class="px-4 py-3 font-medium sm:px-6 sm:py-4">Role</th>
					<th class="px-4 py-3 font-medium sm:px-6 sm:py-4">Status</th>
					<th class="px-4 py-3 font-medium sm:px-6 sm:py-4">Interview</th>
					<th class="px-4 py-3 text-center font-medium sm:px-6 sm:py-4">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each applications as applicant}
					<tr class="border-b transition-colors hover:bg-base-200/50">
						<td class="px-4 py-3 font-semibold sm:px-6 sm:py-4">
							{applicant.member.name}
							{applicant.member.surname}
						</td>
						<td
							class="max-w-[120px] truncate px-4 py-3 sm:max-w-[150px] sm:px-6 sm:py-4"
							title={applicant.member.email}
						>
							{applicant.member.email}
						</td>
						<td class="max-w-[100px] truncate px-4 py-3 sm:px-6 sm:py-4" title={applicant.role}>
							{applicant.role}
						</td>
						<td class="px-4 py-3 sm:px-6 sm:py-4">
							<span
								class="badge {applicant.status === 'accepted'
									? 'badge-success'
									: applicant.status === 'rejected'
										? 'badge-error'
										: 'badge-warning'}"
							>
								{applicant.status || 'Pending'}
							</span>
						</td>
						<td class="px-4 py-3 sm:px-6 sm:py-4">
							{#if applicant.interview_timestamp}
								<span
									>{moment(applicant.interview_timestamp).format('MMMM D, YYYY [at] h:mm A')}</span
								>
							{:else}
								<span>No interview scheduled</span>
							{/if}
						</td>
						<td class="px-4 py-3 sm:px-6 sm:py-4">
							<div class="flex flex-col justify-center gap-2 sm:flex-row">
								<button
									onclick={() => handleViewDetails(applicant)}
									class="btn btn-ghost btn-xs sm:btn-sm"
								>
									<Eye class="mr-1 h-4 w-4" /> Details
								</button>
								<button
									onclick={() => handleScheduleInterview(applicant)}
									class="btn btn-ghost btn-xs sm:btn-sm"
									disabled={applicant.status === 'accepted' || applicant.status === 'rejected'}
								>
									<Calendar class="mr-1 h-4 w-4" /> Schedule
								</button>
								<button
									onclick={() => handleStatusUpdate(applicant.id, 'accepted')}
									class="btn btn-ghost btn-xs text-success sm:btn-sm"
									disabled={applicant.status === 'accepted' || applicant.status === 'rejected'}
								>
									<CheckCircle class="mr-1 h-4 w-4" /> Accept
								</button>
								<button
									onclick={() => handleStatusUpdate(applicant.id, 'rejected')}
									class="btn btn-ghost btn-xs text-error sm:btn-sm"
									disabled={applicant.status === 'accepted' || applicant.status === 'rejected'}
								>
									<Trash2 class="mr-1 h-4 w-4" /> Reject
								</button>
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-4 py-3 sm:px-6 sm:py-4 text-center text-base-content/60">
							No applications found.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Schedule Interview Modal -->
	{#if showScheduleModal}
		<dialog class="modal modal-open modal-bottom sm:modal-middle">
			<div class="modal-box bg-base-100">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-bold text-base-content">
						Schedule Interview for {selectedApplicant.member.name}
						{selectedApplicant.member.surname}
					</h3>
					<button onclick={() => (showScheduleModal = false)}>
						<X />
					</button>
				</div>
				<form onsubmit={handleScheduleSubmit} class="mt-4 flex w-full flex-col gap-5">
					<label class="form-control w-full">
						<span class="label-text font-medium text-base-content">Interview Date</span>
						<input
							type="datetime-local"
							name="interview_timestamp"
							bind:value={interviewData.timestamp}
							class="input input-bordered"
							required
						/>
					</label>
					<label class="form-control w-full">
						<span class="label-text font-medium text-base-content">Meeting link</span>
						<input
							type="url"
							name="Meeting Link"
							bind:value={interviewData.meeting_link}
							class="input input-bordered"
							placeholder="https://meet.jit.si/1234567890"
							required
						/>
					</label>
					<label class="form-control w-full">
						<span class="label-text font-medium text-base-content">Notes</span>
						<textarea
							name="interview_notes"
							bind:value={interviewData.notes}
							class="textarea textarea-bordered"
							placeholder="Add any notes for the interview"
						></textarea>
					</label>
					<button type="submit" class="btn btn-primary">Save Schedule</button>
				</form>
			</div>
		</dialog>
	{/if}

	<!-- Details Modal -->
	{#if showDetailsModal}
		<dialog class="modal modal-open modal-bottom sm:modal-middle">
			<div class="modal-box bg-base-100">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-bold text-base-content">
						Applicant Details: {selectedDetailsApplicant.member.name}
						{selectedDetailsApplicant.member.surname}
					</h3>
					<button onclick={() => (showDetailsModal = false)}>
						<X />
					</button>
				</div>
				<div class="mt-4 space-y-4">
					<p>
						<span class="font-medium">Name:</span>
						{selectedDetailsApplicant.member.name}
						{selectedDetailsApplicant.member.surname}
					</p>
					<p>
						<span class="font-medium">Email:</span>
						<a class="link link-primary" href="mailto:{selectedDetailsApplicant.member.email}"
							>{selectedDetailsApplicant.member.email}</a
						>
					</p>
					<p>
						<span class="font-medium">Whatsapp:</span>
						<a
							class="link link-primary"
							href="https://wa.me/{selectedDetailsApplicant.member.whatsapp}"
							>{selectedDetailsApplicant.member.whatsapp}</a
						>
					</p>
					<p><span class="font-medium">Preferred Role:</span> {selectedDetailsApplicant.role}</p>
					<p>
						<span class="font-medium">Interview:</span>
						{#if selectedDetailsApplicant.interview_date}
							<div>
								<span
									>{selectedDetailsApplicant.interview_date} at {selectedDetailsApplicant.interview_time}</span
								>
								<p class="text-sm text-base-content/60">
									{selectedDetailsApplicant.interview_notes}
								</p>
							</div>
						{:else}
							<span>No interview scheduled</span>
						{/if}
					</p>
				</div>
				<p>
					<span class="font-medium">Message:</span>
				</p>
				<p class="my-2 flex flex-col rounded-xl bg-base-200 p-5">
					{selectedDetailsApplicant.message}
				</p>
			</div>
		</dialog>
	{/if}

	<!-- Form Feedback -->
	{#if form?.success}
		<div class="alert alert-success mx-auto mt-4 max-w-2xl">
			<span>Action completed successfully!</span>
		</div>
	{:else if form?.error}
		<div class="alert alert-error mx-auto mt-4 max-w-2xl">
			<span>Error performing action. Please try again.</span>
		</div>
	{/if}
</div>

<style>
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
		@apply ring-2 ring-primary;
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
		@apply rounded-full bg-base-300;
	}
	.overflow-x-auto::-webkit-scrollbar-track {
		@apply bg-base-100;
	}
</style>
