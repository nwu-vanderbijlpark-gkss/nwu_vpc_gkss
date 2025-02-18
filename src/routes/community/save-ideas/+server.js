import { json } from '@sveltejs/kit';

export const POST = async ({ request, getClientAddress, locals:{supabase} }) => {
    const {data: {user}} = await supabase.auth.getUser();
    const {project} = await request.json();
    if(user){
        const {data: Ideas,error} = await supabase.from("Ideas").insert({
            user_id: user.id,
            title: project.title,
            description: project.full_description,
            technologies: project.technologies.join(", "),//since it was an array
            domain: project.domain,
        })
        if(!error){
            return json({
                success: true,
                response: Ideas,
             });
        }
        else{
            return json({
                success: false,
                error: error,
            });
        }
    }
}