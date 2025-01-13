import { redirect } from '@sveltejs/kit';

export const actions =   {
    default: async ({locals: {supabase}, request}) => {
    const details = await request.formData();
    let redirectTo = '/community';
    const email = details.get("email");
    const password = details.get("password");

    let { data: Team } = await supabase
                                .from('Team')
                                .select('email')

    if(Team){
        Team.forEach(member => {
            //check if the person logging in is not in the executive committee
            if(email === (member.email)){
                redirectTo = '/executive'
            }
        });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      
      if(error){
        console.error(error.code)
        return {error: error.code}
      }else{
        redirect(303,redirectTo);
      }
    }
      
    
}
