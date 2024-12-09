  

<script>
	import '../app.css';
	import Header from '../components/Header.svelte';
	let { children } = $props();
</script>
<Header/>
<div class="mt-[65px]">
{@render children()}
</div>
