import { json } from "@sveltejs/kit";

export const POST = async ({locals: {supabase},request}) => {
    //edit event based on id
    const {editData} = await request.json();
    if(editData){
        const {data: event,error} = await supabase.from("Events").update({
            topic: editData.topic,
            description: editData.description,
            venue: editData.venue,
            date: editData.date,
            public: editData.public,

        }).eq("id",editData.id);
        if(error){
            return json({success: false,message: error});
        }
        else{
            return json({success: true})
        } 
    }
    else{
        return json({success: false})
    }
}