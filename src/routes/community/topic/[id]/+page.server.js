
export async function load({locals: {supabase},request,params}) {
    const topic_id = params.id;//get the topic id from params

    //create/update the topic_views as the topic is being viewed now
    const {data: {user}} = await supabase.auth.getUser();
    if(user){
        const {data} = await supabase.from("topic_views").select("*").eq("user_id",user.id);//get the topics viewed by the current user
        let alreadyExists = false;//check if the view already exists
        for(let i = 0; i < data.length; i++){
            let topic = data[i];
            if(topic.topic_id == topic_id){
                alreadyExists = true;
            }
        }
        if(!alreadyExists){
            //create a new view or new row in the topic_views table
            const {data} = await supabase.from("topic_views").insert({
                topic_id: topic_id,
                user_id: user.id,
            })
        }
    }
}
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
        //award the member with 5 points
        const {data: Member} = await supabase.from("Member").select("points").eq("id",user.id);
        let newPts = Number(Member[0].points) + 5;
        await supabase.from("Member").update({points: newPts}).eq("id",user.id);
    }
}
