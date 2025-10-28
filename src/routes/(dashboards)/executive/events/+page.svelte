<script>
	import Seo from '$lib/components/SEO.svelte';
	import { models } from '$lib/state.svelte.js';
	import {
		ArrowUpRightFromSquareIcon,
		Edit,
		Eye,
		Pencil,
		PlusCircle,
		Trash,
		Trash2,
		X
	} from 'lucide-svelte';
	import moment from 'moment';
	import { fade, fly } from 'svelte/transition';

	let array = [];
	let { data, form } = $props();
	let events = $state(data.events);
	models.context = 'Events' + JSON.stringify(events);

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
</script>

<Seo
	title="Event Management"
	desc="Manage and organize events efficiently with our event management system. Create, edit, and track events all in one place."
/>

<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="overflow-hidden rounded-lg shadow-xl"
>
	<div class="mb-8 flex items-center justify-between p-6">
		<h2 class="text-3xl font-semibold text-gray-800">Event Management</h2>
		<a href="/executive/events/create" class="btn btn-primary flex items-center space-x-2">
			<PlusCircle class="mr-2" /> <span>Create</span>
		</a>
	</div>

	<div class="overflow-x-auto px-6 pb-6">
		<table class="w-full border-separate border-spacing-0 text-left shadow-lg">
			<caption class="sr-only">List of upcoming events</caption>
			<thead class="bg-gray-50">
				<tr>
					<th
						class="rounded-tl-lg px-4 py-3 text-xs font-semibold tracking-wider text-gray-700 uppercase"
						>Event</th
					>
					<th
						class="hidden px-4 py-3 text-xs font-semibold tracking-wider text-gray-700 uppercase lg:table-cell"
						>Description</th
					>
					<th class="px-4 py-3 text-xs font-semibold tracking-wider text-gray-700 uppercase"
						>Date & Time</th
					>
					<th class="px-4 py-3 text-xs font-semibold tracking-wider text-gray-700 uppercase"
						>Venue</th
					>
					<th
						class="hidden px-4 py-3 text-xs font-semibold tracking-wider text-gray-700 uppercase lg:table-cell"
						>Type</th
					>
					<th
						class="rounded-tr-lg px-4 py-3 text-xs font-semibold tracking-wider text-gray-700 uppercase"
						>Actions</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each events as event}
					<tr class="transition-colors even:bg-gray-50 hover:bg-gray-100">
						<td class="px-4 py-4 text-base font-medium text-gray-900">
							<a
								href={`/executive/events/${event.id}`}
								class="hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							>
								{event.topic}
							</a>
						</td>
						<td
							class="hidden max-w-[300px] truncate px-4 py-4 text-base text-gray-600 lg:table-cell"
						>
							{event.description}
						</td>
						<td class="px-4 py-4 text-base text-gray-600">
							<span class="whitespace-nowrap">{moment(event.date).format('MMM D, YYYY')}</span>
							<span class="block text-sm text-gray-500">{moment(event.date).format('h:mm A')}</span>
						</td>
						<td class="px-4 py-4 text-base text-gray-600">{event.venue}</td>
						<td class="hidden px-4 py-4 lg:table-cell">
							<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
								{event.public ? 'Public' : 'Private'}
							</span>
						</td>
						<td class="px-4 py-4 text-base text-gray-600">
							<div class="flex items-center justify-end space-x-2">
								<a
									href={`/executive/events/${event.id}`}
									class="rounded-md p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
								>
									<span class="sr-only">View</span>
									<Eye class="h-5 w-5" />
								</a>
								<button
									onclick={() => showEdit(event.id)}
									class="rounded-md p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
								>
									<span class="sr-only">Edit</span>
									<Pencil class="h-5 w-5" />
								</button>
								<button
									onclick={() => handleDelete(event.id)}
									class="rounded-md p-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
								>
									<span class="sr-only">Delete</span>
									<Trash class="h-5 w-5" />
								</button>
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-4 py-6 text-center text-gray-500">No events found</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	@import 'tailwindcss';
	@plugin 'daisyui';
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
