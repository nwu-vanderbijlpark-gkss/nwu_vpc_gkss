export const load = async({locals:{supabase}}) => {

    //load the team
    const {data, error} = await supabase.from("Team").select("*");
    if(error){
        console.error(error);
        return {error: "Unexpected error occurred"};
    }
    for(let i = 0; i< data.length; i++){
        let publicUrl = await supabase.storage.from("files").getPublicUrl(data[i].image.substring(data[i].image.indexOf("/")+1));//removing the first "file/"
        data[i].image = publicUrl.data.publicUrl;
    }
    return {team: data};
}