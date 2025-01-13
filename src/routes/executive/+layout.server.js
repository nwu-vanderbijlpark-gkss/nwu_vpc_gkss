import { redirect } from '@sveltejs/kit';

export async function load({locals: {supabase}}) {
    /** @author: @lethabomaepa11
     * @title : Protecting Executive pages
     * @description:
     * Gets the currently logged in user
     * checks if the user is an executive user, how?
     * every user must use their student email, it starts with the student number ends with @mynwu.ac.za
     * and the executive team in the database have their student number stored
     * so we check the student email if it belongs to an executive member, then  redirect to the correct page if not an executive member
     * if its an executive member, do not redirect
     */
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
            !isMember && redirect(303,"/community");//redirect the user to community pages if theyre not an executive member
        }
    }
    else{
        redirect(303,"/login");
    }
    
}