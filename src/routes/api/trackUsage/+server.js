import { json } from "@sveltejs/kit";

export const POST = async({request, locals:{supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    const {location} = await request.json();
    if(user){
        const {data,error} = await supabase.from("app_usage").insert({location: location,user_id: user.id});
        
        if(!error) return json({success: true});
        else return json({success: false, error});
    }
    return json({success: false, error: "User not logged in."});
}