<script>
	import moment from 'moment';
	import {
		User,
		Shield,
		ChartBar,
		LogOut,
		Settings,
		Bell,
		Calendar,
		Book,
		Award,
		UserPlus,
		Mail,
		X,
		AlertCircle,
		XCircle,
		Upload,
		EditIcon,
		PenBoxIcon,
		Camera,
		ChartColumnIcon,
		CalendarCheck
	} from 'lucide-svelte';
	import Profile from './components/Profile.svelte';
	import Invite from './components/Invite.svelte';
	import Page from '../update-password/+page.svelte';
	import { slide } from 'svelte/transition';
	import CalendarView from '../../components/CalendarView.svelte';

	let activeTab = $state('stats');
	let notifications = $state(3);
	let { data } = $props();
	let inviteHistory = $state([
		{ email: 'friend@example.com', status: 'Pending', date: '2024-03-01' },
		{ email: 'colleague@example.com', status: 'Accepted', date: '2024-02-28' }
	]);
	let member = $state(data.member);
	let birthDayMonth = member.date_of_birth.substring(member.date_of_birth.indexOf('-') + 1);

	// Current year
	let currentYear = moment().year();

	// Set the birthday to the current year, using birth month and day
	let birthdayThisYear = moment(`${currentYear}-${birthDayMonth}`, 'YYYY-MM-DD');

	// Calculate the difference in days from today
	let birthDayCountdown = birthdayThisYear.diff(moment(), 'days');

	// If the birthday has already passed this year, adjust it to next year
	if (birthDayCountdown < 0) {
		birthdayThisYear.add(1, 'year');
		birthDayCountdown = birthdayThisYear.diff(moment(), 'days');
	}

	// Handlers
	const handleLogout = (event) => {
		logoutModal.showModal();
	};
	const handleImageChange = (event) => {
		let image = event.target.files[0];
		member.image = URL.createObjectURL(image);
		console.log('Image uploaded:', event.target.files[0].name);
	};
	const handleNotificationClick = () => (notifications = 0);
	let members = $state(
		data.members
			.filter((m) => m.name && m.username) // Filter valid members
			.sort((a, b) => b.points - a.points)
	);
	// Build a Map where each username maps to its rank
	const rankMap = new Map();
	members.forEach((person, index) => {
		rankMap.set(person.username, index + 1);
	});

	// Each lookup is constant time
</script>

<title>Dashboard | NWU VAAL GKSS</title>

<!-- Logout modal-->
<dialog id="logoutModal" class="modal z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Logout Confirmation</p>
		</div>
		<p class="py-4 text-sm">Do you want to logout?</p>
		<div class="grid grid-cols-2 gap-2">
			<form method="post" action="?/logout" class="w-full">
				<button type="submit" class="btn btn-primary w-full">Yes</button>
			</form>
			<button onclick={() => logoutModal.close()} class="btn btn-secondary w-full">No</button>
		</div>
	</div>
</dialog>
<!-- Logout modal-->
<dialog id="imageModal" class="modal z-50 sm:modal-middle">
	<div class="modal-box flex flex-col items-center justify-center text-white">
		<div class="flex w-full items-center justify-between">
			<p class="text-lg font-bold text-white">{member.name} {member.surname}</p>
			<button onclick={() => imageModal.close()} class="btn btn-ghost"><XCircle /></button>
		</div>
		<img
			src={member.image}
			alt="Profile"
			class=" h-40 w-40 rounded-full border-4 border-primary/20 object-cover transition-all group-hover:border-primary/50"
		/>
		<p class="py-4 text-sm">Upload new picture</p>
		<div class="">
			<form
				method="post"
				enctype="multipart/form-data"
				action="?/uploadImage"
				class="w-full space-y-5"
			>
				<input
					class="file-input file-input-bordered w-full"
					type="file"
					accept="image/*"
					name="image"
					id="image"
					onchange={handleImageChange}
				/>
				<button type="submit" class="btn btn-primary w-full"><Upload />Upload</button>
			</form>
		</div>
	</div>
