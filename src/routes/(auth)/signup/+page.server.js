import { redirect } from '@sveltejs/kit';

export const actions =   {
    default: async ({locals: {supabase}, request}) => {
    const details = await request.formData();//get the form data from the submitted form
    const email = details.get("email");
    const password = details.get("password");
    const username = email.split('@')[0];

    const {data: Member,error} = await supabase.from("Member").select().eq("username",username);
    if(Member.length > 0){
      //if the username already exists
      return {error: "User already exists"};
    }else{
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: 'https://nwu-vaal-gkss.netlify/login',
        }
      })
      
      if(error){
          return {error: "Failed to create account"};
      }else{
          const {error} = await supabase.from("Member").insert({id: data.user.id,username: username})
          if(error){
            return {error: "Account already exists"};
          }
          else{
            redirect(303,"/login")
          }
      }
    }
    
    }
      
    
}

