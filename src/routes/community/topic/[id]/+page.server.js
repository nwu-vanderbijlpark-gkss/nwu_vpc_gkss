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
    
    //fetch the topic, likes of the topic and also the comments of the topic
    
    const {data: Forum_topic, error} = await supabase.from("Forum_topic").select("*, Member(username)").eq("id",topic_id);
    if(error){
        console.error(error)
    }
    const {data: topic_views} = await supabase.from("topic_views").select('*').eq("topic_id",topic_id);
    const {data: Comment} = await supabase.from("Comment").select("*, Member(username)").eq("topic_id",topic_id).order('created_at', { ascending: false });
    //we have 3 objects, Topic, Topic_likes and Comment, add them
    let view_count,comment;
    if(topic_views == null){
        view_count= {count: 0}
    }
    else{
        view_count = {count: topic_views.length};
    }
   return {id:Forum_topic[0].id,topic: Forum_topic[0].topic,content:Forum_topic[0].content,created_at:Forum_topic[0].created_at,
    views: view_count,comments: Comment, username: Forum_topic[0].Member.username}

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
    }
}
