export const load = async({request, locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    let currentUser = null;
    if(user){
        let { data: Team } = await supabase
            .from('Team')
            .select('*')   
        if(Team){
            let isMember = false;
            Team.forEach(member => {
                //check if the user accessing the executive pages is an executive member
                if(user.email === (member.email)){ 
                    isMember = true;   
                    currentUser = member;                 
                }
            });
        let publicUrl = await supabase.storage.from("files").getPublicUrl(currentUser.image.substring(currentUser.image.indexOf("/")));//removing the first "file/"
        currentUser = {...currentUser,image: publicUrl.data.publicUrl}
       return {isLoggedIn: true, isExecutive: isMember, currentUser};
        }
    }
    else{
        return {isLoggedIn: false};
    }
}