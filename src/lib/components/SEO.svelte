<script>
	let {
		title,
		keywords = 'NWU, nwu vaal gkss, geekulcha, student, society, student society, north west university, vaal triangle, vaal university',
		desc,
		image = 'https://nwu-vaal-gkss.netlify.app/icon.png',
		langs = ['en-ZA', 'en-US']
	} = $props();
</script>

<svelte:head>
	<title>{title} | GKSS-NWU</title>
	<meta name="description" content={desc} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={title} />

	<meta name="keywords" content="{keywords}, nwu, gkss" />
	<meta name="language" content={langs.join(',')} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={image} />

	<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
</svelte:head>
