<script>
	import Seo from '$lib/components/SEO.svelte';
	import { Github, Linkedin } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let { data, form } = $props();
	const spotlight = data.team[Math.floor(Math.random() * data.team.length)];
</script>

<Seo
	title="Team"
	image={spotlight.member.image}
	desc="Leader Spotlight: {spotlight.member.name} {spotlight.member
		.surname}, our {spotlight.role}, {spotlight.member.year_of_study} year {spotlight.member
		.qualification} student.
	Meet the dedicated team members of the NWU Vaal GKSS, committed to fostering a vibrant student community through events, workshops, and initiatives.
	The team: {data.team
		.map((member) => member.member.name + ' ' + member.member.surname + ' (' + member.role + ')')
		.join(', ')}"
/>

<div transition:fly class="min-h-screen space-y-8 bg-gray-100 p-6">
	<h1 class="text-center text-4xl font-extrabold text-black">Meet the Team</h1>
	<div class="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each data.team as team}
			<div
				class="card transform overflow-hidden rounded-lg bg-white p-4 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
			>
				<figure class="relative">
					<img
						src={team.member.image}
						alt="member"
						class="h-[300px] w-full transform rounded-md object-cover transition duration-300 ease-in-out hover:scale-105"
					/>
				</figure>
				<div class="card-body p-4 text-black">
					<h2 class="card-title text-xl font-semibold text-red-600">
						{team.member.name}
						{team.member.surname}
					</h2>
					<p class="text-lg text-gray-700">{team.role}</p>
					<div class="mt-2 flex flex-col">
						<a
							href={`mailto:${team.member.email}`}
							class="link-hover text-sm text-blue-500 hover:text-blue-700">{team.member.email}</a
						>
					</div>
					<div>
						{#if team.member.github}
							<div class="relative inline-block">
								<a
									href={team.member.github}
									target="_blank"
									onfocus={this.blur()}
									class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
								>
									<Github class="h-5 w-5 text-gray-800" />
								</a>
							</div>
						{/if}
						{#if team.member.linkedin}
							<div class="relative inline-block">
								<a
									href={team.member.linkedin}
									onfocus={this.blur()}
									target="_blank"
									class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
								>
									<Linkedin class="h-5 w-5 text-[#0A66C2]" />
								</a>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
