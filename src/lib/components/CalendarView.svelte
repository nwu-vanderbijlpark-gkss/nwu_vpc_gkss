<script>
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import listPlugin from '@fullcalendar/list';

	// Your event data includes datetime, topic, and description.
	let { events } = $props();
	let eventsData = [
		{
			title: 'Meeting with Bob',
			datetime: '2025-03-01T10:00:00',
			topic: 'Project Discussion',
			description: 'Discuss the project milestones and next steps.'
		},
		{
			title: 'Lunch with Alice',
			datetime: '2025-03-05T12:00:00',
			topic: 'Casual Meeting',
			description: 'Casual lunch meeting at the new cafe.'
		}
	];

	let calendarEl;

	// Utility: Determine headerToolbar based on screen width.
	const getHeaderToolbar = () => {
		return window.innerWidth < 600
			? {}
			: {
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,listWeek'
				};
	};

	onMount(() => {
		const calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
			headerToolbar: getHeaderToolbar(),
			initialView: 'dayGridMonth',
			// Map your event objects to FullCalendar's format.
			events: events.map((ev) => ({
				title: ev.topic, // Display title in the grid.
				start: ev.date, // Use datetime for scheduling.
				extendedProps: {
					// Store additional details.
					topic: ev.topic,
					description: ev.description
				}
			})),
			// When an event is clicked, display its topic and description.
			eventClick: function (info) {
				alert(
					`Topic: ${info.event.extendedProps.topic}\nDescription: ${info.event.extendedProps.description}`
				);
			},
			// Customize event rendering to display only the title.
			eventContent: function (arg) {
				return { html: `<div class="fc-event-title">${arg.event.title}</div>` };
			},
			// Mobile-friendly settings.
			aspectRatio: 1.2,
			nowIndicator: true,
			// Update header on window resize.
			windowResize: function () {
				calendar.setOption('headerToolbar', getHeaderToolbar());
			}
		});
		calendar.render();
	});
</script>

<svelte:head>
	<!-- Mobile viewport for responsiveness -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<!-- Include FullCalendar CSS via CDN -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fullcalendar/core/main.min.css" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid/main.min.css" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fullcalendar/timegrid/main.min.css" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fullcalendar/list/main.min.css" />
</svelte:head>

<div class="calendar-container" bind:this={calendarEl}></div>

<style>
	/* Container styling for responsiveness */
	.calendar-container {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	/* Style for event titles */
	.fc-event-title {
		font-size: 0.9em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Adjust font size on smaller screens */
	@media (max-width: 600px) {
		.fc-event-title {
			font-size: 0.8em;
		}
	}
</style>
