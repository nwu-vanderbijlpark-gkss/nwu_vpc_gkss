import { json } from '@sveltejs/kit';

export const POST = async ({locals: {supabase},request}) => {
    const {event_id} = await request.json();
    const {data: {user}} = await supabase.auth.getUser();
    const {data,error} = await supabase.from("event_attendee").insert({
        event_id: event_id,
        user_id: user.id,
        status: "registered"
    });
    if(!error){
        const {data: Member} = await supabase.from("Member").select("points").eq("id",user.id);
        let newPts = Number(Member[0].points) + 35;
        await supabase.from("Member").update({points: newPts}).eq("id",user.id);
        return json({success: true})
    }else{
        console.log(error);
        return json({success: false,error});
    }
}