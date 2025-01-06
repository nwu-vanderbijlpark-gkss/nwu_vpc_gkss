//get all the topics, get the likes of each topic, get the comments of each topic
export async function load({locals: {supabase}}) {
    let finalObject = null;
    let finalArray = [];
    //get the topics
    const {data: Forum_topic, error} = await supabase.from("Forum_topic").select("*, Member(username)").order('created_at', { ascending: false });
    if(error){
        console.error(error)
    }else{
        //get the likes of each topic
        for(let i =0; i < Forum_topic.length;i++){
            let topic = Forum_topic[i];
            const {data: topic_views} = await supabase.from("topic_views").select('*').eq("topic_id",topic.id);
            const {data: Comment} = await supabase.from("Comment").select('*', { count: 'exact'}).eq("topic_id",topic.id);

            let view_count,comment;
            if(topic_views == null){
                view_count = {count: 0}
            }
            else{
                view_count = {count: topic_views.length};
            }
            if(Comment == null){
                comment = {count: 0}
            }
            else{
                comment = {count: Comment.length};
            }
            finalArray.push({id:topic.id,username: topic.Member.username,topic: topic.topic,created_at:topic.created_at,content:topic.content,views: view_count,comments: comment})
        };
        return {feed: finalArray}
    }
    
}
export const actions =   {
    default: async ({locals: {supabase}, request}) => {
        const {data: {user}} = await supabase.auth.getUser();
        const {data:Member,error} = await supabase.from("Member").select().eq("id",user.id);
        if(error){
            console.error(error)
        }else{
            //making a post
            const formData = await request.formData();
            const {data,error} = await supabase.from("Forum_topic").insert({
                topic: formData.get("topic"),
                content: formData.get("content"),
                tags: formData.get("tags"),
                author_id: user.id,
                author_username: Member.username,
            })
    
            if(error){
                console.error(error)
            }
        }
        
        
    }
}