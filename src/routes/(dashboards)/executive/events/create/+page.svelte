<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Seo from '$lib/components/SEO.svelte';
	import TrixEditor from '$lib/components/TrixEditor.svelte';
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
	let { data } = $props();
	let events = $state(data.events);
	models.context = 'Events' + JSON.stringify(events);

	let form = $state({
		topic: '',
		description: '',
		venue: '',
		date: ''
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		//input validations
		if (!form.topic.length || !form.description.length || !form.venue.length || !form.date.length) {
			alert('Please make sure all fields are completed.');
			return;
		}
		//send to db
		const req = await fetch('/api/event', {
			method: 'POST',
			body: JSON.stringify({ data: form })
		});
		const res = await req.json();
		if (res.success) {
			goto('/executive/events/' + res.data[0].id + '?tab=details');
		} else {
			alert('Failed to create event\n' + res.data);
		}
	};
</script>

<Seo
	title="Create Event"
	desc="Organize and manage events with ease using our event creation tool. Set up event details, invite participants, and streamline your event planning process."
/>

<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="min-h-screen overflow-hidden bg-white p-5"
>
	<div class=" text-black">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold">Create an Event</p>
		</div>
		<form onsubmit={handleSubmit} class="flex w-full flex-col-reverse gap-5 lg:grid lg:grid-cols-2">
			<!--Basic Info-->
			<div>
				<div class="divider"><h2 class="text-lg">Basic Info</h2></div>

				<label class="form-control w-full">
					<p>Title</p>
					<input
						type="text"
						name="topic"
						class="input input-bordered border-2 bg-gray-200"
						id="topic"
						placeholder="The title of the event"
						bind:value={form.topic}
					/>
				</label>
				<label class="form-control w-full">
					<p>Venue</p>
					<input
						type="text"
						name="venue"
						class="input input-bordered border-2 bg-gray-200"
						id="venu"
						placeholder="The name of the venue Or N/A"
						bind:value={form.venue}
					/>
				</label>

				<label class="form-control w-full">
					<p>Date and Time</p>
					<input
						bind:value={form.date}
						type="datetime-local"
						name="date"
						class="input input-bordered border-2 bg-gray-200"
						id="date"
					/>
				</label>
				<label class="form-control hidden w-full">
					<p>Poster</p>
					<input
						type="file"
						name="image"
						class="file-input file-input-bordered w-full border-2 bg-gray-200"
						accept="image/*"
						id="image"
					/>
				</label>
				<p>Description</p>
				<TrixEditor bind:value={form.description} id="event_description" />
				<div class="my-4">
					<button type="submit" class="btn btn-primary w-full text-white">Proceed</button>
				</div>
			</div>
			<!--Additional Info-->
			<div class="space-y-2">
				<div class="divider"><h2 class="text-lg">Additional Info</h2></div>

				<p class="font-bold">* This event will not be published yet.</p>
				<p>You will be redirected to the event page, where you can:</p>
				<ul class="list-inside list-disc">
					<li>Publish event</li>
					<li>Invite Judges if needed</li>
					<li>Set Judging criteria if needed</li>
				</ul>
			</div>
		</form>
	</div>
</div>
