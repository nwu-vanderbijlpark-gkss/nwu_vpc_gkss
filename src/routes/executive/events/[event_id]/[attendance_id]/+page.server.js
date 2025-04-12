export const load = async ({params,locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    //confirm that the user visiting this path is an admin before confirming attendance.
    let isAdmin = false;

    if(user){
        let { data: Team } = await supabase
            .from('Team')
            .select('*')   
        if(Team){
            Team.forEach(async(member) => {
                //check if the user accessing the executive pages is an executive member
                if(user.email === (member.email)){ 
                    isAdmin = true;
                }
            });
        }else{
            return {success: false,message: "You have no rights to visit this page. Ask the leaders to assist."}
        }

        let event_id = params.event_id;
        let attendance_id = params.attendance_id;

        const {data: attendance,error} = await supabase.from("event_attendee").select("*,Events(topic),Member(name,surname,gender,points)").eq("id",attendance_id);
        if(attendance){
            if(attendance[0].status != "attended"){
                const {data: attending,error} = await supabase.from("event_attendee").update({status: "attended"}).eq("id",attendance_id).select("*,Member(id,name,surname,gender,points)");
                if(!error){
                    //give the member 100 points
                    let newPts = Number(attending[0].Member.points) + 100;
                    await supabase.from("Member").update({points: newPts}).eq("id",attending[0].Member.id);
                    return {success: true,info: attending[0]}
                }
            }
            else{
                return {success: false,message: "You have already confirmed your attendance",info: attendance[0]};

            }
        }
        else{
            return {success: false,message: "You have not registered for this event."};
        }

    }
    else{
        return {success: false,message: "You are not authenticated"};
    }
}