<script>
	import moment from 'moment';
	import { notifications } from '$lib/stores';
	import QrCode from 'svelte-qrcode';
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
		CalendarCheck,
		BriefcaseBusiness,
		Linkedin,
		Github,
		Edit,
		Save,
		Link
	} from 'lucide-svelte';
	import Profile from './components/Profile.svelte';
	import Invite from './components/Invite.svelte';

	import { fade, fly, slide } from 'svelte/transition';
	import CalendarView from '$lib/components/CalendarView.svelte';
	import Page from '../../update-password/+page.svelte';
	import Announcements from './components/Announcements.svelte';
	import { models } from '$lib/state.svelte';
	import LogoutModal from '$lib/components/LogoutModal.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import { gkssConfig } from '$lib/config';

	let activeTab = $state('stats');
	let { data } = $props();
	let member = $state(data.member);
	models.context = 'This User: ' + JSON.stringify(member);

	let editLinks = $state(false);
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
	};
	let members = $state(
		data.members
			?.filter((m) => m.name && m.username) // Filter valid members
			?.sort((a, b) => b.points - a.points)
	);
	// Build a Map where each username maps to its rank
	const rankMap = new Map();
	members?.forEach((person, index) => {
		rankMap.set(person.username, index + 1);
	});
	let errors = $state({});
	const addPrefix = (event) => {
		if (!event.target.value.includes('https://'))
			member[event.target.name] = `https://${event.target.value}`;
	};

	const handleEditLinks = async () => {
		errors = null;
		if (member.portfolio || member.linkedin || member.github) {
			//handle links separately and show errors where possible
			if (member.portfolio && !member.portfolio.includes('https://')) {
				errors = { ...errors, portfolio: 'Please add a valid Portfolio link' };
			}
			if (member.linkedin && !member.linkedin.includes('linkedin.com/in/')) {
				errors = { ...errors, linkedin: 'Please add a valid LinkedIn link' };
			}
			if (member.github && !member.github.includes('github.com/')) {
				errors = { ...errors, github: 'Please add a valid Github link' };
			}
			editLinks = errors ? true : false; //close the edit mode if there are no errors
			if (!errors) {
				//send to database
				const res = await fetch('/api/user/updateLinks', {
					method: 'POST',
					body: JSON.stringify({
						portfolio: member.portfolio,
						linkedin: member.linkedin,
						github: member.github
					})
				});
				const result = await res.json();
				if (result.success) {
					//do something
					notifications.add({
						type: 'success',
						message: 'Links updated successfully!',
						timeout: 3000
					});
				} else {
					notifications.add({
						type: 'error',
						message: 'Unable to add links',
						timeout: 3000
					});
				}
			}
		} else {
			//handle required errors
			errors = { ...errors, all: 'Please add at least one link' };
		}
	};
</script>

<Seo
	title="Dashboard"
	desc="Access your personalized dashboard on {gkssConfig.name}. View your profile, track your points, manage events, and stay updated with the latest announcements."
/>

