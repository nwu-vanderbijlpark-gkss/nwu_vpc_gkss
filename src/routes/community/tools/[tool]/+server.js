import { json } from '@sveltejs/kit';


export const POST = async({locals: {supabase},request}) => {
    const {form} = await request.json();
    const {data: {user}} = await supabase.auth.getUser();
    const user_id = user.id;

    //send data to db
    const {error} = await supabase.from("Project").insert({
        name: form.name,
        link: form.link,
        description: form.description,
        type: form.type,
        user_id: user_id
    })
    if(error){
        console.error(error)
        return {error: "Unexpected error occured"};
    }
    else{
        const {data: Project} = await supabase.from("Project").select("name,description,link,created_at,id,type,Member(username,name,surname),project_views(id)").order('created_at', { ascending: false });
        const {data: Member} = await supabase.from("Member").select("points").eq("id",user.id);
        let newPts = Number(Member[0].points) + 50;
        await supabase.from("Member").update({points: newPts}).eq("id",user.id);
        return json({projects: Project})
    }

    
}