
export const load = async({locals: {supabase}}) =>{
    const {data, error} = await supabase.from("Events")
                        .select('*')                      
    if(!data){
        console.error("error")
        console.error(error)
    }
    else{
        return {events: data};
    }

}
/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({locals: {supabase}, request}) => {
		// TODO log the user in
        const data = await request.formData();
        const { error } = await supabase
        .from('Events')
        .insert({  topic: data.get('topic'),
            description: data.get('description'),
            date: data.get('date')
         })

         if(error){
            console.log(error);
         }

	}
};