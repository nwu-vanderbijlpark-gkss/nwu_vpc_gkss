export const load = async({request, locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    if(user){
        let { data: Team } = await supabase
            .from('Team')
            .select('email')   
        if(Team){
            let isMember = false;
            Team.forEach(member => {
                //check if the user accessing the executive pages is an executive member
                if(user.email === (member.email)){ 
                    isMember = true;                    
                }
            });
       return {isLoggedIn: true, isExecutive: isMember};
        }
    }
    else{
        return {isLoggedIn: false};
    }
}