<script>
	import { LogIn, PenSquare } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import Loading from '$lib/components/Loading.svelte';
	import { notifications } from '$lib/stores';
	import Seo from '$lib/components/SEO.svelte';

	let { data } = $props();
	let isLoading = $state(false);
	let isSuccess = $state(false);
	let opportunity = $state({ type: '', title: '', content: '', organization: '', deadline: '' });
	let editorValue = $state(
		'The <em><strong>opportunity links and information</strong></em> must be added here.'
	);
	let errors = $state({ title: null, type: null, content: null, organization: '', deadline: '' });
	const handleSubmit = async () => {
		errors.title = '';
		errors.type = '';
		errors.content = '';
		errors.organization = '';
		errors.deadline = 'unknown';
		isLoading = true;
		opportunity.content = document.getElementById('editorValue').value;

		if (
			!opportunity.title.length ||
			!opportunity.type.length ||
			!opportunity.content.length ||
			!opportunity.organization.length
		) {
			if (navigator.vibrate) {
				navigator.vibrate(200);
			}
			if (!opportunity.title.length) {
				errors.title = 'Please add title';
			}
			if (!opportunity.organization.length) {
				errors.organization = 'Please add organization';
			}
			if (!opportunity.type.length) {
				errors.type = 'Please choose opportunity type';
			}
			if (!opportunity.content.length) {
				errors.content = 'Please add more information about this opportunity';
			}
			isLoading = false;
			return;
		}
		//the contents of the trix editor are in the hidden element with id "editorValue"
		const res = await fetch('/api/opportunity/create', {
			method: 'POST',
			body: JSON.stringify({ opportunity })
		});
		const response = await res.json();
		if (response.success) {
			notifications.add({
				type: 'success',
				message: `Opportunity posted successfully!, you have been awarded +50 points, new points: ${response.newPts}`
			});
			isSuccess = true;
			opportunity = { type: '', title: '', content: '' };
			editorValue =
				'The <em><strong>opportunity links and information</strong></em> must be added here.';
		} else {
		}
		isLoading = false;
	};
</script>

<Seo
	title="Add Opportunity"
	desc="Share bursaries, internships, free online courses and many more with the community."
/>

