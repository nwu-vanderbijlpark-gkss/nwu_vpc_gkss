  

<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	let { children } = $props();
</script>
<Header/>
<div class="mt-[65px] min-h-screen">
{@render children()}
</div>
<Footer/>
