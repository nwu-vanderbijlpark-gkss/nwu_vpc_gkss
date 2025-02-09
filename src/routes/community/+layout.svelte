<script>
	import {
		ChartBar,
		CodeXml,
		Dot,
		Forward,
		LogIn,
		MessageCircleMore,
		PlusCircle,
		Search,
		ThumbsDown,
		ThumbsUp,
		User,
		Users,
		X
	} from 'lucide-svelte';

	let { children, data } = $props();
	let images = $state([]);
	let error = $state();
	const convertToMB = (bytes) => {
		return (bytes / (1024 * 1024)).toFixed(0);
	};
	const handleFileChange = (event) => {
		for (const image of event.target.files) {
			if (convertToMB(image.size) < 50) {
				if (images.includes(image)) {
					error = 'You already chose chose this file ' + image.name;
				} else {
					images = [...images, image];
					error = null;
				}
			} else {
				error = 'Cannot upload files above 50MB';
			}
		}
		event.target.value = '';
	};
	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		if (images.length > 0) {
			error = '';
			// Append each file to the FormData object
			images.forEach((file, index) => {
				formData.append(`files[]`, file); // `files[]` ensures it's handled as an array on the server
			});
			// Send the FormData to the SvelteKit action using fetch
		}
		await fetch('/community?/addTopic', {
			method: 'POST',
			body: formData
		});
		//event.target.submit();
		document.getElementById('my_modal_1').close();
		//console.log(result);
	}
</script>

<main class="flex min-h-screen divide-x bg-gray-200">
	<div class="hidden min-h-screen w-2/12 flex-col items-center bg-white p-2 text-black lg:flex">
		<ul class="menu min-h-full w-full space-y-2 p-2">
			<h2 class="menu-title border-b text-xl font-bold text-gray-400">Community</h2>
			<li>
				<a href="/community/search" class="navItem text-lg"><Search /> Search</a>
			</li>
			<li>
				<a href="/community" class="navItem text-lg"><Users /> Discussions</a>
			</li>
			<li>
				<a href="/community/projectspace" class="navItem text-lg"><CodeXml /> ProjectSpace</a>
			</li>
			{#if data.email != null}
				<li>
					<a href="/dashboard" data-sveltekit-reload class="navItem text-lg"
						><ChartBar /> Dashboard</a
					>
				</li>
				<li><a href="/community/profile" class="navItem text-lg"><User /> Profile</a></li>
				<button class="btn btn-primary" onclick={() => my_modal_1.show()}
					><PlusCircle /> Create topic</button
				>
			{:else}
				<li>
					<a
						href="/login"
						class="bg-primary text-lg text-white hover:bg-primary/90 hover:text-black"
						><LogIn />Login</a
					>
				</li>
			{/if}
		</ul>
	</div>
	<div class=" w-full overflow-auto bg-white text-black lg:max-h-screen lg:w-2/3 lg:p-2">
		{@render children()}
	</div>
	<div class="btm-nav lg:hidden">
		<a href="/community" class=""><Users /> Discussions </a>
		<a href="/community/search">
			<Search /> Search
		</a>
		<a href="/community/projectspace"> <CodeXml /> ProjectSpace</a>
		{#if data.email != null}
			<a href="/community/profile"> <User /> Profile</a>
		{:else}
			<a href="/login"> <LogIn />Login</a>
		{/if}
	</div>
	<div
		class="hidden min-h-screen w-2/12 flex-col items-center space-y-4 bg-white p-2 text-black lg:flex"
	>
		<ul class="menu w-full rounded-lg p-2">
			<h2 class="menu-title border-b text-xl font-bold text-black">Top Projects</h2>
			{#each data.projects as project}
				<li>
					<a
						href={`/community/projectspace/${project.id}`}
						class="navItem flex items-center justify-between text-base"
					>
						{project.name}
						<img src={project.image} alt={project.name} class="h-[20px] w-[20px] rounded-full" />
					</a>
				</li>
			{/each}
		</ul>
		<ul class="menu w-full rounded-lg p-2">
			<h2 class="menu-title border-b text-xl font-bold text-black">Popular topics</h2>
			{#each data.most_viewed as topic}
				<li>
					<a href={`/community/topic/${topic.id}`} class="navItem text-base">
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
			<form
				method="post"
				enctype="multipart/form-data"
				action="/community?/addTopic"
				onsubmit={handleSubmit}
				class="flex w-full flex-col gap-5"
			>
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
					<p>Images</p>
					<div class="my-2 flex w-full flex-wrap space-x-2">
						{#each images as image, index}
							<button
								type="button"
								class="tooltip tooltip-error"
								data-tip="Click to remove"
								onclick={() => images.splice(index, 1)}
							>
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<img
									src={URL.createObjectURL(image)}
									alt={image.name}
									class="h-10 w-10 rounded border p-1"
								/>
							</button>
						{/each}
					</div>
					<input
						type="file"
						accept="image/*"
						name="images"
						class="file-input file-input-bordered"
						id="images"
						multiple
						onchange={handleFileChange}
					/>
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
<!-- Comment Modal-->
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
<!--Submit ProjectSpace Project Modal-->

<dialog id="projectSpaceModal" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Submit a project</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn"><X />Close</button>
				</form>
			</div>
		</div>
		{#if data.email != null}
			<p class="py-4 text-sm">Enter the required details</p>
			<form
				method="post"
				action="?/addProject"
				enctype="multipart/form-data"
				class="flex w-full flex-col gap-5"
			>
				<label class="form-control w-full">
					<p>Name</p>
					<input
						type="text"
						name="name"
						class="input input-bordered"
						id="name"
						placeholder="Student Hub..."
						required
					/>
				</label>
				<label class="form-control w-full">
					<p>Link to project</p>
					<input
						name="link"
						class="input input-bordered"
						id="link"
						type="link"
						placeholder="Enter the link to the project"
						required
					/>
				</label>
				<label class="form-control w-full">
					<p>Image</p>
					<input
						type="file"
						accept="image/*"
						name="image"
						class="file-input file-input-bordered"
						id="image"
						required
					/>
				</label>
				<label class="form-control w-full">
					<p>Description</p>
					<textarea
						name="description"
						class="textarea textarea-bordered"
						id="description"
						placeholder="What's the project about?"
						required
					></textarea>
				</label>
				<label class="form-control w-full">
					<p>Technologies Used</p>
					<textarea
						name="technologies"
						class="textarea textarea-bordered"
						id="technologies"
						placeholder="Enter the technologies used, comma separated"
						required
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
