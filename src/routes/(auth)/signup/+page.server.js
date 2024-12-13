import { redirect } from '@sveltejs/kit';

export const actions =   {
    default: async ({locals: {supabase}, request}) => {
    const details = await request.formData();
    const email = details.get("email");
    const password = details.get("password");

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      
      if(error){
        console.error(error)
      }else{
              redirect(303,"/community");
            }
    }
      
    
}