export async function load({locals: {supabase}}) {
    const {data: {user}} = await supabase.auth.getUser();
    let finalArray = [];

    /**TOPICS */
    //fetch all topics
    const {data: Topic, error} = await supabase.from("Topic").select("id,content,created_at,tags,topic, Member(username,image,name, surname),Comment(*,Member(username, image, name, surname)),topic_views(id),topic_images(image)").order('created_at', { ascending: false });
    if(error){
        console.error(error)
    }
    let allTopics = [];
    //format the topics for viewing, by getting the public url for the images on each topic 
    for(let topic of Topic){
        //for member profile images
        let publicUrl = await supabase.storage.from("files").getPublicUrl(topic.Member.image.substring(topic.Member.image.indexOf("/")+1));//removing the first "file/"
        topic = {...topic,Member: {image: publicUrl.data.publicUrl, username: topic.Member.username, fullName: topic.Member.name + " " +topic.Member.surname}}
        //for topic images
        const finalImages = [];
        for(const file of topic.topic_images){
            let publicUrl = await supabase.storage.from("files").getPublicUrl(file.image);
            finalImages.push(publicUrl.data.publicUrl);
        }
        topic = {...topic, topic_images: finalImages};
        //for comments
        const comments = [];
        for(let comment of topic.Comment){
            let publicUrl = await supabase.storage.from("files").getPublicUrl(comment.Member.image.substring(topic.Member.image.indexOf("/")));//removing the first "file/"
            comment = {...comment,Member: {image: publicUrl.data.publicUrl, username: comment.Member.username, fullName: comment.Member.name + " " +comment.Member.surname}};
            comments.push(comment)
        }
        topic = {...topic, Comment: comments};
        allTopics.push(topic);
    }
    /**PROJECTS */
    const {data: Project} = await supabase.from("Project").select("name,description,link,created_at,id,type,Member(username,name,surname),project_views(id)").order('created_at', { ascending: false });
    let projects = [];
    for(const project of Project){
        const {data: Project_rating} = await supabase.from("Project_rating").select("rating,Member(id)").eq("project_id",project.id);
        let rating = Project_rating;
        projects.push({...project,rating: rating})
    }
    /**MEMBERS */
    const {data: Member} = await supabase.from("Member").select("name, surname, bio, qualification, username, image, year_of_study, interests, gender, date_of_birth, points, Topic(id),Project(id)");
    let members = [];
    for(const member of Member){
        let publicUrl = await supabase.storage.from("files").getPublicUrl(member.image.substring(member.image.indexOf("/")+1));//removing the first "file/"
        members.push({...member,image: publicUrl.data.publicUrl});
    }
    let currentUser = null;
    let email = null;
    if(user){
        email = user.email;
        const {data: sessionUser} = await supabase.from("Member").select("name, surname, bio, qualification, username, image, year_of_study, interests, gender, date_of_birth, points").eq("id",user.id);
        currentUser = sessionUser[0];
    }
    else{
        email =   null;
    }
    //before returning the data, make objects for most viewed, latest
    const latest = allTopics.slice(0, 3);//as it is, just take the top 3
    
    //for most viewed
    let most_viewed = allTopics.sort((a, b) => b.topic_views.length - a.topic_views.length);
     

    return {email,latest,most_viewed, allTopics, projects, members, currentUser};

}

