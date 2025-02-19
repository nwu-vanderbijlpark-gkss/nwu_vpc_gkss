import { error } from "@sveltejs/kit";

export const load = async({params, locals:{supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    const id = params.event_id;

    let email = null;
    let alreadyRegistered = false;
    if(user){
        email = user.email;
        const {data: attendee} = await supabase.from("event_attendee").select().eq("user_id",user.id).eq("event_id",id);
        alreadyRegistered = attendee.length>0 && true;
    }
    const {data} = await supabase.from("Events").select("*,event_attendee(id)").eq("id",id);

    if(data.length > 0){
        
        return {event: data[0],email,alreadyRegistered}
    }else{
        error(404,"Event Not found");
    }
}