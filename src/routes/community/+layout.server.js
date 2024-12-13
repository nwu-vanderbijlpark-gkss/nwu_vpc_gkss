export async function load({locals: {supabase}}) {
    const {data: {user}} = await supabase.auth.getUser();
    if(user != null){
        return {email: user.email};
    }
    else{
        return {email: null};
    }
}