{#if isLoading}
	<Loading text="Posting this opportunity..." />
{:else if isSuccess}
	<div class="card mx-auto mt-8 max-w-md bg-base-100 text-white shadow-lg">
		<div class="card-body">
			<h2 class="card-title">Opportunity Posted</h2>
			<p>Opportunity posted successfully</p>
			<div class="card-actions justify-end">
				<a href="/community/opportunities" class="btn btn-primary">Go to Opportunities</a>
				<button onclick={() => (isSuccess = false)} class="btn btn-outline"
					>Post another opportunity</button
				>
			</div>
		</div>
	</div>
{:else if !data.isLoggedIn}
	<div class="rounded-xl border-2 border-dashed p-8 text-center">
		<div class="mx-auto max-w-xs space-y-4">
			<LogIn class="mx-auto h-12 w-12 text-primary" />
			<h4 class="text-xl font-semibold">Join the Community</h4>
			<p class="mb-4 text-gray-600">
				Sign in to share your knowledge and engage with the community
			</p>
			<a href="/login" class="btn btn-primary w-full gap-2">
				<LogIn class="h-5 w-5" />
				Login to Continue
			</a>
		</div>
	</div>
{:else}
	<div
		in:fly={{ x: 100, duration: 400 }}
		out:fade={{ duration: 300 }}
		class="container mx-auto p-4"
	>
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<span>
				<h1 class="text-3xl font-bold text-black">Add an Opportunity</h1>
				<p>Bursaries, internships, free online courses and many more</p>
			</span>
		</div>
		<div>
			<div class="space-y-2">
				<label for="title" class="block font-medium text-gray-700">
					Opportunity Title
					<span class="text-error">*</span>
				</label>
				<input
					type="text"
					name="title"
					required
					bind:value={opportunity.title}
					onkeydown={() => {
						if (opportunity.title.length) {
							errors.title = '';
						}
					}}
					placeholder="e.g. AWS Internship"
					class="input input-bordered w-full bg-gray-100 focus:ring-2 focus:ring-primary"
				/>
				<p class="text-sm text-error">{errors.title || ''}</p>
			</div>
			<div class="space-y-2">
				<label for="organization" class="block font-medium text-gray-700">
					Organization
					<span class="text-error">*</span>
				</label>
				<input
					type="text"
					name="organization"
					required
					bind:value={opportunity.organization}
					onkeydown={() => {
						if (opportunity.organization.length) {
							errors.organization = '';
						}
					}}
					placeholder="e.g. Amazon"
					class="input input-bordered w-full bg-gray-100 focus:ring-2 focus:ring-primary"
				/>
				<p class="text-sm text-error">{errors.organization || ''}</p>
			</div>
			<div class="space-y-2">
				<label for="title" class="block font-medium text-gray-700">
					Opportunity deadline
					<span class="text-error">*</span>
				</label>
				<input
					type="date"
					name="deadline"
					required
					bind:value={opportunity.deadline}
					placeholder="Deadline"
					class="input input-bordered w-full bg-gray-100 focus:ring-2 focus:ring-primary"
				/>
				<p class="text-sm text-info">Leave deadline blank if unknown</p>
			</div>
			<div class="space-y-2">
				<label for="topic" class="block font-medium text-gray-700">
					Opportunity type
					<span class="text-error">*</span>
				</label>
				<select
					bind:value={opportunity.type}
					type="text"
					name="topic"
					onchange={() => {
						if (opportunity.type.length) {
							errors.type = '';
						}
					}}
					required
					placeholder="e.g. Best study techniques for finals"
					class="select select-bordered w-full bg-gray-100 focus:ring-2 focus:ring-primary"
				>
					<option disabled selected>Select an opportunity type</option>

					<optgroup label="Academic">
						<option>Scholarship</option>
						<option>Bursary</option>
					</optgroup>

					<optgroup label="Career">
						<option>Internship</option>
						<option>Part-time Job</option>
						<option>Graduate Program</option>
					</optgroup>

					<optgroup label="Skills & Development">
						<option>Workshop / Training</option>
						<option>Hackathon</option>
						<option>Mentorship Program</option>
					</optgroup>

					<optgroup label="Funding & Competitions">
						<option>Pitch Competition</option>
						<option>Creative Contest</option>
						<option>Funding Opportunity</option>
					</optgroup>

					<optgroup label="Campus & Community">
						<option>Volunteering</option>
						<option>Leadership Role</option>
						<option>Student Club Opportunity</option>
					</optgroup>

					<optgroup label="Other">
						<option>General Announcement</option>
						<option>Call for Collaboration</option>
						<option>Open Project</option>
					</optgroup>
				</select>
				<p class="text-sm text-error">{errors.type || ''}</p>
			</div>
			<div class="space-y-2">
				<label for="title" class="block font-medium text-gray-700">
					Content
					<span class="text-error">*</span>
				</label>
				<main>
					<trix-toolbar id="my_toolbar"></trix-toolbar>
					<input
						onchange={() => alert(editorValue)}
						id="editorValue"
						bind:value={editorValue}
						type="hidden"
						name="content"
					/>
					<trix-editor toolbar="my_toolbar" input="editorValue"></trix-editor>
				</main>
				<p class="text-sm text-error">{errors.content || ''}</p>
			</div>
			<button type="button" onclick={handleSubmit} class="btn btn-primary my-2 w-full">
				Submit
			</button>
		</div>
	</div>
{/if}

<style>
	trix-editor {
		min-height: 200px;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		padding: 1rem;
	}

	trix-editor :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	trix-editor :global(blockquote) {
		@apply border-l-4 border-gray-300 pl-4 italic text-gray-600;
	}

	trix-editor :global(pre) {
		@apply rounded bg-gray-100 p-2 font-mono text-sm;
	}

	trix-editor :global(a) {
		@apply text-blue-600 underline;
	}

	trix-editor :global(ul) {
		@apply list-inside list-disc;
	}

	trix-editor :global(ol) {
		@apply list-inside list-decimal;
	}
</style>
