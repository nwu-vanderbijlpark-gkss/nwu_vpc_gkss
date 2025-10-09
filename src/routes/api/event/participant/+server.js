import { returnData } from '$lib/server/core.js';
import { json } from '@sveltejs/kit';

export const POST = async ({locals: {supabase},request, url}) => {
    
    const event_id = url.searchParams.get("event");//used to create a participant

    const group_id = url.searchParams.get("group");//used to add a participant to a group
    const participant_id = url.searchParams.get("id");//also used to add a participant to a group

    const {data: {user}} = await supabase.auth.getUser();
    
    //create new participant
    if(event_id){
        const {data,error} = await supabase.from("event_participant").insert({
            event_id: event_id,
            user_id: user.id,
        });
        if(!error){
            const {data: member} = await supabase.from("member").select("points").eq("id",user.id);
            let newPts = Number(member[0].points) + 35;
            await supabase.from("member").update({points: newPts}).eq("id",user.id);
            return json({success: true})
        }else{
            return json({success: false,error});
        }
    }

    //add participant into a group, meaning update...
    if(group_id && participant_id){
        const {data: participant,error} = await supabase.from("event_participant").update({
            group_id: group_id,
        }).eq("id",participant_id);

        return returnData(participant,error);
    }
}