<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Opportunity from '../../../../components/Opportunity.svelte';
	import NotFoundPage from '../../../../components/NotFoundPage.svelte';

	let { data } = $props();

	let opportunity = $state(
		data.opportunities.filter((opportunity) => opportunity.id == $page.params.opportunity)[0]
	);
</script>

{#if opportunity}
	<title>{opportunity.title}</title>
	<Opportunity {opportunity} showContent={true} />
{:else}
	<title>Opportunity not found</title>
	<NotFoundPage title="Opportunity not found" homeUrl="/community/opportunities" />
{/if}
