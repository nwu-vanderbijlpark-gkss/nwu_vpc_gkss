  

<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	let { children, data } = $props();
</script>
<Header isLoggedIn={data.isLoggedIn} isExecutive={data.isExecutive}/>
<div class="mt-[65px] min-h-screen bg-gray-200">
{@render children()}
</div>
<Footer/>
