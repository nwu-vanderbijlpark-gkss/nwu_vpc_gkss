export const POST = async ({locals: {supabase}, request}) => {
    const {data: {user}} = await supabase.auth.getUser();

    if(!user) 
        return new Response(JSON.stringify({error: "You must be logged in to apply"}), {status: 401});

    const data = await request.formData();

    const role = data.get("role");
    const message = data.get("message");

    const {error} = await supabase.from("applications").insert({role: role, message: message, status: "submitted", member_id: user.id});
    if(error) 
        return new Response(JSON.stringify({error: error.message}), {status: 500});
    
    return new Response(JSON.stringify({success: "Application submitted successfully"}), {status: 200});
}