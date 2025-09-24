import { gkssConfig } from '$lib/config.ts';
import { redirect } from '@sveltejs/kit';

export const actions =   {
    login: async ({locals: {supabase}, request}) => {
    const details = await request.formData();
    let redirectTo = '/dashboard';
    const email = details.get("email");
    const password = details.get("password");
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      
      if(error){
        return {error: error.code}
      }else{
        //get the member data, check if the interests are not null, if null, then redirect to onboarding
        const {data: member} = await supabase.from("member").select().eq("id",data.user.id).single();
        const {data: leader} = await supabase.from("team").select().eq("member_id",data.user.id).single();

        if(leader){
          redirectTo = '/executive'
        }

        if(member){
            if(member.interests){
              redirect(303,redirectTo)
            }
            else{
              redirect(303,"/onboarding");
            }
        }
      }
    },
    resetPassword: async ({locals: {supabase}, request}) => {
      const formData = await request.formData();
      const email = formData.get("email");
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: gkssConfig.url + '/update-password',
      })      
    }
      
    
}
