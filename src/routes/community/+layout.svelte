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
</script>

<main class="flex min-h-screen divide-x bg-gray-200">
	<div class="hidden min-h-screen w-2/12 flex-col items-center bg-white p-2 text-black lg:flex">
		<ul class="menu min-h-full w-full p-2">
			<h2 class="menu-title border-b text-xl font-bold text-gray-400">Community</h2>
			<li>
				<a href="/community/search" class="navItem text-base"><Search /> Search</a>
			</li>
			{#if data.email != null}
				<li>
					<a href="/community" class="navItem text-base" onclick={() => my_modal_1.showModal()}
						><PlusCircle /> Create new topic</a
					>
				</li>
				<li><a href="/profile" class="navItem text-base"><User /> Profile</a></li>
			{:else}
				<li>
					<a href="/login" class="navItem bg-primary text-white hover:text-black"><LogIn />Login</a>
				</li>
			{/if}
		</ul>
	</div>
	<div
		class="min-h-screen w-full bg-gray-200 text-black lg:max-h-screen lg:w-2/3 lg:overflow-scroll lg:p-2"
	>
		{@render children()}
	</div>
	<div
		class="hidden min-h-screen w-2/12 flex-col items-center space-y-4 bg-white p-2 text-black lg:flex"
	>
		<ul class="menu w-full rounded-lg p-2">
			<h2 class="menu-title border-b text-xl font-bold text-black">Popular topics</h2>
			{#each data.most_viewed as topic}
				<li>
					<a
						href={`/community/${topic.topic}/${topic.id}`}
						class="navItem flex justify-between text-base"
					>
						{topic.topic}
					</a>
				</li>
			{/each}
		</ul>
		<ul class="menu w-full rounded-lg p-2">
			<h2 class="menu-title border-b text-xl font-bold text-black">Latest topics</h2>
			{#each data.latest as topic}
				<li>
					<a href={`/community/${topic.topic}/${topic.id}`} class="navItem text-base">
						{topic.topic}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</main>

<!-- Create TOpic modal-->
<dialog id="my_modal_1" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Create a topic</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn"><X />Close</button>
				</form>
			</div>
		</div>
		{#if data.email != null}
			<p class="py-4 text-sm">Enter the required details</p>
			<form method="post" class="flex w-full flex-col gap-5">
				<label class="form-control w-full">
					<p>Topic</p>
					<input
						type="text"
						name="topic"
						class="input input-bordered"
						id="topic"
						placeholder="Study tips..."
						required
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
		{:else}
			<p class="py-4 text-sm">You need to login to be able to create a topic</p>
			<a href="/login" class="btn btn-primary w-full text-white">Login here</a>
		{/if}
	</div>
</dialog>

<dialog id="commentModal" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Add a comment</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn"><X />Close</button>
				</form>
			</div>
		</div>
		{#if data.email != null}
			<form method="post" class="flex w-full flex-col gap-5">
				<label class="form-control w-full">
					<p>Comment</p>
					<textarea
						class="textarea textarea-bordered"
						name="comment"
						id="comment"
						placeholder="Add your comment"
						required
					></textarea>
				</label>
				<button type="submit" class="btn btn-primary text-white">Submit</button>
			</form>
		{:else}
			<p class="py-4 text-sm">You need to login to be able to add comments</p>
			<a href="/login" class="btn btn-primary w-full text-white">Login here</a>
		{/if}
	</div>
</dialog>
