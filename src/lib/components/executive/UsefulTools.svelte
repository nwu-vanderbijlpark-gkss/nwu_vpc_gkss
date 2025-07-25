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

	//show the button after navigation
	afterNavigate(() => {
		toolBtn.isVisible = true;
	});
</script>

<!--This component will display as a button at first, when the button is clicked, the tools will be displayed-->

{#if toolBtn.isVisible}
	<button onclick={toolBtn.toggleVisibility} class="btn btn-secondary fixed bottom-10 right-5 z-50"
		>Tools <LucideBoxes /></button
	>
{:else}
	<!--Display useful tools here-->
	<div
		id="usefulTools"
		class="fixed bottom-10 right-5 z-50 rounded-xl bg-secondary p-2 text-black shadow-lg"
	>
		<section class="flex w-full items-center justify-between border-b">
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
