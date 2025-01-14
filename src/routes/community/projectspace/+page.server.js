
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

    },
    comment: async({locals: {supabase},request}) => {

    },
}