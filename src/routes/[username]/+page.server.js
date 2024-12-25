export async function load({params, locals: {supabase}}) {

    let username = params.username;
    if(params.username == "profile")//this is the current session user's profile
    {
        const {data: {user}} = await supabase.auth.getUser();//gets the currently logged in user, we need the id
        const {data, error} = await supabase.from("Member").select().eq("id",user.id);//we use the id to get the username of the user
        username = data[0].username;//set the username to the username of the logged in user
    }

    const {data,error} = await supabase.from("Member").select().eq("username",username);//query a member with the given username
    if(error){
        console.error(error);
    }
    else{
        //the query returns an array, with length of 1.
        if(data.length > 0){
            //fetch all topics by this member
            //did this offline, check it when online...
            const {data: Forum_topic} = await supabase.from("Forum_topic").select("*").eq("author_id",data[0].id).order('created_at', { ascending: false });
            //return the object with the user's topics and details
            return {username: data[0].username,topics: Forum_topic};
        }
        else{
            //the query was negative, as the username does not exist in the database, we return null to the client
            return null;
        }
    }
    
}