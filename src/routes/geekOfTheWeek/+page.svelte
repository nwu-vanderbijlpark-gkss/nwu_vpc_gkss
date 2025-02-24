<script>
	let { data } = $props();

	// Reactive state
	let tab = $state('all');
	let isLoading = $state(true);

	let geek = $state(
		data.members
			.filter((m) => m.name && m.username)
			.sort((a, b) => b.points - a.points)
			.slice(0, 1)[0]
	); //
</script>

<title>Geek of the Week ({geek.name} {geek.surname}) | NWU Vaal GKSS</title>
<meta property="og:site_name" content="Geek of the Week | NWU Vaal GKSS" />
<meta name="twitter:title" content="Geek of the Week | NWU Vaal GKSS" />
<meta name="twitter:image:alt" content="Geek of the Week | NWU Vaal GKSS" />
<meta property="title" content="Geek of the Week" />

<div class="min-h-screen bg-gray-100 p-10">
	<!-- Section Title -->
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold text-purple-600">Geek of the Week</h1>
		<p class="text-xl text-gray-700">
			Celebrating a standout Geekulcha member for their exceptional contributions to innovation and
			technology.
		</p>
	</div>

	<!-- Featured Geek Section -->
	<div class="mx-auto flex h-full w-full flex-col items-center rounded-lg bg-white p-8 shadow-lg">
		<!-- Geek's Picture -->
		<img
			src={geek.image}
			alt={`${geek.name} ${geek.surname}`}
			class="mb-6 h-[500px] w-full object-contain shadow-md"
		/>

		<!-- Geek's Name -->
		<h2 class="mb-2 text-2xl font-bold text-gray-800">{geek.name} {geek.surname}</h2>

		<!-- Geek's Accomplishments -->
		<p class="text-center text-lg text-gray-600">
			{geek.name}
			{geek.surname} earned this spot by actively participating in activities held by the gkss.
		</p>
	</div>
</div>
