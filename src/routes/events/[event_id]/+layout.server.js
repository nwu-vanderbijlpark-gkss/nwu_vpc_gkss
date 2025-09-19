import { error } from "@sveltejs/kit";


export const load = async({params, locals:{supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    const id = params.event_id;

    let alreadyRegistered = false;
    if(user){
        const {data: attendee, error} = await supabase.from("event_participant").select().eq("user_id",user.id).eq("event_id",id);
        alreadyRegistered = attendee.length && true;
    }

    const {data} = await supabase.from("events").select("*,event_criteria(*),event_group(id,name,submission,member(name,surname,email),event_participant(*,member(name,surname,email)))").eq("id",id);
    if(data.length > 0){
        
        return {event: data[0],alreadyRegistered}
    }else{
        error(404,"Event Not found");
    }
}
     