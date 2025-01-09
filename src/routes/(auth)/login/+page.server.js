import { redirect } from '@sveltejs/kit';

export const actions =   {
    default: async ({locals: {supabase}, request}) => {
    const details = await request.formData();
    let redirectTo = '/community';
    const email = details.get("email");
    const password = details.get("password");

    let { data: Team } = await supabase
                                .from('Team')
                                .select('student_no')

    if(Team){
        Team.forEach(member => {
            //check if the person loggin in is not in the executive committee
            if(email === (member.student_no+"@mynwu.ac.za")){
                redirectTo = '/executive'
            }
        });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      
      if(error){
        console.error(error)
      }else{
        redirect(303,redirectTo);
      }
    }
      
    
}
export const ssr = false;