<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Opportunity from '$lib/components/Opportunity.svelte';
	import NotFoundPage from '$lib/components/NotFoundPage.svelte';
	import Seo from '$lib/components/SEO.svelte';

	let { data } = $props();

	let opportunity = $state(
		data.opportunities.filter((opportunity) => opportunity.id == $page.params.opportunity)[0]
	);
</script>

<Seo
	title={opportunity ? opportunity.title : 'Opportunity not found'}
	desc={opportunity ? opportunity.description : 'The requested opportunity could not be found.'}
/>

{#if opportunity}
	<Opportunity {opportunity} showContent={true} />
{:else}
	<NotFoundPage title="Opportunity not found" homeUrl="/community/opportunities" />
{/if}
