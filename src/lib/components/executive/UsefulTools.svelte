<script>
	import { afterNavigate } from '$app/navigation';
	import { LucideBoxes, X } from 'lucide-svelte';
	import { fade, fly, slide } from 'svelte/transition';

	let toolBtn = $state({
		isVisible: true,
		toggleVisibility: function () {
			//reason I did this, in svelte, this changes but the toolBtn does not
			toolBtn.isVisible = !toolBtn.isVisible;
		}
	});
	let elementMounted = $state(true);

	//show the button after navigation
	afterNavigate(({ from, to }) => {
		if (to.url.pathname.includes('/events')) {
			elementMounted = false;
			return;
		}
		elementMounted = true;
		toolBtn.isVisible = true;
	});
</script>

<!--This component will display as a button at first, when the button is clicked, the tools will be displayed-->
{#if elementMounted}
	{#if toolBtn.isVisible}
		<button
			onclick={toolBtn.toggleVisibility}
			class="btn btn-primary fixed right-5 bottom-10 z-50 shadow-2xl">Tools <LucideBoxes /></button
		>
	{:else}
		<!--Display useful tools here-->
		<div
			id="usefulTools"
			class="border-primary bg-secondary fixed right-5 bottom-10 z-50 rounded-xl border p-2 text-black shadow-2xl"
		>
			<section class="flex w-full items-center justify-between">
				<h2>Useful tools</h2>
				<button onclick={toolBtn.toggleVisibility} class="btn btn-ghost text-red-500"><X /></button>
			</section>
			<ul class="menu menu-lg">
				<li><a href="/executive/projects">Projects</a></li>
				<li><a href="/executive/meetings">Meetings</a></li>
				<li><a href="/executive/projects?action=create">Create Project</a></li>
				<li><a href="/executive/membership?p=manageAnnouncements">Announcements</a></li>
			</ul>
		</div>
	{/if}
{/if}
