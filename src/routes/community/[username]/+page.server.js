import { error, redirect } from '@sveltejs/kit';
export async function load({params, locals: {supabase}}) {

    let username = params.username;
    let email = null;
    let isMyProfile = false;//checking if the user is viewing their own profile
    const {data: {user}} = await supabase.auth.getUser();//gets the currently logged in user, we need the id
    if(params.username == "profile" && user != null)//this is the current session user's profile
    {
        const {data, error} = await supabase.from("member").select().eq("id",user.id);//we use the id to get the username of the user
        username = data[0].username;//set the username to the username of the logged in user
    }
    

    const {data} = await supabase.from("member").select("*").eq("username",username);//query a member with the given username

    if(data){
        //the query returns an array, with length of 1.
        if(data.length > 0){
            //fetch all topics by this member
            //did this offline, check it when online...
            const {data: topics, error} = await supabase.from("topic").select("id,content,created_at,tags,topic, member(username,image,name,surname),comment(*),topic_views(*),topic_images(image)").eq("author_id",data[0].id).order('created_at', { ascending: false });
            let allTopics = [];
            let user_views = 0;
            for(let topic of topics){
                let publicUrl = await supabase.storage.from("files").getPublicUrl(topic.member.image.substring(topic.member.image.indexOf("/")+1));//removing the first "file/"
                user_views += topic.topic_views.length;
                topic = {...topic,member: {image: publicUrl.data.publicUrl, username: topic.member.username, fullName: topic.member.name + " " + topic.member.surname}};
                const finalImages = [];
                for(const file of topic.topic_images){
                    let publicUrl = await supabase.storage.from("files").getPublicUrl(file.image);
                    finalImages.push(publicUrl.data.publicUrl);
                }
                topic = {...topic, topic_images: finalImages};
                allTopics.push(topic);
            }
            
                    

            //return the object with the user's topics and details
            let publicUrl = await supabase.storage.from("files").getPublicUrl(data[0].image.substring(data[0].image.indexOf("/")+1));//removing the first "file/"
            let image = publicUrl.data.publicUrl;
            let member = {fullName: data[0].name + " " + data[0].surname,username,image,topics: allTopics, user_views, points: data[0].points};
            member = {...member, linkedin: data[0].linkedin, github: data[0].github, portfolio: data[0].portfolio,email: data[0].email};
            return {member};
        }
        else{
            //the query was negative, as the username does not exist in the database, we throw error
            return {notFound: true}
        }
    }
    
}

