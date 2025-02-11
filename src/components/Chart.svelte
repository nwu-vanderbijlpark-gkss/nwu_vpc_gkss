<script>
	import Chart from 'chart.js/auto';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment'; // Ensure it runs only on the client

	let { title, yValues, yLabel, xValues, xLabel, chartType, backgroundColor, borderColor } =
		$props();

	let chartCanvas;
	let chartInstance;

	function createChart() {
		if (!browser || !chartCanvas) return;

		if (chartInstance) {
			chartInstance.destroy(); // Destroy previous instance
		}

		// Default colors for pie/doughnut charts
		const defaultColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

		const data = {
			labels: xValues,
			datasets: [
				{
					label: title,
					data: yValues,
					backgroundColor:
						chartType === 'pie' || chartType === 'doughnut'
							? defaultColors.slice(0, yValues.length)
							: backgroundColor || 'black',
					borderColor:
						chartType === 'pie' || chartType === 'doughnut'
							? defaultColors.slice(0, yValues.length)
							: borderColor || 'black',
					borderWidth: 2
				}
			]
		};

		chartInstance = new Chart(chartCanvas, {
			type: chartType ? chartType.toLowerCase() : 'bar',
			data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					datalabels: {
						color: '#fff',
						anchor: 'center',
						align: 'center',
						font: { weight: 'bold', size: 14 },
						formatter: (value) => value // Show actual values
					}
				},
				scales: ['pie', 'doughnut'].includes(chartType)
					? {}
					: {
							x: {
								title: {
									display: true,
									text: xLabel || 'X-Axis',
									font: { size: 14 }
								}
							},
							y: {
								beginAtZero: true,
								title: {
									display: true,
									text: yLabel || 'Y-Axis',
									font: { size: 14 }
								}
							}
						}
			},
			plugins: [ChartDataLabels] // Enable data labels plugin
		});
	}

	onMount(() => {
		if (browser) {
			createChart();
			window.addEventListener('resize', createChart);
		}
	});

	onDestroy(() => {
		if (browser && chartInstance) {
			chartInstance.destroy();
			window.removeEventListener('resize', createChart);
		}
	});
</script>

<!-- Tailwind Responsive Styling -->
<div class="mx-auto w-full max-w-md p-4 md:max-w-lg lg:max-w-xl">
	<div class="relative h-64 w-full md:h-72">
		<canvas bind:this={chartCanvas} class="h-full w-full"></canvas>
	</div>
</div>
