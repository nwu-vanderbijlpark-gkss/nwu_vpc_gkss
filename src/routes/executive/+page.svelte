<script>
	import { fade, fly, slide } from 'svelte/transition';
	import moment from 'moment';
	import { CalendarClockIcon, Users } from 'lucide-svelte';
	import Chart from '../../components/Chart.svelte';
	import TodaysBirthdays from '../../components/TodaysBirthdays.svelte';
	import CalendarView from '../../components/CalendarView.svelte';

	let { data } = $props();

	// Constants
	const LEVELS_OF_STUDY = ['1st', '2nd', '3rd', '4th', '4th+'];
	const CURRENT_YEAR = new Date().getFullYear();

	// Reactive state
	let memberDetailed = $state({
		gender: { males: 0, females: 0, other: 0 },
		year_of_study: LEVELS_OF_STUDY.map((year) => ({ year, count: 0 })),
		interestsDetailed: []
	});

	// Derived data
	let todaysBirthdays = $state(
		data.members.filter((member) => {
			const today = new Date();
			const birthDate = new Date(member.date_of_birth);
			return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
		})
	);

	// Process member data
	$derived: {
		const interestMap = new Map();
		const genderCounts = { males: 0, females: 0, other: 0 };

		for (const member of data.members) {
			// Process interests
			if (member.interests) {
				member.interests.split(',').forEach((interest) => {
					const trimmedInterest = interest.trim();
					interestMap.set(trimmedInterest, (interestMap.get(trimmedInterest) || 0) + 1);
				});
			}

			// Process year of study
			if (member.year_of_study && LEVELS_OF_STUDY.includes(member.year_of_study)) {
				const index = LEVELS_OF_STUDY.indexOf(member.year_of_study);
				memberDetailed.year_of_study[index].count++;
			}

			// Process gender
			if (member.gender) {
				const gender = member.gender.toLowerCase();
				if (gender === 'male') genderCounts.males++;
				else if (gender === 'female') genderCounts.females++;
				else genderCounts.other++;
			}
		}

		// Convert interest map to array
		memberDetailed.interestsDetailed = Array.from(interestMap.entries()).map(([name, count]) => ({
			name,
			count
		}));

		// Calculate gender percentages
		const totalMembers = data.members.length;
		memberDetailed.gender = {
			males: totalMembers ? ((genderCounts.males / totalMembers) * 100).toFixed(1) : 0,
			females: totalMembers ? ((genderCounts.females / totalMembers) * 100).toFixed(1) : 0,
			other: totalMembers ? ((genderCounts.other / totalMembers) * 100).toFixed(1) : 0
		};
	}
</script>

<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="overflow-auto p-6 lg:max-h-[90svh]"
>
	<h1 class="my-3 text-center text-2xl font-extrabold text-primary">Executive Dashboard</h1>

	<!-- Statistics Cards -->
	<div class="stats stats-vertical w-full shadow lg:stats-horizontal">
		<div class="stat">
			<div class="stat-figure text-primary">
				<Users />
			</div>
			<div class="stat-title">Total Members</div>
			<div class="stat-value text-primary">{data.members.length}</div>
			<div class="stat-desc">Members signed up on this system</div>
		</div>

		<div class="stat">
			<div class="stat-title">Gender Distribution</div>
			<div class="stat-value text-primary">{memberDetailed.gender.males}%</div>
			<div class="stat-desc">Male</div>
			<div class="stat-value text-primary">{memberDetailed.gender.females}%</div>
			<div class="stat-desc">Female</div>
			<div class="stat-value text-primary">{memberDetailed.gender.other}%</div>
			<div class="stat-desc">Other</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-secondary">
				<CalendarClockIcon />
			</div>
			<div class="stat-title">Total Events</div>
			<div class="stat-value text-secondary">{data.events.length}</div>
			<div class="stat-desc">Events for {CURRENT_YEAR}</div>
		</div>
	</div>

	<!-- Charts Section -->
	<h2 class="my-3 text-center text-2xl font-extrabold text-primary">Charts</h2>
	<div class="grid gap-6 py-3 lg:grid-cols-2">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h3 class="card-title text-center text-lg font-bold">Student Interests in Tech</h3>
				<Chart
					yValues={memberDetailed.interestsDetailed.map((i) => i.count)}
					xValues={memberDetailed.interestsDetailed.map((i) => i.name)}
					title="Students"
					backgroundColor="rgba(255, 99, 132, 0.2)"
					borderColor="rgba(255, 99, 132, 1)"
					xLabel="Interest"
					yLabel="Number of Students"
				/>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h3 class="card-title text-center text-lg font-bold">Year of Study Distribution</h3>
				<Chart
					yValues={memberDetailed.year_of_study.map((y) => y.count)}
					xValues={memberDetailed.year_of_study.map((y) => y.year)}
					title="Year of Study"
					backgroundColor={[
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)'
					]}
					borderColor={[
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)'
					]}
					xLabel="Year of Study"
					yLabel="Number of Students"
					chartType="pie"
				/>
			</div>
		</div>
	</div>

	<!-- Today's Birthdays -->
	<div class="mt-6">
		<TodaysBirthdays {todaysBirthdays} />
	</div>
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<CalendarView events={data.events} />
		</div>
	</div>
</div>

<style>
	/* Responsive adjustments */
	@media (max-width: 1024px) {
		.stats {
			flex-direction: column;
		}
	}

	/* Smooth transitions */
	.card {
		transition: transform 0.2s ease-in-out;
	}

	.card:hover {
		transform: translateY(-2px);
	}
</style>
