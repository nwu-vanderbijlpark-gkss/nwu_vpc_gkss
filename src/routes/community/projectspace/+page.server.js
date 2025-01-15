
export const actions = {
    addProject: async({locals: {supabase},request}) => {
        const data = await request.formData();
        const {data: {user}} = await supabase.auth.getUser();
        const user_id = user.id;
        const project = {
            name: data.get("name"),
            link: data.get("link"),
            image: data.get("image"),
            description: data.get("description"),
            technologies: data.get("technologies"),
        }
        let image_path = null;

        if(project.image){
            //upload the image
            const fileName = `images/${Date.now()}${project.image.name.substring(project.image.name.lastIndexOf("."))}`;
            const {data,error} = await supabase.storage.from("files").upload(fileName,project.image);
            if(error){
                console.error(error)
            }
            else{
                image_path = data.fullPath;
            }
        }
        if(image_path != null){
            //send data to db
            const {error} = await supabase.from("Project").insert({
                name: project.name,
                link: project.link,
                description: project.description,
                technologies: project.technologies,
                image: image_path,
                user_id: user_id
            })
            if(error){
                console.error(error)
                return {error: "Unexpected error occured"};
            }
        }
        else{
            return {error: "Please upload image"};
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