<script>
	// This member can view stats and charts

	import { slide } from 'svelte/transition';
	import moment from 'moment';
	import { CalendarClockIcon, Users } from 'lucide-svelte';
	import Chart from '../../components/Chart.svelte';
	import TodaysBirthdays from '../../components/TodaysBirthdays.svelte';
	let { data } = $props();
	let year = new Date();
	let levels_of_study = ['1st', '2nd', '3rd', '4th', '4th+'];
	let todaysBirthdays = data.members.filter((member) => {
		const today = new Date();
		const birthDate = new Date(member.date_of_birth);

		// Check if the member's birthday is today (ignore the year)
		return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
	});
	year = year.getFullYear();
	let memberDetailed = $state({
		gender: { males: 0, females: 0, other: 0 },
		ages: [],
		year_of_study: [
			{ year: '1st', count: 0 },
			{ year: '2nd', count: 0 },
			{ year: '3rd', count: 0 },
			{ year: '4th', count: 0 }
		],
		interests: [],
		interestsDetailed: []
	});
	// Object to store interest counts for faster lookup
	const interestMap = new Map();

	for (const member of data.members) {
		if (member.interests) {
			for (const interest of member.interests.split(',')) {
				if (interestMap.has(interest)) {
					// Increment count if interest already exists
					interestMap.get(interest).count += 1;
				} else {
					// Add new interest with count 1
					interestMap.set(interest, { name: interest, count: 1 });
				}
			}
		}
	}
	// Convert map values to an array
	memberDetailed.interestsDetailed = Array.from(interestMap.values());
	/**YEAR OF STUDY*/
	for (const member of data.members) {
		if (member.year_of_study) {
			if (levels_of_study.includes(member.year_of_study)) {
				memberDetailed.year_of_study[levels_of_study.indexOf(member.year_of_study)].count++;
			}
		}
	}

	//find the sum of males and females
	for (const member of data.members) {
		if (member.gender) {
			if (member.gender.toLowerCase() == 'male') {
				memberDetailed.gender.males++;
			} else if (member.gender.toLowerCase() == 'female') {
				memberDetailed.gender.females++;
			} else {
				memberDetailed.gender.other++;
			}
		}
	}
	//get the percentages
	memberDetailed.gender.males = ((memberDetailed.gender.males / data.members.length) * 100).toFixed(
		1
	);
	memberDetailed.gender.females = (
		(memberDetailed.gender.females / data.members.length) *
		100
	).toFixed(1);
</script>

<div class="overflow-auto p-6 lg:max-h-[85svh]">
	<h1 class="my-3 text-center text-2xl font-extrabold text-primary">Executive Dashboard</h1>

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
			<div class="stat-figure text-primary"></div>
			<div class="stat-title">Males</div>
			<div class="stat-value text-primary">{memberDetailed.gender.males}%</div>
		</div>
		<div class="stat">
			<div class="stat-figure text-primary"></div>
			<div class="stat-title">Females</div>
			<div class="stat-value text-primary">{memberDetailed.gender.females}%</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-secondary">
				<CalendarClockIcon />
			</div>
			<div class="stat-title">Total Events</div>
			<div class="stat-value text-secondary">{data.events.length}</div>
			<div class="stat-desc">
				Events for the year: {year}
			</div>
		</div>
	</div>
	<h1 class="my-3 text-center text-2xl font-extrabold text-primary">Charts</h1>
	<div class="flex w-full flex-col py-3 lg:grid lg:grid-cols-2">
		<div>
			<h2 class="text-center text-lg font-bold text-base-200">Student interests in tech</h2>
			<Chart
				yValues={memberDetailed.interestsDetailed.map((interest) => interest.count)}
				xValues={memberDetailed.interestsDetailed.map((interest) => interest.name)}
				title="Students"
				backgroundColor="red"
				borderColor="red"
				xLabel="Interest"
				yLabel="Number of students"
			/>
		</div>
		<div>
			<h2 class="text-center text-lg font-bold text-base-200">Students per year of study</h2>
			<Chart
				yValues={memberDetailed.year_of_study.map((interest) => interest.count)}
				xValues={memberDetailed.year_of_study.map((interest) => interest.year)}
				title="Students"
				backgroundColor="red"
				borderColor="red"
				xLabel="Interest"
				yLabel="Number of students"
				chartType="pie"
			/>
		</div>
	</div>
	<div>
		<TodaysBirthdays {todaysBirthdays} />
	</div>
</div>

<style>
</style>
