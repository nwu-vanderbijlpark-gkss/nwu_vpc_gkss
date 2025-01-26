
export const load = async({locals: {supabase}}) =>{
    let returnData = {}; 
    const {data: Events, error} = await supabase.from("Events")
                        .select('*')                      
    returnData = {...returnData, events: Events};//insert the events data
    const {data: Member} = await supabase.from("Member").select('*');
    returnData = {...returnData, members: Member};
    //get more data like event registrations, event attendance, get the turnout percentage
    return returnData;

}