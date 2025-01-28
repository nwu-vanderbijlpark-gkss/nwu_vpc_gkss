import { redirect } from '@sveltejs/kit';

export const load = async({request, locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect(303,"/login");
    }
}

export const actions = {
    default: async({request, locals: {supabase}}) => {
        const formData = await request.formData();
        const newPassword = formData.get("newPassword");
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
          })
        if(!error){
            redirect(303,"/dashboard");
        }          

    }
}