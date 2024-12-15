export async function load({locals: {supabase},request,params}) {
    //fetch the topic, likes of the topic and also the comments of the topic
    const topic_id = params.id;
    const {data: Forum_topic, error} = await supabase.from("Forum_topic").select("*, Member(username)").eq("id",topic_id);
    console.log(Forum_topic)
    if(error){
        console.error(error)
    }
    const {data: Topic_likes} = await supabase.from("Topic_likes").select('*', { count: 'exact'}).eq("topic_id",topic_id);
    const {data: Comment} = await supabase.from("Comment").select("*, Member(username)").eq("topic_id",topic_id).order('created_at', { ascending: false });
    //we have 3 objects, Topic, Topic_likes and Comment, add them
    let topic_likes,comment;
    if(Topic_likes == null){
        topic_likes = {count: 0}
    }
    else{
        topic_likes = {count: Topic_likes.length};
    }
   return {id:Forum_topic[0].id,topic: Forum_topic[0].topic,content:Forum_topic[0].content,created_at:Forum_topic[0].created_at,
    topic_likes: topic_likes,comments: Comment, username: Forum_topic[0].Member.username}

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
