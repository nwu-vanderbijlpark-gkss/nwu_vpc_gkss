import { error, redirect } from '@sveltejs/kit';
export async function load({params, locals: {supabase}}) {

    let username = params.username;
    let email = null;
    let isMyProfile = false;//checking if the user is viewing their own profile
    const {data: {user}} = await supabase.auth.getUser();//gets the currently logged in user, we need the id
    if(params.username == "profile")//this is the current session user's profile
    {
        const {data, error} = await supabase.from("Member").select().eq("id",user.id);//we use the id to get the username of the user
        username = data[0].username;//set the username to the username of the logged in user
        isMyProfile = true;
    }
    

    const {data} = await supabase.from("Member").select("*").eq("username",username);//query a member with the given username

    if(data){
        //the query returns an array, with length of 1.
        if(data.length > 0){
            //if the user viewed their profile via username 
            if(data[0].id == user.id){
                isMyProfile = true;
            }
            //fetch all topics by this member
            //did this offline, check it when online...
            const {data: Forum_topic, error} = await supabase.from("Forum_topic").select("id,content,created_at,tags,topic, Member(username,image),Comment(*),topic_views(*)").eq("author_id",data[0].id).order('created_at', { ascending: false });
            let allTopics = [];
            let user_views = 0;
            for(const topic of Forum_topic){
                let publicUrl = await supabase.storage.from("files").getPublicUrl(topic.Member.image.substring(topic.Member.image.indexOf("/")+1));//removing the first "file/"
                user_views += topic.topic_views.length;
                allTopics.push({...topic,Member: {image: publicUrl.data.publicUrl, username: topic.Member.username}})
            }
            const {data: Project} = await supabase.from("Project").select("name,image,description,technologies,link,created_at,id,Member(username)").eq("user_id",data[0].id).order('created_at', { ascending: false });
            let projects = [];
            let user_rating = 0;
            for(const project of Project){
                let publicUrl = await supabase.storage.from("files").getPublicUrl(project.image.substring(project.image.indexOf("/")+1));//removing the first "file/"
                const {data: Project_rating} = await supabase.from("Project_rating").select("rating,Member(id)").eq("project_id",project.id);
                let rating = Project_rating;
                user_rating += Number(rating[0].rating);
                projects.push({...project,image: publicUrl.data.publicUrl,rating: rating})
            }
            user_rating = user_rating/projects.length;
            

            //return the object with the user's topics and details
            email = data[0].email;
            let publicUrl = await supabase.storage.from("files").getPublicUrl(data[0].image.substring(data[0].image.indexOf("/")+1));//removing the first "file/"
            let image = publicUrl.data.publicUrl;
            return {username,isMyProfile,email,image,topics: allTopics, projects, user_rating, user_views};
        }
        else{
            //the query was negative, as the username does not exist in the database, we throw error
            error(404, "User not found");
        }
    }
    
}

export const actions = {
    logout: async({locals: {supabase}}) => {
        const { error } = await supabase.auth.signOut();
        redirect(307,"/community");
    }
}
