
export const load = async({locals: {supabase}}) =>{
    const {data, error} = await supabase.from("events")
                        .select('*').order('created_at', { ascending: false });                       
    if(!data){
        console.error("error")
        console.error(error)
    }
    else{
        return {events: data};
    }

}