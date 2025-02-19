import { error } from "@sveltejs/kit";

export const load = async({params, locals:{supabase}}) => {
    const id = params.event_id;
    const {data} = await supabase.from("Events").select("*,event_attendee(id,status)").eq("id",id);

    if(data.length > 0){
        return {event: data[0]}
    }else{
        error(404,"Event Not found");
    }
}