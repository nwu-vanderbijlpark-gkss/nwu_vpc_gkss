import { redirect } from '@sveltejs/kit';

export const actions =   {
    addTopic: async ({locals: {supabase}, request}) => {
        const {data: {user}} = await supabase.auth.getUser();
        const {data:Member,error} = await supabase.from("Member").select().eq("id",user.id);
        if(error || !Member[0].interests){
            if(!Member[0].interests){
                redirect(303, "/onboarding");
            }
            console.error(error)
        }else{
            //making a post
            const formData = await request.formData();
            const images = formData.getAll("files[]");
            const {data,error} = await supabase.from("Topic").insert({
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
                //award the member with 20 points
                const {data: Member} = await supabase.from("Member").select("points").eq("id",user.id);
                let newPts = Number(Member[0].points) + 20;
                await supabase.from("Member").update({points: newPts}).eq("id",user.id);
                redirect(303,`/community/topic/${topic_id}`);
            }
        }
        
        
    },
    deleteTopic : async ({request, locals: {supabase}}) => {
        const data = await request.formData();
        const id = data.get("id");
        //get the images and delete them also
        const {data: topic_images} = await supabase.from("topic_images").select().eq("topic_id",id);
        const images = [];
        if(topic_images.length > 0){
            for(const image of topic_images){
                images.push(image.image);
            }
            //delete the images
            const {error} = await supabase.storage.from("files").remove(images);
            if(error){
                console.error(error);
            }
        }

        const {error} = await supabase.from("Topic").delete().eq("id",id);
        if(error){
            console.error(error);
        }
    },
    addProject: async({locals: {supabase},request}) => {
        const data = await request.formData();
        const {data: {user}} = await supabase.auth.getUser();
        const user_id = user.id;
        const project = {
            name: data.get("name"),
            link: data.get("link"),
            description: data.get("description"),
        }
            //send data to db
            const {error} = await supabase.from("Project").insert({
                name: project.name,
                link: project.link,
                description: project.description,
                user_id: user_id
            })
            if(error){
                console.error(error)
                return {error: "Unexpected error occured"};
            }

        
    },
    rateProject: async({locals: {supabase},request}) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                return {
                    status: 401,
                    error: "You must be logged in to rate projects"
                };
            }
    
            const formData = await request.formData();
            const projectId = formData.get("id");
            const rating = Number(formData.get("rating"));
    
            // Validate inputs
            if (!projectId || !rating || rating < 1 || rating > 5) {
                return {
                    status: 400,
                    error: "Invalid rating data"
                };
            }
    
            // Check if user has already rated this project
            const { data: existingRating } = await supabase
                .from("Project_rating")
                .select()
                .eq('project_id', projectId)
                .eq('user_id', user.id)
                .single();
    
            let result;
            
            if (existingRating) {
                // Update existing rating
                result = await supabase
                    .from("Project_rating")
                    .update({ rating })
                    .eq('project_id', projectId)
                    .eq('user_id', user.id);
            } else {
                // Insert new rating
                result = await supabase
                    .from("Project_rating")
                    .insert({
                        project_id: projectId,
                        user_id: user.id,
                        rating
                    });
            }
            //award the member with 50 points
            const {data: Member} = await supabase.from("Member").select("points").eq("id",user.id);
            let newPts = Number(Member[0].points) + 50;
            await supabase.from("Member").update({points: newPts}).eq("id",user.id);
            if (result.error) {
                return {
                    status: 500,
                    error: "Failed to save rating"
                };
            }
    
            // Calculate new average rating
            const { data: averageRating } = await supabase
                .rpc('calculate_project_average_rating', {
                    project_id: projectId
                });
    
            return {
                status: 200,
                data: {
                    rating: averageRating,
                    message: existingRating ? "Rating updated" : "Rating submitted"
                }
            };
    
        } catch (error) {
            console.error('Rating error:', error);
            return {
                status: 500,
                error: "An unexpected error occurred"
            };
        }
    },
    comment: async({locals: {supabase},request}) => {

    },
}