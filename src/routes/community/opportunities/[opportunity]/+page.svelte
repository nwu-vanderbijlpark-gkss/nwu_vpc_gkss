<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Opportunity from '../../../../components/Opportunity.svelte';

	let { data } = $props();

	let opportunity = $state(
		data.opportunities.filter((opportunity) => opportunity.id == $page.params.opportunity)[0]
	);
</script>

<Opportunity {opportunity} showContent={true} />
