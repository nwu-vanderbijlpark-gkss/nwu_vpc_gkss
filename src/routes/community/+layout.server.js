export async function load({locals: {supabase}}) {
    const {data: {user}} = await supabase.auth.getUser();
    let finalArray = [];
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
            finalArray.push({id:topic.id,topic: topic.topic,views: view_count,comments: comment})
        };
    }
    let email = null;
    if(user != null){
        email = user.email
    }
    else{
        email =   null;
    }
    //before returning the data, make objects for most viewed, latest and most comments
    const latest = finalArray.slice(0, 3);//as it is
    //for most viewed
    let most_viewed = finalArray.sort((a, b) => b.views.count - a.views.count);
    most_viewed = most_viewed.sort((a, b) => b.comments.count - a.comments.count).slice(0, 3);

    return {email,latest,most_viewed};

}

