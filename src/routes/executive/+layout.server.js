import { redirect } from '@sveltejs/kit';

export async function load({locals: {supabase}}) {
    const {data: {user}} = await supabase.auth.getUser();
    if(user){
        let { data: Team } = await supabase
            .from('Team')
            .select('student_no')   
        if(Team){
            let isMember = false;
            Team.forEach(member => {
                //check if the user accessing the executive pages is an executive member
                if(user.email === (member.student_no+"@mynwu.ac.za")){ 
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