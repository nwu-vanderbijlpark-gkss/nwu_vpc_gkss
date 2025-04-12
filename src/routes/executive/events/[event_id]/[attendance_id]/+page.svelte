<script>
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let { data } = $props();

	// SVG illustrations
	const qrSuccess = `
		<svg class="h-32 w-32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M5 7H7V5H5V7ZM5 5H3V3H5V5ZM7 3H9V5H7V3ZM3 11H5V9H3V11ZM5 9H7V7H5V9ZM7 11H9V9H7V11ZM3 15H5V13H3V15ZM5 13H7V11H5V13Z" fill="currentColor"/>
			<path d="M9 5H11V7H13V9H15V11H17V13H19V15H21V17H19V19H17V21H11V19H9V17H7V15H5V13H3V11H5V9H7V7H9V5Z" fill="currentColor"/>
			<path d="M19 5H21V7H19V5ZM17 7H19V9H17V7ZM15 9H17V11H15V9ZM13 11H15V13H13V11ZM11 13H13V15H11V13ZM9 15H11V17H9V15ZM15 15H17V17H15V15ZM17 17H19V19H17V17Z" fill="currentColor"/>
			<path d="M9 9H11V11H9V9ZM13 13H15V15H13V13Z" fill="#34D399"/>
		</svg>
	`;

	const checkmark = `
		<svg class="h-20 w-20 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
		</svg>
	`;

	onMount(async () => {
		if (data.success) {
			let data = {
				subject: 'Event Attendance confirmation',
				hideSalutations: true,
				message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background-color: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #fff; padding: 16px; border-radius: 6px; border: 1px solid #ddd;">
				Your attendance has been recorded for ${data.info.Events.topic}<br/>
				You have been awarded 100 points, thank you for your attendance, enjoy!
            </div>
        </div>
    `
			};

			const res = await fetch('/api/sendEmail', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data })
			});
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
	<div
		class="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg transition-all duration-300"
	>
		{#if data.success}
			<div in:fade class="flex flex-col items-center space-y-4">
				<div class="animate-bounce">
					{@html qrSuccess}
				</div>
				<h2 class="text-center text-3xl font-bold text-gray-800">
					Confirmed! 🎉
					<span class="mt-2 block text-lg font-normal text-gray-600"> See you at the event! </span>
				</h2>

				<div class="w-full space-y-4 rounded-lg bg-green-50 p-4">
					<div class="flex items-center space-x-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							👤
						</div>
						<div>
							<p class="font-medium text-gray-900">
								{data.info.Member.name}
								{data.info.Member.surname}
							</p>
							<p class="text-sm text-gray-500">
								{data.info.Member.gender}
							</p>
						</div>
					</div>
					<div class="flex items-center space-x-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							📅
						</div>
						<div>
							<p class="text-sm text-gray-500">Registration Time</p>
							<p class="font-medium text-gray-900">
								{new Date(data.info.created_at).toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			</div>
		{:else if data.message === 'You have already confirmed your attendance'}
			<div in:fade class="flex flex-col items-center space-y-6">
				<div class="text-blue-500">
					{@html checkmark}
				</div>
				<h2 class="text-center text-2xl font-bold text-gray-800">
					Welcome Back! ✨
					<span class="mt-2 block text-lg font-normal text-gray-600">
						You have already confirmed your attendance
					</span>
				</h2>
				<div class="w-full space-y-4 rounded-lg bg-green-50 p-4">
					<div class="flex items-center space-x-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							👤
						</div>
						<div>
							<p class="font-medium text-gray-900">
								{data.info.Member.name}
								{data.info.Member.surname}
							</p>
							<p class="text-sm text-gray-500">
								{data.info.Member.gender}
							</p>
						</div>
					</div>
					<div class="flex items-center space-x-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							📅
						</div>
						<div>
							<p class="text-sm text-gray-500">Registration Time</p>
							<p class="font-medium text-gray-900">
								{new Date(data.info.created_at).toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div in:fade class="flex flex-col items-center space-y-6">
				<div class="text-red-500">
					<svg class="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h2 class="text-center text-2xl font-bold text-gray-800">
					Oops! 😕
					<span class="mt-2 block text-lg font-normal text-gray-600">
						{data.message}
					</span>
				</h2>
			</div>
		{/if}

		<div class="pt-6 text-center text-sm text-gray-500">🔒 Your information is securely stored</div>
	</div>
</div>
