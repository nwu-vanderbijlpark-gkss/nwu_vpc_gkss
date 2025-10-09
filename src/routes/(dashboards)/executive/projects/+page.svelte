<script>
	const projects = [
		{
			name: 'General 25',
			slug: 'general',
			description: 'The main project, daily project',
			is_complete: false,
			deadline: '31 Nov 2025',
			member: {
				name: 'Lethabo Maepa',
				email: 'lethabomaepa11@gmail.com'
			}
		},
		{
			name: 'Internal Hackathon 25',
			slug: 'internal-hackathon25',
			description: 'The internal hackathon project',
			is_complete: true,
			deadline: '22 Aug 2025',
			member: {
				name: 'Moses Motsoenyane',
				email: 'tevez11moses@gmail.com'
			}
		}
	];
</script>

<div class="overflow-auto p-5 lg:max-h-[90svh]">
	<h1 class="text-lg font-bold text-black">Projects</h1>

	<ul class="list space-y-2 rounded-box text-black">
		<li class="p-4 pb-2 text-sm tracking-wide opacity-60">
			These are the projects the committee are working on.
		</li>
		{#each projects as project}
			<a
				href="/executive/projects/{project.slug}"
				class="flex w-full flex-col rounded-lg bg-white p-2 hover:bg-gray-200"
			>
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-bold">{project.name}</h2>
					<p class="{project.is_complete ? 'text-success' : 'text-yellow-600'} text-sm">
						{project.is_complete ? 'Completed' : 'Pending'}
					</p>
				</div>

				<p>{project.description}</p>
				<div class="flex items-center justify-between">
					<p class="text-xs opacity-50">Created by {project.member.name}</p>
					<p class="text-sm">Deadline: {project.deadline}</p>
				</div>
			</a>
		{/each}
	</ul>
</div>
