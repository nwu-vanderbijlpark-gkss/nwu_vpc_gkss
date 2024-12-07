<script>
	import '../app.css';
	import Header from '../components/Header.svelte';
	let { children } = $props();
</script>
<Header/>
<div class="mt-[70px] p-5">
{@render children()}
</div>
