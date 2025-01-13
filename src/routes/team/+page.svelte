<script>
	let { data, form } = $props();
</script>

<title>Team | NWU Vaal GKSS </title>
<meta property="og:site_name" content="Team | NWU Vaal GKSS" />
<meta name="twitter:title" content="Team | NWU Vaal GKSS" />
<meta name="twitter:image:alt" content="Team | NWU Vaal GKSS" />
<meta property="title" content="Team" />
<div class="min-h-screen space-y-3 p-5">
	<h1 class="text-2xl font-bold text-white">Meet the team</h1>
	<div class="flex flex-col items-center justify-center gap-5 p-2 lg:grid lg:grid-cols-4">
		{#each data.team as team}
			<div class="card w-full rounded bg-white p-3 shadow-xl lg:w-[300px]">
				<figure>
					<img src={team.image} alt="member" class="lg:h-[400px]" />
				</figure>
				<div class="card-body px-0 text-black">
					<h2 class="card-title text-2xl text-red-600">{team.name} {team.surname}</h2>
					<p class=" text-lg">{team.role}</p>
					<div class="flex flex-col">
						<a href={`mailto:${team.email}`} class="link-hover text-sm">{team.email}</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
