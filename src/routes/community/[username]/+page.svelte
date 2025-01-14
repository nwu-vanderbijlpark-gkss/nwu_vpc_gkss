<script>
	import { ChartNoAxesColumn, CodeXml, Mail, PenBox, Star } from 'lucide-svelte';
	import NotFoundPage from '../../../components/NotFoundPage.svelte';
	let { data } = $props();
</script>

<title>{data.username} | NWU Vaal GKSS</title>
<meta property="og:site_name" content={`${data.username} | NWU Vaal GKSS`} />
<meta name="twitter:title" content={`${data.username} | NWU Vaal GKSS`} />
<meta name="twitter:image:alt" content={`${data.username} | NWU Vaal GKSS`} />
<meta property="title" content="User profile" />
<div class="min-h-screen pb-40">
	<div class="flex w-full flex-wrap gap-3 lg:flex-row">
		<span class="flex flex-col items-center lg:w-2/4">
			<img src={data.image} alt={data.username} class="h-[160px] w-[160px] rounded-full" />
			<h1 class="text-xl font-bold">{data.username}</h1>
		</span>
		<div class="p card space-y-2 border p-5 lg:w-2/5">
			<h1 class="text-lg font-bold">Engagement</h1>
			<hr />
			<span class="flex items-center justify-between">
				<span>
					<h1 class="text-xl font-bold">{data.topics.length}</h1>
					<p>Topics Created</p>
				</span>
				<PenBox />
			</span>
			<span class="flex items-center justify-between">
				<span>
					<h1 class="text-xl font-bold">489</h1>
					<p>Total topic views</p>
				</span>
				<ChartNoAxesColumn />
			</span>
			<span class="flex items-center justify-between">
				<span>
					<h1 class="text-xl font-bold">{data.projects.length}</h1>
					<p>Total Projects</p>
				</span>
				<CodeXml />
			</span>
			<span class="flex items-center justify-between">
				<span>
					<h1 class="text-xl font-bold">4.5</h1>
					<p>Average ProjectSpace rating</p>
				</span>
				<Star color="gold" fill="gold" />
			</span>
		</div>
	</div>
	<div role="tablist" class="tabs tabs-bordered">
		<input
			type="radio"
			name="my_tabs_2"
			role="tab"
			aria-label="Topics"
			checked="checked"
			class="tab font-bold text-black [--tab-bg:red]"
		/>
		<div role="tabpanel" class="tab-content rounded-box p-6">Topics</div>

		<input
			type="radio"
			name="my_tabs_2"
			role="tab"
			class="tab font-bold text-black [--tab-bg:red]"
			aria-label="Projects"
		/>
		<div role="tabpanel" class="tab-content rounded-box p-6">Projects</div>
	</div>
</div>
