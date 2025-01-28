import { redirect } from '@sveltejs/kit';

export const actions =   {
    default: async ({locals: {supabase}, request}) => {
    const details = await request.formData();
    let redirectTo = '/dashboard';
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
        //get the member data, check if the interests are not null, if null, then redirect to onboarding
        console.log(data)
        const {data: Member} = await supabase.from("Member").select().eq("id",data.user.id);
        if(Member.length > 0){
            console.log(Member[0].interests);
            if(Member[0].interests){
              redirect(redirectTo)
            }
            else{
              redirect(303,"/onboarding");
            }
        }
      }
    }
      
    
}