<LogoutModal />

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
<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="flex min-h-screen flex-col bg-gray-100 md:flex-row"
>
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
				<p class="text-sm text-gray-200">{member.qualification}</p>
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
		<a href="/dashboard/announcements" class="relative p-2">
			<Bell size={20} />
			{#if notifications > 0}
				<span
					class="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
				>
					{$notifications.length}
				</span>
			{/if}
		</a>
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
	<main
		in:fly={{ x: 100, duration: 400 }}
		out:fade={{ duration: 300 }}
		class="mb-16 flex-1 p-6 text-base-200 md:mb-0 md:ml-64"
	>
		{#if activeTab === 'stats'}
			<!-- Dashboard content -->
			<div class="stats stats-vertical my-4 w-full shadow lg:stats-horizontal">
				{#each [{ title: 'Total Points', icon: Award, value: member.points + ' pts', sub: '' }, { title: 'Your Rank', icon: ChartColumnIcon, value: `${rankMap.get(member.username)} / ${members.length} ` }, { title: 'Events you registered for', icon: Calendar, value: `${member.event_participant.length}`, sub: '' }] as stat}
					<div class="stat">
						<div class="stat-figure">
							<stat.icon class="text-primary" size={24} />
						</div>
						<div class="stat-title">{stat.title}</div>
						<div class="stat-value">{stat.value}</div>
						<div class="stat-desc">{stat.sub}</div>
					</div>
				{/each}
			</div>

			<Announcements />
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="mb-4 text-xl font-semibold">Upcoming Events and sessions</h3>
				<div class="space-y-4">
					{#each data.events
						.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
						.slice(0, 5) as event}
						<a
							href="/events/{event.id}"
							class="flex items-start rounded-xl border bg-gray-100 p-2 hover:bg-gray-200"
						>
							<div class="ml-4">
								<p class="font-bold">{event.topic}</p>
								<p class="text-sm font-medium">
									Venue: <span class="font-bold">{event.venue}</span>
								</p>
								<p class="text-sm text-gray-600">
									{moment(event.date).format('LLL')}
								</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
			<div class="my-4 space-y-2 rounded-xl bg-white p-6 shadow-md">
				<div class="flex items-center justify-between">
					<h2 class="flex items-center gap-2 text-lg font-bold">Your links <Link /></h2>
					<button
						class="btn btn-primary"
						onclick={() => {
							if (editLinks) {
								//submit
								handleEditLinks();
							} else {
								editLinks = true;
							}
						}}
					>
						{#if editLinks}
							<Save />Save
						{:else}
							<Edit />Edit Links
						{/if}
					</button>
				</div>
				{#if !editLinks}
					<div class="flex flex-col items-start gap-2">
						<a
							href={`/community/profile`}
							class="inline-flex items-center gap-2 text-primary hover:text-primary/80"
						>
							<img
								src="/icon.png"
								alt="{gkssConfig.name}Member Profile"
								class="h-5 w-5 rounded-full"
							/>
							<span class="text-sm font-medium">@{member.username}</span>
						</a>
						<a
							href={member.portfolio}
							target="_blank"
							class="inline-flex items-center gap-2 text-primary hover:text-primary/80"
						>
							<BriefcaseBusiness class="h-5 w-5" />
							<span class="text-sm font-medium"
								>{member.portfolio
									? member.portfolio.replace('https://', '')
									: 'No Portfolio Link'}</span
							>
						</a>
						<a
							href={member.linkedin}
							target="_blank"
							class="flex items-center gap-2 text-[#0A66C2]"
						>
							<Linkedin class="h-5 w-5 text-[#0A66C2]" />
							<span class="text-sm font-medium"
								>{member.linkedin
									? member.linkedin.replace('https://', '')
									: 'No LinkedIn Link'}</span
							>
						</a>
						<a href={member.github} target="_blank" class="flex items-center gap-2">
							<Github class="h-5 w-5 text-gray-800" />
							<span class="text-sm font-medium"
								>{member.github ? member.github.replace('https://', '') : 'No Github Link'}</span
							>
						</a>
					</div>
				{:else}
					<form class="flex flex-col items-start gap-2">
						<p class="text-sm text-red-500">{errors ? errors.all : ''}</p>

						<div class="w-full">
							<p class="text-sm font-bold">Portfolio link</p>
							<label
								for="portfolio"
								class="input input-bordered flex w-full items-center gap-2 bg-gray-200"
							>
								<BriefcaseBusiness class="text-primary hover:text-primary/80" />
								<input
									bind:value={member.portfolio}
									type="url"
									name="portfolio"
									placeholder="Portfolio Link"
									class="w-full"
									onclick={addPrefix}
								/>
							</label>
							<p class="text-sm text-red-500">{errors ? errors.portfolio : ''}</p>
						</div>
						<div class="w-full">
							<p class="text-sm font-bold">LinkedIn link</p>
							<label
								for="linkedin"
								class="input input-bordered flex w-full items-center gap-2 bg-gray-200"
							>
								<Linkedin class="text-[#0A66C2]" />
								<input
									bind:value={member.linkedin}
									type="url"
									name="linkedin"
									placeholder="LinkedIn Link"
									class="w-full"
									onclick={addPrefix}
								/>
							</label>
							<p class="text-sm text-red-500">{errors ? errors.linkedin : ''}</p>
						</div>
						<div class="w-full">
							<p class="text-sm font-bold">Github link</p>
							<label
								for="github"
								class="input input-bordered flex w-full items-center gap-2 bg-gray-200"
							>
								<Github />
								<input
									bind:value={member.github}
									type="url"
									name="github"
									placeholder="Github Link"
									class="w-full"
									onclick={addPrefix}
								/>
							</label>
							<p class="text-sm text-red-500">{errors ? errors.github : ''}</p>
						</div>
					</form>
				{/if}
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
