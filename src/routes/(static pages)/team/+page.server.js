export const load = async({locals:{supabase}}) => {

    let members = [];
    //load the team
    const {data, error} = await supabase.from("team").select("*, member(*)").order("role", {ascending: true});
    if(error){
        console.error(error);
        return {error: "Unexpected error occurred"};
    }
    
    for(let i = 0; i< data.length; i++){
        let publicUrl = data[i].member.image ? await supabase.storage.from("files").getPublicUrl(data[i].member.image.substring(data[i].member.image.indexOf("/")+1)) : null;//removing the first "file/"
        data[i].member.image = publicUrl ? publicUrl.data.publicUrl : "/temp/avatar.jpeg";
    }
    return {team: data};
}