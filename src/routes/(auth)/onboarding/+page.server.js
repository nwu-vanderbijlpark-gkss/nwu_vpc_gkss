import { redirect } from '@sveltejs/kit';

export const load = async({request, locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect(303,"/login");
    }
    //user session exists
    //get the member data, check if the interests are null, if not null, then redirect to /dashboard
    const {data: Member} = await supabase.from("Member").select().eq("id",user.id);
    if(Member.length > 0){
        if(Member[0].interests){
          redirect(303,"/dashboard")
        }
    }
}


export const actions = {
    default: async({request, locals: {supabase}}) => {
        const formData = await request.formData();
        let form = formData.get("form");
        form = JSON.parse(form);
        //return the array as string
        let interests = () => {
            let text = "";
            form.interests.map(interest => {
                text += interest;
                if(form.interests.indexOf(interest) != form.interests.length-1){
                    text += ",";
                } 
            })
            return text;
        }
        //get the user id, then update the member

        const {data: {user}} = await supabase.auth.getUser();

        if(user){
            const {data,error} = await supabase.from("Member").update({
                name: form.name, surname: form.surname, date_of_birth: form.date_of_birth, gender: form.gender,
        qualification: form.qualification, year_of_study: form.year_of_study,
        interests: interests(),
            }).eq("id",user.id);

            if(error){
                console.error(error);
                return {type: "error",message: error};
            }
            else{
                redirect(303,"/dashboard");
            }
            redirect(303,"/dashboard");
        }
    }
}