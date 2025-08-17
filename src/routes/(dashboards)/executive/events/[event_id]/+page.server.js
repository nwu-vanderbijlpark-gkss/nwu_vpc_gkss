import { error } from "@sveltejs/kit";


export const load = async({params, locals:{supabase}}) => {
    const id = params.event_id;
    const {data} = await supabase.from("Events").select("*").eq("id",id);
    const {data: participants} = await supabase.from("event_participant").select("id,Member(name,surname,gender,qualification,year_of_study)").eq("event_id",id);
    const {data: groups} = await supabase.from("event_group").select("id,name,Member(name,surname,email),event_participant(id), event_results(points)").eq("event_id",id);
    console.log(groups[0].event_results);
    if(data.length > 0){
        return {event: data[0], participants, groups}
    }else{
        error(404,"Event Not found");
    }
}