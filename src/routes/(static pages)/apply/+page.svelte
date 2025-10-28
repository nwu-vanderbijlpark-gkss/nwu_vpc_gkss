<script>
	import { fly } from 'svelte/transition';
	import Seo from '$lib/components/SEO.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { gkssConfig } from '$lib/config.ts';

	let { data, form } = $props();

	let { roles, period, applicationsOpen, isLoggedIn, isExecutive } = data;

	// Form data
	let formData = $state({
		role: '',
		other_role: '',
		message: '',
		whatsapp: '0'
	});
	let isLoading = $state(false);

	const handleSubmit = async (e) => {
		// Form submission is handled by SvelteKit's form actions
		// This function can be used for additional client-side validation if needed
		e.preventDefault();
		isLoading = true;

		const data = new FormData();
		if (formData.role === 'Other') {
			data.append('role', formData.other_role);
		} else {
			data.append('role', formData.role);
		}
		data.append('period_id', period.id);
		data.append('message', formData.message);
		data.append('whatsapp', formData.whatsapp);

		const req = await fetch('/api/apply', {
			method: 'POST',
			body: data
		});
		const res = await req.json();

		if (req.ok) {
			form = { success: res.success };
			formData = { role: '', other_role: '', message: '' }; // Reset form
		} else {
			form = { error: res.error };
		}
		isLoading = false;
	};
</script>

<Seo
	title="Apply to Join {gkssConfig.name}"
	desc="Join the {gkssConfig.name}, a vibrant student society dedicated to fostering community, leadership, and innovation. Apply now to become a volunteer leader and make a difference!"
/>

<div transition:fly={{ y: 50, duration: 500 }} class="bg-base-100 min-h-screen p-6">
	<!-- Header Section -->
	<div class="mb-12 text-center">
		<h1 class="text-base-content mb-4 text-5xl font-extrabold">Join the Team as a Leader</h1>
		<p class="text-base-content/70 mx-auto max-w-2xl text-lg">
			Become a part of our passionate volunteer team dedicated to building a vibrant student
			community through events, workshops, and initiatives.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-20 lg:grid-cols-2">
		<!-- About the Society Section -->
		<div class="mx-auto mb-12 max-w-4xl">
			<div class="card bg-base-100 p-8 shadow-xl">
				<h2 class="text-primary mb-4 text-3xl font-bold">About {gkssConfig.name}</h2>
				<p class="text-base-content/80 mb-4">
					The {gkssConfig.name} is a dynamic student-led society at the {gkssConfig.institution}.
					Our mission is to foster a sense of community, promote leadership, and create
					opportunities for personal and professional growth through impactful events, workshops,
					and community outreach programs.
				</p>
				<p class="text-base-content/80 mb-4">
					As a volunteer-based society, all roles within GKSS are unpaid. Our members are driven by
					a passion for making a difference, collaborating with peers, and contributing to the
					vibrant student life at {gkssConfig.institution}. Joining us means becoming part of a
					supportive network committed to excellence and innovation.
				</p>
				<p class="text-base-content/80 font-semibold">
					Note: All positions are voluntary and unpaid, offering invaluable experience and the
					chance to shape our community.
				</p>
			</div>
		</div>

		{#if isLoggedIn && !isLoading && applicationsOpen && !isExecutive}
			<!-- Application Form -->
			<div class="mx-auto w-full max-w-2xl">
				<div class="card bg-base-100 p-8 shadow-xl">
					<h2 class="text-primary mb-6 text-3xl font-bold">Apply Now</h2>
					<form method="POST" onsubmit={handleSubmit} class="space-y-6">
						{#if form?.success}
							<div class="alert alert-success mt-4">
								<span>Application submitted successfully! We'll get back to you soon.</span>
							</div>
						{:else if form?.error}
							<div class="alert alert-error mt-4">
								<span>Error submitting application. Please try again.</span>
							</div>
						{/if}
						<div>
							<label for="role" class="label">
								<span class="label-text text-base-content font-medium">Preferred Role</span>
							</label>
							<select
								id="role"
								name="role"
								bind:value={formData.role}
								class="select select-bordered w-full"
								required
							>
								<option value="" disabled selected>Select a role</option>
								{#each roles as role}
									<option value={role}>{role}</option>
								{/each}
							</select>
							{#if formData.role === 'Other'}
								<input
									bind:value={formData.other_role}
									type="text"
									name="other_role"
									class="input input-bordered mt-2"
									id="other_role"
									placeholder="Please specify the role"
									required
								/>
							{/if}
						</div>
						<div>
							<label for="message" class="label">
								<span class="label-text text-base-content font-medium">Whatsapp Number</span>
							</label>
							<input
								type="tel"
								onkeydown={() => {
									formData.whatsapp = formData.whatsapp.replace(/[^0-9]/g, '');
								}}
								name="whatsapp_number"
								id="whatsapp_number"
								bind:value={formData.whatsapp}
								placeholder="0123456789"
								class="input input-bordered w-full"
								minlength="0"
								maxlength="10"
								required
							/>
						</div>
						<div>
							<label for="message" class="label">
								<span class="label-text text-base-content font-medium"
									>Why do you want to join?</span
								>
							</label>
							<textarea
								id="message"
								name="message"
								bind:value={formData.message}
								placeholder="Tell us about yourself and why you want to join as a leader"
								class="textarea textarea-bordered h-32 w-full"
								required
							></textarea>
						</div>
						<div class="text-center">
							<button type="submit" class="btn btn-primary btn-wide">Submit Application</button>
						</div>
					</form>
				</div>
			</div>
		{:else if isExecutive}
			<div class="mx-auto w-full max-w-2xl">
				<div class="card bg-base-100 p-8 shadow-xl">
					<h2 class="text-primary mb-4 text-3xl font-bold">You are already a leader</h2>
					<p class="text-base-content/80 mb-4">
						You are already a leader for {gkssConfig.name}. You cannot reapply, if you wish to be in
						the team again, talk to your team about it.
					</p>
				</div>
			</div>
		{:else if !applicationsOpen}
			<div class="mx-auto w-full max-w-2xl">
				<div class="card bg-base-100 p-8 shadow-xl">
					<h2 class="text-primary mb-4 text-3xl font-bold">Applications Closed</h2>
					<p class="text-base-content/80 mb-4">
						Applications for {gkssConfig.name} are currently closed. Please check back later for updates.
					</p>
				</div>
			</div>
		{:else if isLoading}
			<Loading text="Submitting your application" />
		{:else}
			<!-- Prompt to Log In -->

			<div class="mx-auto w-full max-w-2xl">
				<div class="card bg-base-100 p-8 text-center shadow-xl">
					<h2 class="text-primary mb-4 text-3xl font-bold">Please Log In to Apply</h2>
					<p class="text-base-content/80 mb-6">
						You need to be logged in to submit an application. Please log in or create an account if
						you don't have one.
					</p>
					<a href="/login" class="btn btn-primary btn-wide">Log In</a>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@import 'tailwindcss';
	@plugin 'daisyui';
	.card {
		@apply bg-base-100 overflow-hidden rounded-xl;
	}
	.card:hover {
		@apply shadow-2xl;
	}
	.input,
	.select,
	.textarea {
		@apply transition-all duration-300;
	}
	.input:focus,
	.select:focus,
	.textarea:focus {
		@apply ring-primary ring-2;
	}
</style>
