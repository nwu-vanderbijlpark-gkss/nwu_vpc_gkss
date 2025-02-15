<script>
	import {
		ChartBar,
		ChartColumnBig,
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
	import Loading from '../../components/Loading.svelte';
	import Editor from '../../components/Editor.svelte';
	import { slide } from 'svelte/transition';

	let { children, data } = $props();
	let todaysBirthdays = data.members.filter((member) => {
		const today = new Date();
		const birthDate = new Date(member.date_of_birth);

		// Check if the member's birthday is today (ignore the year)
		return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
	});
	let popularTopics = $state(data.most_viewed.slice(0, 3));
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
		isLoading = true;
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
		location.reload();
	}
	let isLoading = $state(false);
</script>

<main transition:slide class="flex min-h-screen divide-x bg-gray-200">
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
			<li>
				<a href="/community/leaderboard" class="navItem text-lg"><ChartColumnBig /> LeaderBoard</a>
			</li>
			{#if data.email != null}
				<li><a href="/community/profile" class="navItem text-lg"><User /> Profile</a></li>
				<li>
					<a href="/community/create-topic" class="btn btn-primary"><PlusCircle /> Create topic</a>
				</li>
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

	<!-- Main Content -->
	<div class="w-full overflow-auto bg-white text-black lg:max-h-screen lg:flex-1 lg:p-4">
		{@render children()}
	</div>

	<!-- Right Sidebar -->
	<div
		class="hidden min-h-screen w-64 flex-col items-center space-y-4 bg-white p-4 text-black lg:flex"
	>
		<!-- Top Projects -->
		<div class="w-full space-y-4">
			<div class="space-y-3 rounded-lg border p-3">
				<h2 class="text-lg font-semibold text-black">Top Projects</h2>
				{#each data.projects.slice(0, 3) as project}
					<a
						href={`/community/projectspace/${project.id}`}
						class="flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
					>
						<span class="truncate text-base">{project.name}</span>
						<img src={project.image} alt={project.name} class="h-6 w-6 rounded-full" />
					</a>
				{/each}
			</div>

			<!-- Popular Topics -->
			<div class="space-y-3 rounded-lg border p-3">
				<h2 class="text-lg font-semibold text-black">Popular Topics</h2>
				{#each popularTopics as topic, index}
					<a
						href={`/community/topic/${topic.id}`}
						class="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100"
					>
						<span class="w-4 text-sm font-medium text-gray-500">{index + 1}.</span>
						<span class="flex-1 truncate text-base">{topic.topic}</span>
					</a>
				{/each}
			</div>
			<div class="space-y-3 rounded-lg border p-3">
				<h2 class="text-lg font-semibold text-black">Today's birthdays</h2>
				{#if todaysBirthdays.length == 0}
					<p class="text-gray-400">No birthdays for today😓</p>
				{/if}
				{#each todaysBirthdays as member}
					<a
						href={`/community/${member.username}`}
						class="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100"
					>
						<img src={member.image} alt={member.name} class="h-6 w-6 rounded-full" />

						<span class="truncate text-base">{member.name} {member.surname}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	<div class="btm-nav border-t bg-white py-2 shadow-md lg:hidden">
		<a
			href="/community"
			class="flex flex-col items-center text-sm text-gray-600 transition hover:text-primary"
		>
			<Users class="h-5 w-5" />
			<span>Discussions</span>
		</a>

		<a
			href="/community/search"
			class="flex flex-col items-center text-sm text-gray-600 transition hover:text-primary"
		>
			<Search class="h-5 w-5" />
			<span>Search</span>
		</a>

		<a
			href="/community/create-topic"
			class="flex flex-col items-center text-sm font-semibold text-primary"
		>
			<div class="rounded-full bg-primary p-2 text-white shadow-lg">
				<PlusCircle class="h-6 w-6" />
			</div>
			<span>Create</span>
		</a>

		<a
			href="/community/projectspace"
			class="flex flex-col items-center text-sm text-gray-600 transition hover:text-primary"
		>
			<CodeXml class="h-5 w-5" />
			<span>Projects</span>
		</a>

		{#if data.email != null}
			<a
				href="/community/profile"
				class="flex flex-col items-center text-sm text-gray-600 transition hover:text-primary"
			>
				<User class="h-5 w-5" />
				<span>Profile</span>
			</a>
		{:else}
			<a
				href="/login"
				class="flex flex-col items-center text-sm text-gray-600 transition hover:text-primary"
			>
				<LogIn class="h-5 w-5" />
				<span>Login</span>
			</a>
		{/if}
	</div>
</main>

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
