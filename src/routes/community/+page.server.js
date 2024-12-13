//get all the topics, get the likes of each topic, get the comments of each topic
export async function load({locals: {supabase}}) {
    let finalObject = null;
    let finalArray = [];
    //get the topics
    const {data: Forum_topic, error} = await supabase.from("Forum_topic").select("*");
    if(error){
        console.error(error)
    }else{
        //get the likes of each topic
        for(let i =0; i < Forum_topic.length;i++){
            let topic = Forum_topic[i];
            const {data: Topic_likes} = await supabase.from("Topic_likes").select('*', { count: 'exact', head: true }).eq("topic_id",topic.id);
            const {data: Comment} = await supabase.from("Comment").select('*', { count: 'exact', head: true }).eq("topic_id",topic.id);
            //we have 3 objects, Topic, Topic_likes and Comment, add them
            let topic_likes,comment;
            if(Topic_likes == null){
                topic_likes = {count: 0}
            }
            else{
                topic_likes = Topic_likes;
            }
            if(Comment == null){
                comment = {count: 0}
            }
            else{
                comment = Comment;
            }
            finalArray.push({topic: {id:topic.id,topic: topic.topic,content:topic.content,topic_likes: topic_likes,comments: comment}})
        };
        console.log(finalArray)
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