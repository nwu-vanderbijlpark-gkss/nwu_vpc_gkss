import { redirect } from '@sveltejs/kit';

export const actions =   {
    login: async ({locals: {supabase}, request}) => {
    const details = await request.formData();
    let redirectTo = '/dashboard';
    const email = details.get("email");
    const password = details.get("password");

    let { data: team } = await supabase
                                .from('team')
                                .select('email')

    if(team){
        team.forEach(member => {
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
        return {error: error.code}
      }else{
        //get the member data, check if the interests are not null, if null, then redirect to onboarding
        const {data: member} = await supabase.from("member").select().eq("id",data.user.id);
        if(member.length > 0){
            if(member[0].interests){
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
        redirectTo: 'https://nwu-vaal-gkss.netlify.app/update-password',
      })      
    }
      
    
}
