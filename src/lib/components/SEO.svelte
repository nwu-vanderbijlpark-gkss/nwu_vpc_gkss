<script>
	import { gkssConfig } from '$lib/config';

	let {
		title,
		keywords = `${gkssConfig.name}, ${gkssConfig.socials.github}, gkss, geekulcha, student, society, student society,`,
		desc,
		image = '/icon.png',
		langs = ['en-ZA', 'en-US']
	} = $props();
</script>

<svelte:head>
	<title>{title} | {gkssConfig.name}</title>
	<meta name="description" content={desc} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={title} />

	<meta name="keywords" content="{keywords}, gkss" />
	<meta name="language" content={langs.join(',')} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={image} />

	<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
</svelte:head>
