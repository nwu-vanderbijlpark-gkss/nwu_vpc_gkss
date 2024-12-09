<script>
    let { data } = $props();
</script>
<title>{data.blog} | NWU Vaal GKSS </title>
<meta property="og:site_name" content={`${data.blog} | NWU Vaal GKSS`} >
<meta name="twitter:title" content={`${data.blog} | NWU Vaal GKSS`}>
<meta name="twitter:image:alt" content={`${data.blog} | NWU Vaal GKSS`}>
<meta property="title" content={data.blog}>
<p>This is a "{data.blog}" blog post</p>