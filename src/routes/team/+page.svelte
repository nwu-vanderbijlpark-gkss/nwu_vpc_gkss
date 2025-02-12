<script>
	let { data, form } = $props();
</script>

<title>Team | NWU Vaal GKSS</title>
<meta property="og:site_name" content="Team | NWU Vaal GKSS" />
<meta name="twitter:title" content="Team | NWU Vaal GKSS" />
<meta name="twitter:image:alt" content="Team | NWU Vaal GKSS" />
<meta property="title" content="Team" />

<div class="min-h-screen space-y-8 bg-gray-100 p-6">
	<h1 class="text-center text-4xl font-extrabold text-black">Meet the Team</h1>
	<div class="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each data.team as team}
			<div
				class="card transform overflow-hidden rounded-lg bg-white p-4 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
			>
				<figure class="relative">
					<img
						src={team.image}
						alt="member"
						class="h-[300px] w-full transform rounded-md object-cover transition duration-300 ease-in-out hover:scale-105"
					/>
				</figure>
				<div class="card-body p-4 text-black">
					<h2 class="card-title text-xl font-semibold text-red-600">{team.name} {team.surname}</h2>
					<p class="text-lg text-gray-700">{team.role}</p>
					<div class="mt-2 flex flex-col">
						<a
							href={`mailto:${team.email}`}
							class="link-hover text-sm text-blue-500 hover:text-blue-700">{team.email}</a
						>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
