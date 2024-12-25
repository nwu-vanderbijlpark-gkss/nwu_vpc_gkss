<script>
	import NotFoundPage from '../../components/NotFoundPage.svelte';
	let { data } = $props();
</script>

{#if data.username == null}
	<title>Page Not Found | NWU Vaal GKSS</title>
	<meta property="og:site_name" content="Page Not Found | NWU Vaal GKSS" />
	<meta name="twitter:title" content="Page Not Found | NWU Vaal GKSS" />
	<meta name="twitter:image:alt" content="Page Not Found | NWU Vaal GKSS" />
	<meta property="title" content="Page Not Found" />
	<NotFoundPage />
{:else}
	<title>{data.username} | NWU Vaal GKSS</title>
	<meta property="og:site_name" content={`${data.username} | NWU Vaal GKSS`} />
	<meta name="twitter:title" content={`${data.username} | NWU Vaal GKSS`} />
	<meta name="twitter:image:alt" content={`${data.username} | NWU Vaal GKSS`} />
	<meta property="title" content="User profile" />
	<p>Page in construction...</p>
{/if}
<div></div>
