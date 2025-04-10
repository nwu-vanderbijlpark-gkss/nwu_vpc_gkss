<script>
	let { text } = $props();
</script>

<div class="flex items-center justify-center gap-3 p-5">
	<p class="font-bold">{text || 'Loading, please wait...'}</p>
	<span class="loading loading-spinner loading-lg text-primary"></span>
</div>
