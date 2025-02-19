<script>
	import { ArrowUpRightFromSquareIcon, Edit, PlusCircle, Trash2, X } from 'lucide-svelte';
	import moment from 'moment';

	let array = [];
	let { data, form } = $props();
	let events = $state(data.events);
	let editData = $state({ topic: '', description: '', venue: '', date: '', public: '' });
	let isEditing = $state(false);

	const handleDelete = (id) => {
		if (
			confirm(
				`Click Ok to confirm to delete "${events.filter((event) => event.id == id)[0].topic}""`
			)
		) {
			const data = new FormData();
			data.append('id', id);
			fetch('?/deleteEvent', {
				method: 'POST',
				body: data
			});
			// Remove the deleted event from state
			events = events.filter((event) => event.id !== id);
		}
	};
	const showEdit = (id) => {
		isEditing = true;
		editData = events.filter((event) => event.id == id)[0];
		my_modal_1.showModal();
	};
	const handleEdit = async () => {
		const res = await fetch('/executive/api/editEvent', {
			method: 'POST',
			body: JSON.stringify({ editData }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const response = await res.json();
		if (response.success) {
			my_modal_1.close();
			editData = { topic: '', description: '', venue: '', date: '', public: '' };
			isEditing = false;
		} else {
			alert('Unexpected error');
			isEditing = false;
		}
	};
</script>

<div class="overflow-hidden rounded-lg shadow-xl">
	<div class="mb-8 flex items-center justify-between p-6">
		<h2 class="text-3xl font-semibold text-gray-800">Event Management</h2>
		<button
			class="btn btn-primary flex items-center space-x-2"
			onclick={() => my_modal_1.showModal()}
		>
			<PlusCircle class="mr-2" /> <span>Create Event</span>
		</button>
	</div>

	<div class="overflow-x-auto px-6 pb-6">
		<table class="w-full border-separate space-y-4 text-left text-sm text-gray-600 shadow-xl">
			<thead class="bg-gray-100 text-xs uppercase text-gray-700">
				<tr>
					<th class="px-6 py-4 font-medium">Event</th>
					<th class="hidden px-6 py-4 font-medium lg:table-cell">Description</th>
					<th class="px-6 py-4 font-medium">Date and time</th>
					<th class="px-6 py-4 font-medium">Venue</th>
					<th class="px-6 py-4 font-medium">Type</th>
					<th class="px-6 py-4 text-center font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each events as event}
					<tr class="border-b bg-white transition-colors hover:bg-gray-50">
						<td class="px-6 py-4 font-semibold text-gray-800">
							<a href={`/executive/events/${event.id}`} class="block">{event.topic}</a>
						</td>
						<td class="hidden max-w-[300px] overflow-hidden px-6 py-4 lg:table-cell"
							>{event.description}</td
						>
						<td class="px-6 py-4">{moment(event.date).format('llll')}</td>
						<td class="px-6 py-4">{event.venue}</td>
						<td class="hidden max-w-[300px] overflow-hidden px-6 py-4 lg:table-cell"
							>{event.public ? 'Public' : 'Private'}</td
						>
						<td class="flex justify-center space-x-4 px-6 py-4 text-center">
							<button
								onclick={() => showEdit(event.id)}
								class="btn btn-ghost btn-sm hidden items-center space-x-1 hover:bg-gray-100 lg:flex"
							>
								<Edit class="mr-1" /> <span class="text-xs">Edit</span>
							</button>
							<button
								onclick={() => handleDelete(event.id)}
								class="btn btn-ghost btn-sm flex items-center space-x-1 text-red-600 hover:bg-red-100"
							>
								<Trash2 class="mr-1" /> <span class="text-xs">Delete</span>
							</button>
							<a
								href={`/executive/events/${event.id}`}
								class="btn btn-ghost btn-sm flex items-center space-x-1 hover:bg-gray-100"
							>
								<ArrowUpRightFromSquareIcon /> <span class="text-xs">View</span>
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<!--CREATE/EDIT EVENT MODAL-->
<dialog id="my_modal_1" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold">Create an Event</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn text-white"><X /> Close</button>
				</form>
			</div>
		</div>

		<p class="py-4 text-sm">Enter the required details to create an event</p>
		<form method="post" action="?/addEvent" class="flex w-full flex-col gap-5">
			<label class="form-control w-full">
				<p>Topic</p>
				<input
					type="text"
					name="topic"
					class="input input-bordered"
					id="topic"
					placeholder="The name of the event"
					bind:value={editData.topic}
				/>
			</label>
			<label class="form-control w-full">
				<p>Venue</p>
				<input
					type="text"
					name="venue"
					class="input input-bordered"
					id="venu"
					placeholder="The name of the venue."
					bind:value={editData.venue}
				/>
			</label>
			<div class="form-control w-52">
				<label class="label cursor-pointer">
					<span class="label-text">Make event public</span>
					<input
						bind:checked={editData.public}
						type="checkbox"
						name="public"
						class="toggle toggle-primary"
					/>
				</label>
			</div>
			<label class="form-control w-full">
				<p>Date and Time</p>
				<input
					bind:value={editData.date}
					type="datetime-local"
					name="date"
					class="input input-bordered"
					id="date"
				/>
			</label>
			<label class="form-control hidden w-full">
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
					bind:value={editData.description}
					name="description"
					class="textarea textarea-bordered"
					id="description"
					placeholder="What is the event about?"
				></textarea>
			</label>
			{#if isEditing}
				<button type="button" onclick={handleEdit} class="btn btn-primary text-white">Edit</button>
			{:else}
				<button type="submit" class="btn btn-primary text-white">Create</button>
			{/if}
		</form>
	</div>
</dialog>

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
	/* Add hover effects for action buttons */
	.btn-ghost:hover {
		@apply bg-gray-200;
	}
	/* Adjust cursor and mobile responsiveness */
	overflow-x-auto {
		@apply max-w-full;
	}
	/* Improve padding for better readability */
	th,
	td {
		@apply px-6 py-4;
	}
	/* Making sure the modal box is centered and not too wide */
	.modal-box {
		@apply mx-auto max-w-lg;
	}
</style>
