export async function load({locals: {supabase}}) {
    const {data: {user}} = await supabase.auth.getUser();
    const {data: Forum_topic, error} = await supabase.from("Forum_topic").select("*").order('created_at', { ascending: false });

    //to do
    //get the most viewed topics
    //
    if(user != null){
        return {email: user.email};
    }
    else{
        return {email: null};
    }
}

