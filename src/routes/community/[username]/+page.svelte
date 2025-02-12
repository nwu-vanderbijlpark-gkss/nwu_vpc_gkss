<script>
	import { ChartNoAxesColumn, CodeXml, Mail, PenBox, Star, Stars, Trash } from 'lucide-svelte';
	import NotFoundPage from '../../../components/NotFoundPage.svelte';
	import Topic from '../../../components/Topic.svelte';
	import Project from '../../../components/Project.svelte';
	import { onMount } from 'svelte';
	let { data } = $props();
	let myProfile = $state(false);
	let username = $state('');
	onMount(() => {
		myProfile = location.pathname.includes('profile');
		username = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
	});
	let topics = $state(data.topics);
	const deleteTopic = async (topic, index) => {
		if (confirm("Delete topic: '" + topic.topic + "'?")) {
			const formData = new FormData();
			formData.append('id', topic.id);
			await fetch('/community?/deleteTopic', {
				method: 'POST',
				body: formData
			});
			topics.splice(index, 1);
		}
	};
</script>

{#if data.notFound}
	<NotFoundPage
		title="User not found"
		homeUrl="/community"
		message={`Sorry, this user '@${username}' does not exist, please try again later or return to home`}
	/>
{:else}
	<title>{data.username} | NWU Vaal GKSS</title>
	<meta property="og:site_name" content={`${data.username} | NWU Vaal GKSS`} />
	<meta name="twitter:title" content={`${data.username} | NWU Vaal GKSS`} />
	<meta name="twitter:image:alt" content={`${data.username} | NWU Vaal GKSS`} />
	<meta property="title" content="User profile" />
	<div class="min-h-screen pb-40">
		<div class="flex w-full flex-wrap gap-3 lg:flex-row">
			<span class="flex flex-col items-center lg:w-2/4">
				<img src={data.image} alt={data.username} class="h-[160px] w-[160px] rounded-full" />
				{#if !data.fullName.includes('null')}<h1 class="text-xl font-bold">{data.fullName}</h1>{/if}
				<h2 class="">@{data.username}</h2>
			</span>
			<div class="p card w-full space-y-2 border p-5 lg:w-2/5">
				<h1 class="text-lg font-bold">Contribution</h1>
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
						<h1 class="text-xl font-bold">{data.user_views}</h1>
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
						<h1 class="text-xl font-bold">{data.user_rating.toFixed(1) || 0.0}</h1>
						<p>Average ProjectSpace rating</p>
					</span>
					<Stars />
				</span>
			</div>
		</div>
		<div role="tablist" class="tabs tabs-lifted w-full">
			<input
				type="radio"
				name="my_tabs_2"
				role="tab"
				aria-label="Topics"
				checked="checked"
				class="tab font-bold text-black [--tab-bg:red]"
			/>
			<div role="tabpanel" class="tab-content divide-y rounded-box p-6">
				{#each topics as topic, index}
					<Topic {topic} {myProfile} {deleteTopic} {index} />
				{/each}
			</div>

			<input
				type="radio"
				name="my_tabs_2"
				role="tab"
				class="tab font-bold text-black [--tab-bg:red]"
				aria-label="Projects"
			/>
			<div role="tabpanel" class="tab-content rounded-box p-6">
				<div class="flex max-h-screen w-full flex-col gap-2 overflow-auto lg:flex-row lg:flex-wrap">
					{#each data.projects as project}
						<Project {project} />
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
