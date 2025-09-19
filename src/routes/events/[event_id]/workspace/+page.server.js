import { table } from '$lib/server/core.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({params, locals: {supabase}}) => {
    const event_id = params.event_id;


    const {data: {user}} = await supabase.auth.getUser();


    //if the user is logged in check if they have a team
    if(user){
        //check if the user does not own a group yet
        const {data: group, error} = await table(supabase,"event_group").select("id,name,submission,member(name,surname,email),event_participant(*,member(name,surname,email))").eq("user_id",user.id).eq("event_id",event_id);
        if(group.length){
            return {group: group[0]}
        }
        //get the group this user is part of.
        const {data: participant, error: participantError} = await table(supabase,"event_participant").select("*, event_group(id,name,submission,member(name,surname,email),event_participant(*,member(name,surname,email)))").eq("user_id",user.id).eq("event_id",event_id);
        if(participant.length){
            return {group: participant[0].event_group}
        }
        else{
            //redirect to event registration page
            redirect(307,"/events/"+event_id)
        }

    }
    else{
        //redirect to event registration page
        redirect(307,"/events/"+event_id)
    }
}