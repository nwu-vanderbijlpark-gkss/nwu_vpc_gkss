<script>
	import {
		Dot,
		Forward,
		LogIn,
		MessageCircleMore,
		PlusCircle,
		Search,
		ThumbsDown,
		ThumbsUp,
		User,
		X
	} from 'lucide-svelte';

	let { children, data } = $props();
	console.log(data);
</script>

<main class="flex min-h-screen divide-x bg-gray-200">
	<div class="hidden min-h-screen w-2/12 flex-col items-center bg-white p-2 text-black lg:flex">
		<ul class="menu min-h-full w-full p-2">
			<h2 class="menu-title border-b text-xl font-bold text-gray-400">Community</h2>
			<li><a href="#" class="navItem text-base"><Search /> Search</a></li>
			{#if data.email != null}
				<li>
					<a href="#" class="navItem text-base" onclick={() => my_modal_1.showModal()}
						><PlusCircle /> Create new topic</a
					>
				</li>
				<li><a href="#" class="navItem text-base"><User /> Profile</a></li>
				<dialog id="my_modal_1" class="modal">
					<div class="modal-box text-white">
						<div class="flex items-center justify-between">
							<p class="text-lg font-bold text-white">Create a topic</p>
							<div class="modal-action">
								<form method="dialog">
									<button class="btn"><X />Close</button>
								</form>
							</div>
						</div>

						<p class="py-4 text-sm">Enter the required details</p>
						<form method="post" action="#" class="flex w-full flex-col gap-5">
							<label class="form-control w-full">
								<p>Topic</p>
								<input
									type="text"
									name="topic"
									class="input input-bordered"
									id="topic"
									placeholder="Study tips..."
								/>
							</label>
							<label class="form-control w-full">
								<p>Content</p>
								<textarea
									name="content"
									class="textarea textarea-bordered"
									id="content"
									placeholder="What's on your mind?"
								></textarea>
							</label>
							<label class="form-control w-full">
								<p>Tags</p>
								<textarea
									name="tags"
									class="textarea textarea-bordered"
									id="tags"
									placeholder="Enter tags, comma separated"
								></textarea>
							</label>
							<button type="submit" class="btn btn-primary text-white">Create</button>
						</form>
					</div>
				</dialog>
			{:else}
				<li>
					<a href="/login" class="navItem bg-primary text-white hover:text-black"><LogIn />Login</a>
				</li>
			{/if}
		</ul>
	</div>
	<div
		class="min-h-screen w-full bg-white p-5 text-black lg:max-h-screen lg:w-2/3 lg:overflow-scroll"
	>
		{@render children()}
	</div>
	<div
		class="hidden min-h-screen w-2/12 flex-col items-center space-y-4 bg-white p-2 text-black lg:flex"
	>
		<ul class="menu w-full rounded-lg bg-base-content p-2">
			<h2 class="menu-title border-b text-xl font-bold text-black">Latest topics</h2>
			<li><a href="#" class="navItem text-base">Web Development</a></li>
			<li><a href="#" class="navItem text-base">Coding tips</a></li>
			<li><a href="#" class="navItem text-base">Studying tips</a></li>
		</ul>
		<ul class="menu w-full rounded-lg bg-base-content p-2">
			<h2 class="menu-title border-b text-xl font-bold text-black">Most active geeks</h2>
			<li><a href="#" class="navItem text-base">John Doe</a></li>
			<li><a href="#" class="navItem text-base">Kim Kadi</a></li>
			<li><a href="#" class="navItem text-base">John SeeMe</a></li>
		</ul>
	</div>
</main>
