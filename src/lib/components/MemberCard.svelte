<script>
	import { fade, fly } from 'svelte/transition';

	let { member, text } = $props();
	// function to handle multiple terms
	function highlightText(fullText, match) {
		if (!match) return fullText;

		// Split the match variable into individual words or phrases
		const terms = match.split(/\s+/); // Split by spaces or other delimiters

		// Create a regex to match all terms
		const regex = new RegExp(`(${terms.join('|')})`, 'gi');

		// Highlight matching terms in the full text
		return fullText
			.split(regex)
			.map((part) =>
				terms.some((term) => part.toLowerCase() === term.toLowerCase())
					? `<span class="bg-primary/30">${part}</span>`
					: part
			)
			.join('');
	}
</script>

<div transition:fly class="flex rounded-lg border p-3 lg:hover:scale-105 lg:hover:shadow">
	<a
		class="mr-2 h-[50px] w-[50px] overflow-hidden rounded-full border-2"
		href={`/community/${member.username}`}
	>
		<img class="object-fit" src={member.image} alt={member.username} />
	</a>
	<a class="" href={`/community/${member.username}`}>
		<h2 class="link-hover text-lg font-bold">
			{@html member.name ? highlightText(member.name + ' ' + member.surname, text) : ''}
		</h2>
		<p class="text-sm text-primary">{@html highlightText('@' + member.username, text)}</p>
	</a>
</div>
