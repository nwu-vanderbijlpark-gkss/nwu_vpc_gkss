export async function load({locals: {supabase}}) {
    const {data: {user}} = await supabase.auth.getUser();
    let finalArray = [];
    const {data: Forum_topic, error} = await supabase.from("Forum_topic").select("id,content,created_at,tags,topic, Member(username),Comment(*),topic_views(*)").order('created_at', { ascending: false });
    if(error){
        console.error(error)
    }
    let email = null;
    if(user != null){
        email = user.email
    }
    else{
        email =   null;
    }
    const allTopics = Forum_topic;
    //before returning the data, make objects for most viewed, latest
    const latest = Forum_topic.slice(0, 3);//as it is, just take the top 3
    
    //for most viewed
    let most_viewed = Forum_topic.sort((a, b) => b.topic_views.length - a.topic_views.length);
    most_viewed = most_viewed.sort((a, b) => b.Comment.length - a.Comment.length).slice(0, 3);

    return {email,latest,most_viewed, allTopics};

}

