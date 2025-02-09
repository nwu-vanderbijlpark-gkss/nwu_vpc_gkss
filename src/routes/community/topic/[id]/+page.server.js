

export const actions =   {
    default: async({locals: {supabase},request,params}) => {
    //add a comment to db
        const {data: {user}} = await supabase.auth.getUser();
        const form = await request.formData();
        const topic_id = params.id;
        const comment = form.get("comment");

        const {error} = await supabase.from("Comment").insert(
            {
                topic_id: topic_id,
                author_id: user.id,
                content: comment,
            }
        )
        if(error){
            console.error(error)
        }
    }
}
