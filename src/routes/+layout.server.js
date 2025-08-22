import { models } from '$lib/state.svelte.js';

export const load = async({request, locals: {supabase}}) => {

    const {data: {user}} = await supabase.auth.getUser();

    let currentUser = null;

    const {data: Member} = await supabase.from("Member").select('id,image,date_of_birth,name,surname,username,year_of_study,qualification, points, email');
    
    const members = [];

    for(let member of Member){
        let publicUrl = await supabase.storage.from("files").getPublicUrl(member.image.substring(member.image.indexOf("/")));//removing the first "file/"
        member = {...member,image: publicUrl.data.publicUrl};
        members.push(member);
    }
    
    if(user != null){
        let { data: Team } = await supabase
            .from('Team')
            .select('*')   
        if(Team){
            let isMember = false;//is executive member
            Team.forEach(member => {
                //check if the user accessing the executive pages is an executive member
                if(user.email === (member.email)){ 
                    isMember = true;   
                    currentUser = member;  
                    currentUser = {...currentUser, id: user.id};//add the user id to the current user object       
                }
            });
            if(!isMember){
                //return the current user
                currentUser = members.find(member => member.id == user.id);
                
            }

            if(currentUser && currentUser.image){
                let publicUrl = await supabase.storage.from("files").getPublicUrl(currentUser.image.substring(currentUser.image.indexOf("/")));//removing the first "file/"
                currentUser = {...currentUser,image: publicUrl.data.publicUrl}
            }
            //take the user email and insert into the database
            const {data, error} = await supabase.from("Member").update({email: user.email}).eq("id", user.id);

            return {isLoggedIn: true, isExecutive: isMember, currentUser, members};
        }
    }
    else{

        return {isLoggedIn: false, members};
    }
}