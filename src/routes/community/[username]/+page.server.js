import { error } from '@sveltejs/kit';
export async function load({params, locals: {supabase}}) {

    let username = params.username;
    let email = null;
    
    if(params.username == "profile")//this is the current session user's profile
    {
        const {data: {user}} = await supabase.auth.getUser();//gets the currently logged in user, we need the id
        const {data, error} = await supabase.from("Member").select().eq("id",user.id);//we use the id to get the username of the user
        username = data[0].username;//set the username to the username of the logged in user
    }

    const {data} = await supabase.from("Member").select().eq("username",username);//query a member with the given username

    if(data){
        //the query returns an array, with length of 1.
        if(data.length > 0){
            //fetch all topics by this member
            //did this offline, check it when online...
            const {data: Forum_topic} = await supabase.from("Forum_topic").select("*").eq("author_id",data[0].id).order('created_at', { ascending: false });
            const {data: Project} = await supabase.from("Project").select("*").eq("user_id",data[0].id).order('created_at', { ascending: false });

            //return the object with the user's topics and details
            email = data[0].email;
            let publicUrl = await supabase.storage.from("files").getPublicUrl(data[0].image.substring(data[0].image.indexOf("/")+1));//removing the first "file/"
            let image = publicUrl.data.publicUrl;
            return {username,email,image,topics: Forum_topic, projects: Project};
        }
        else{
            //the query was negative, as the username does not exist in the database, we throw error
            error(404, "User not found");
        }
    }
    
}