</dialog>
<div class="flex min-h-screen flex-col bg-gray-100 md:flex-row">
	<!-- Sidebar -->
	<nav class="fixed hidden h-screen w-64 flex-col bg-base-200 text-white shadow-lg md:flex">
		<div class="flex flex-col items-center space-y-4 border-b p-6">
			<div class="group relative">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<div class="tooltip tooltip-right tooltip-info" data-tip="Click here to change image">
					<img
						onclick={() => imageModal.show()}
						src={member.image}
						alt="Profile"
						class="h-24 w-24 rounded-full border-4 border-primary/20 object-cover transition-all group-hover:border-primary/50"
					/>
				</div>
			</div>
			<button class="btn btn-outline" onclick={() => imageModal.show()}
				><Upload /> Upload new Image</button
			>
			<div class="text-center">
				<h2 class="font-bold">{member.name} {member.surname}</h2>
				<p class="text-sm text-gray-200">Student No: {member.student_no}</p>
			</div>
		</div>

		<div class="flex flex-grow flex-col space-y-2 p-4">
			{#each [{ id: 'stats', icon: ChartBar, text: 'Dashboard' }, { id: 'profile', icon: User, text: 'Profile' }, { id: 'security', icon: Shield, text: 'Security' }] as item}
				<button
					class="flex items-center space-x-2 rounded-lg p-3 {activeTab === item.id
						? 'bg-primary text-white'
						: 'hover:bg-red-900/50'}"
					onclick={() => (activeTab = item.id)}
				>
					<svelte:component this={item.icon} size={20} />
					<span>{item.text}</span>
				</button>
			{/each}
			<div class="border-t p-4">
				<button
					onclick={handleLogout}
					type="submit"
					class="flex w-full items-center space-x-2 rounded-lg p-3 text-red-600 hover:bg-red-50"
				>
					<LogOut size={20} />
					<span>Logout</span>
				</button>
			</div>
		</div>
	</nav>
	<!-- Mobile header -->
	<header
		class="sticky top-0 z-10 flex items-center justify-between bg-white p-4 shadow-md md:hidden"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="flex items-center space-x-3">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="tooltip tooltip-right tooltip-info" data-tip="Click here to change image">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="indicator" onclick={() => imageModal.show()}>
					<div class="indicator-item indicator-middle text-black">
						<div class="rounded-full bg-gray-300 p-1"><Camera /></div>
					</div>
					<img
						src={member.image}
						alt="Profile"
						class=" h-14 w-14 rounded-full border-2 border-primary/20 object-cover"
					/>
				</div>
			</div>
			<h1 class="font-bold text-gray-800">{member.name}</h1>
		</div>
		<button class="relative p-2" onclick={handleNotificationClick}>
			<Bell size={20} />
			{#if notifications > 0}
				<span
					class="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
				>
					{notifications}
				</span>
			{/if}
		</button>
	</header>
	<!-- Bottom navigation for mobile -->
	<nav class="fixed bottom-0 left-0 right-0 z-50 bg-base-200 text-white shadow-lg md:hidden">
		<div class="flex justify-around p-4">
			{#each [{ id: 'stats', icon: ChartBar, text: 'Dashboard' }, { id: 'profile', icon: User, text: 'Profile' }, { id: 'security', icon: Shield, text: 'Security' }, { id: 'logout', icon: LogOut, text: 'Logout', onClick: handleLogout, class: 'text-red-600' }] as item}
				<button
					class="flex flex-col items-center space-y-1 {item.class || ''} {activeTab === item.id
						? 'text-primary'
						: 'hover:text-primary/80'}"
					onclick={item.onClick || (() => (activeTab = item.id))}
				>
					<svelte:component this={item.icon} size={20} />
					<span class="text-xs">{item.text}</span>
				</button>
			{/each}
		</div>
	</nav>
	<!-- Main content -->
	<main class="mb-16 flex-1 p-6 text-base-200 md:mb-0 md:ml-64">
		{#if activeTab === 'stats'}
			<!-- Dashboard content -->
			<div class="stats stats-vertical my-4 w-full shadow lg:stats-horizontal">
				{#each [{ title: 'Total Points', icon: Award, value: member.points + ' pts', sub: '' }, { title: 'Rank', icon: ChartColumnIcon, value: `${rankMap.get(member.username)} / ${members.length} ` }, { title: 'Events Registered', icon: Calendar, value: `${member.event_attendee.length}/${data.events.length}`, sub: '' }, { title: 'Events attended', icon: CalendarCheck, value: `${member.event_attendee.filter((a) => a.status == 'attended').length}/${member.event_attendee.length}`, sub: '' }] as stat}
					<div class="stat">
						<div class="stat-figure">
							<svelte:component this={stat.icon} class="text-primary" size={24} />
						</div>
						<div class="stat-title">{stat.title}</div>
						<div class="stat-value">{stat.value}</div>
						<div class="stat-desc">{stat.sub}</div>
					</div>
				{/each}
			</div>
			{#if birthDayCountdown < 60}
				<div class="my-4 rounded-xl bg-white p-6 shadow-md">
					<h3 class="mb-4 text-xl font-semibold">Birthday Countdown</h3>
					<div class="flex items-center space-x-4">
						<span class="font-bold text-primary">
							{#if birthDayCountdown === 0}
								<span class="text-xl text-red-600">🎉 It's your birthday today! 🎉</span>
							{:else}
								<p class="font-medium">Your birthday is:</p>

								{#if birthDayCountdown > 0}
									{birthDayCountdown}
									{#if birthDayCountdown === 1}day{:else}days{/if} away
								{:else}
									<span class="text-sm text-gray-500"
										>Your birthday has passed this year. It's in {Math.abs(birthDayCountdown)} days.</span
									>
								{/if}
							{/if}
						</span>
					</div>
				</div>
			{/if}

			<!-- Interests and Activity -->
			<div class="space-y-6">
				<div class="rounded-xl bg-white p-6 shadow-md">
					<h3 class="mb-4 text-xl font-semibold">Interests & Skills</h3>
					<div class="flex flex-wrap gap-2">
						{#each member.interests.split(',') as interest}
							<span class="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
								>{interest}</span
							>
						{/each}
					</div>
				</div>
				<div class="space-y-6">
					<div class="rounded-xl bg-white p-6 shadow-md">
						<CalendarView events={data.events} />
					</div>
				</div>

				<div class="rounded-xl bg-white p-6 shadow-md">
					<h3 class="mb-4 text-xl font-semibold">Upcoming Events and sessions</h3>
					<div class="space-y-4">
						{#each data.events
							.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
							.slice(0, 5) as event}
							<div class="flex items-start">
								<div class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
								<div class="ml-4">
									<p class="font-medium">{event.topic}</p>
									<p class="font-medium">Venue: <span class="font-bold">{event.venue}</span></p>
									<p class="text-sm text-gray-600">
										{moment(event.date).format('LLL')}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if activeTab === 'profile'}
			<Profile memberData={member} />
		{:else if activeTab === 'security'}
			<!-- Security content -->
			<Page />
		{/if}
	</main>
</div>

<style>
	/* Add any custom styles here */
	:global(.btn) {
		@apply rounded-lg px-4 py-2 font-medium transition-all duration-200;
	}

	:global(.btn-primary) {
		@apply bg-primary text-white hover:bg-primary/90;
	}

	:global(.btn-outline-primary) {
		@apply border-2 border-primary text-primary hover:bg-primary hover:text-white;
	}

	:global(.input) {
		@apply rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50;
	}

	:global(.input-bordered) {
		@apply border-gray-300;
	}
</style>
