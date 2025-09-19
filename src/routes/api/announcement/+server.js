import { json } from '@sveltejs/kit';

export const POST = async({request, locals: {supabase}}) => {
    //create an announcement
    const {data} = await request.json();//get the data
    const {data: {user}} = await supabase.auth.getUser();//we need the user id

    const {data: announcement, error} = await supabase.from("announcements").insert({
        subject: data.subject,
        body: data.body,
        author_id: user.id
    }).select().single();

    if(error){
        return json({success: false, data: error});
    }
    delete announcement.author_id;
    return json({success: true, status: 200, data: announcement})

}
export const GET = async({url, locals: {supabase}}) => {
    //get announcements or an announcement
    const id = url.searchParams.get("id") || null;
    const table = supabase.from("announcements");

    //return only 1 announcement
    if(id){
        const {data: announcement, error} = await table.select("id,subject,body,created_at, member(name, surname)").eq("id",id).single();
        if(error){
            return json({success: false, data: error});
        }
        return json({success: true, status: 200, data: announcement});
    }
    //return all announcements, might need pagination later on
    const {data: announcements, error} = await table.select("id,subject,created_at, member(name, surname)").order("created_at",{ascending: false});
    if(error){
        return json({success: false, data: error});
    }

    return json({success: true, status: 200, data: announcements});
}