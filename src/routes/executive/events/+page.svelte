<script>
	import { Edit, PlusCircle, Trash2, X } from 'lucide-svelte';

	let array = [];
	let { data } = $props();
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-gray-200 p-10">
	<div class="mb-6 flex w-full max-w-[700px] items-center justify-between">
		<h2 class="text-4xl font-bold">Events</h2>
		<button class="btn btn-primary" onclick={() => my_modal_1.showModal()}
			><PlusCircle />Create Event</button
		>
		<dialog id="my_modal_1" class="modal modal-bottom z-50 sm:modal-middle">
			<div class="modal-box text-white">
				<div class="flex items-center justify-between">
					<p class="text-lg font-bold text-white">Create an Event</p>
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
							placeholder="The name of the event"
						/>
					</label>
					<label class="form-control w-full">
						<p>Date</p>
						<input
							type="date"
							name="date"
							class="input input-bordered"
							id="date"
							placeholder="Date of the event"
						/>
					</label>
					<label class="form-control w-full">
						<p>Poster</p>
						<input
							type="file"
							name="image"
							class="file-input file-input-bordered w-full"
							accept="image/*"
							id="image"
						/>
					</label>
					<label class="form-control w-full">
						<p>Description</p>
						<textarea
							name="description"
							class="textarea textarea-bordered"
							id="description"
							placeholder="What is the event about?"
						></textarea>
					</label>
					<button type="submit" class="btn btn-primary text-white">Create</button>
				</form>
			</div>
		</dialog>
	</div>
	<div class="mb-5 grid w-full max-w-[700px] text-sm text-gray-500">
		<p class="">You can add, delete and update an event on this page</p>
		<p class="lg:hidden">View on desktop to be able to see the description of the events</p>
	</div>
	<div class="w-full max-w-[700px] overflow-x-auto">
		<table class="table">
			<!-- head -->
			<thead>
				<tr>
					<th>Event</th>
					<th class="hidden lg:flex">Description</th>
					<th>Date</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				<!-- row  -->
				{#each data.events as event}
					<tr>
						<td>{event.topic}</td>
						<td class="hidden max-w-[300px] overflow-hidden lg:flex">{event.description}</td>
						<td>{event.date}</td>
						<td class="flex items-center gap-2">
							<button class="btn btn-ghost grid items-center"
								><Edit />
								<p class="text-xs">Edit</p></button
							>
							<button class="btn btn-ghost grid items-center"
								><Trash2 color="red" />
								<p class="text-xs">Delete</p></button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	table,
	td,
	tr,
	th,
	h1,
	h2,
	h3 {
		@apply text-black;
	}
	div {
		cursor: default;
	}
</style>
