export async function load({locals: {supabase}}) {
    const {data: {user}} = await supabase.auth.getUser();
    let finalArray = [];

    /**TOPICS */
    //fetch all topics
    const {data: topics, error} = await supabase.from("topic").select("id,content,created_at,tags,topic, member(username,image,name, surname),comment(*,member(username, image, name, surname)),topic_views(id),topic_images(image)").order('created_at', { ascending: false });
    if(error){
        console.error(error)
    }
    let allTopics = [];
    //format the topics for viewing, by getting the public url for the images on each topic 
    for(let topic of topics){
        //for member profile images
        let publicUrl = await supabase.storage.from("files").getPublicUrl(topic.member.image.substring(topic.member.image.indexOf("/")+1));//removing the first "file/"
        topic = {...topic,member: {image: publicUrl.data.publicUrl, username: topic.member.username, fullName: topic.member.name + " " +topic.member.surname}}
        //for topic images
        const finalImages = [];
        for(const file of topic.topic_images){
            let publicUrl = await supabase.storage.from("files").getPublicUrl(file.image);
            finalImages.push(publicUrl.data.publicUrl);
        }
        topic = {...topic, topic_images: finalImages};
        //for comments
        const comments = [];
        for(let comment of topic.comment){
            let publicUrl = await supabase.storage.from("files").getPublicUrl(comment.member.image.substring(topic.member.image.indexOf("/")));//removing the first "file/"
            comment = {...comment,member: {image: publicUrl.data.publicUrl, username: comment.member.username, fullName: comment.member.name + " " +comment.member.surname}};
            comments.push(comment)
        }
        topic = {...topic, comment: comments};
        allTopics.push(topic);
    }
    /**memberS */
    const {data: memberData} = await supabase.from("member").select("name, surname, qualification, username, image, year_of_study, interests, gender, date_of_birth, points, topic(id)");
    let members = [];
    for(const member of memberData){
        let publicUrl = await supabase.storage.from("files").getPublicUrl(member.image.substring(member.image.indexOf("/")+1));//removing the first "file/"
        members.push({...member,image: publicUrl.data.publicUrl});
    }
    let currentUser = null;
    let email = null;
    if(user){
        email = user.email;
        const {data: sessionUser} = await supabase.from("member").select("name, surname, qualification, username, image, year_of_study, interests, gender, date_of_birth, points").eq("id",user.id);
        currentUser = sessionUser[0];
    }
    else{
        email =   null;
    }

    //Opportunities
    const {data: opportunities} = await supabase.from("opportunity").select("id,organization,deadline,title,type,content,created_at,member(username,name,surname)");
    //before returning the data, make objects for most viewed, latest
    const latest = allTopics.slice(0, 3);//as it is, just take the top 3
    
    //for most viewed
    let most_viewed = allTopics.sort((a, b) => b.topic_views.length - a.topic_views.length);
    
    

    return {email,latest,most_viewed, allTopics, members, currentUser, opportunities};

}

