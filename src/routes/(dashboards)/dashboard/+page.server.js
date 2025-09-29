import { redirect } from '@sveltejs/kit';

export const load = async ({locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect(303,"/login");
    }
    const {data: memberData} = await supabase.from("member").select("*,event_participant(id,events(*))").eq("id",user.id);
    if(memberData && memberData.length > 0){
        if(memberData[0].interests){
            let member = memberData[0];
            let publicUrl = member.image? await supabase.storage.from("files").getPublicUrl(member.image?.substring(member.image.indexOf("/")+1)) : null;//removing the first "file/"
            member.image = publicUrl?.data?.publicUrl ? publicUrl.data.publicUrl : "/temp/avatar.jpeg";
            member.id = 0;//hide the member's id
            //events
            const {data: events} = await supabase.from("events").select('*').order('date', { ascending: false });

            return {member,events: events};    
        }
        else{
            redirect(303,"/onboarding");
        }
    }
    else{
        redirect(303,"/login");
    }
}

export const actions = {
    logout: async ({locals: {supabase}}) => {
        const { error } = await supabase.auth.signOut();
        redirect(303,"/login");
    },
    editProfile: async ({locals: {supabase},request}) => {
        const form = await request.formData();
        const {data: {user}} = await supabase.auth.getUser();

        if(user){
            const {data,error} = await supabase.from("member").update({
                name: form.get("name"), 
                surname: form.get("surname"), 
                date_of_birth: form.get("date_of_birth"),
                gender: form.get("gender"),
                qualification: form.get("qualification"),  
                year_of_study: form.get("year_of_study"),
            }).eq("id",user.id);

            if(error){
                console.error(error);
            }
        }

    },
    uploadImage: async ({locals: {supabase},request}) => {
        //get the user's image from db, delete that image, then upload new one, to save storage.
        const {data: {user}} = await supabase.auth.getUser();
        const {data: member} = await supabase.from("member").select("image").eq("id",user.id);
        let image = null;
        const formData = await request.formData();
        const newImage = formData.get("image");
        //replace the image if its not the default
        if(member[0].image != "files/images/avatar.png"){
            const image_path = member[0].image.replace("files/","");//remove the files/
            const { data, error } = await supabase
            .storage
            .from('files')
            .update(image_path, newImage);
            if(error){
                console.error(error);
            }else{
                image = data.fullPath;
            }
        }
        else{
            //upload new image
            const fileName = `images/user/${Date.now()}${newImage.name.substring(newImage.name.lastIndexOf("."))}`;
            const {data,error} = await supabase.storage.from("files").upload(fileName,newImage);
            image = data.fullPath;
        }
        //update the member
        if(image){
            const {error} = await supabase.from("member").update({image: image}).eq("id",user.id);
            if(error){
                console.error(error)
            }
        }
        else{
            console.error("No image");
        }
        
    }
}