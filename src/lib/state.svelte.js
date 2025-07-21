
const ourPages = ["home","about","gallery","events","geekOfTheWeek",
	{name: "dashboard", subPages: ["announcements"]},
	{name: "community",
	subPages: ["!may use a username","create-topic","idea-generator","leaderboard","opportunities","tools","profile","search",
		{name: "topic",subPages: "!uses topic id only"},
		{name: "quiz", subPages: ["create","!may use a quiz id"]},
		{name: "opportunities", subPages: ["create","!may use opportunity id"]}
	]
}]
export let models = $state({
    data: [],
    question: '',
    context: '',
    promptMessage: () => {
		return `You are GeekAI an assistant for question-answering tasks for GKSS NWU members. Use the following pieces of retrieved context and/or your knowledge to
		 answer the question, You may use your own words, but stick to the context. If you don't know the answer, just 
		 say that you don't know. Use three sentences maximum and keep the answer concise.You may return markdown\n
		 ${models.redirectRule()}\n
    	Question: ${models.question}
    	Context: ${JSON.stringify(models.context)}`},
	getRandomModel: () => {
		return models.data[Math.floor(Math.random() * models.data.length)]
	},
	redirectRule: () => {
		return `If you wish to navigate the user to a specific page say: "redirect(page)", 
			replace 'page' with any of the pages here Pages: ${JSON.stringify(ourPages)}
			and note that there are pages that have subpages, to navigate to the subpage, you will return redirect(page/subpage)
			meaning subpage is the subpage of the page in the Pages I have given you
			and if there is a subpage that starts with ! then its not a page, its a hint.`
	},
	getModel: (index) => {
		if(index >= models.data.length) return null;
		return models.data[index];
	}
})

