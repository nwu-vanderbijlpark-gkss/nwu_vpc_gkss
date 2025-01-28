import { redirect } from '@sveltejs/kit';

export const load = async ({locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect(303,"/login");
    }
}

export const actions = {
    logout: async ({locals: {supabase}}) => {
        const { error } = await supabase.auth.signOut();
        redirect(303,"/login");
    },
    inviteUser: async ({locals: {supabase},request}) => {
        console.log("here")
    }
}