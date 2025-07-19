import { redirect } from '@sveltejs/kit';



export const actions = {
    addMember: async ({locals: {supabase},request}) => {
        //get formdata
        const formData = await request.formData();
        const member = {name: formData.get("name"),
            surname: formData.get("surname"),
            role:formData.get("role"),
            email:formData.get("email"), 
            image: formData.get("image"),       
        }
        let imageUrl = null;
        if(member.image){
            //upload image first
            const fileName = `images/${Date.now()}${member.image.name.substring(member.image.name.lastIndexOf("."))}`;
            const {data,error} = await supabase.storage.from("files").upload(fileName,member.image);
            if(error){
                console.error(error)
            }
            else{
                imageUrl = data.fullPath;
            }
        }
        if(member.image && imageUrl != null){
            //send data to db
            const {error} = await supabase.from("Team").insert({
                name: member.name,
                surname: member.surname,
                email: member.email,
                role: member.role,
                image: imageUrl,
            })
        }
        


    },
    deleteMember: async ({locals: {supabase},request}) => {
        //delete event based on id
        const data = await request.formData();
        const id = data.get("id");
        const {error} = await supabase.from("Team").delete().eq("id",id);
        redirect(303,"/executive/team");
    },
    updateMember: async ({locals: {supabase},request}) => {
        //update member based in id, use formdata for new data
    }
}