import { redirect } from '@sveltejs/kit';

export const actions =   {
    addTopic: async ({locals: {supabase}, request}) => {
        const {data: {user}} = await supabase.auth.getUser();
        const {data:Member,error} = await supabase.from("Member").select().eq("id",user.id);
        if(error){
            console.error(error)
        }else{
            //making a post
            const formData = await request.formData();
            const images = formData.getAll("files[]");
            const {data,error} = await supabase.from("Forum_topic").insert({
                topic: formData.get("topic"),
                content: formData.get("content"),
                tags: formData.get("tags"),
                author_id: user.id,
                author_username: Member.username,
            }).select();
    
            if(error){
                console.error(error)
            }else{
                const topic_id = data[0].id;
                for(const image of images){
                    let d;
                    if(image instanceof File){
                        
                        console.log("processing file "+image.name)
                        const file_url = `images/topic_images/${Date.now()}_${image.name}`;
                        const {data,error} = await supabase.storage
                                                    .from("files")
                                                    .upload(file_url,image);
                        if(error){
                            console.error(error)
                        }
                        else{
                            //insert image record into the topic_images table
                            const {error} = await supabase.from("topic_images").insert({
                                topic_id: topic_id,
                                image: file_url,
                            })
                        }
                    }
                }
                redirect(303,`/community/topic/${topic_id}`);
            }
        }
        
        
    },
    deleteTopic : async ({request, locals: {supabase}}) => {
        const data = await request.formData();
        const id = data.get("id");
        const {error} = await supabase.from("Forum_topic").delete().eq("id",id);
        if(error){
            console.error(error);
        }
    }
}