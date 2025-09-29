import { models } from '$lib/state.svelte.js';

export const load = async({request, locals: {supabase}}) => {

    const {data: {user}} = await supabase.auth.getUser();

    let currentUser = null;

    const {data: Member} = await supabase.from("member").select('id,image,date_of_birth,name,surname,username,year_of_study,qualification, points, email');
    
    const members = [];

    for(let member of Member){
        let publicUrl = member.image ? await supabase.storage.from("files").getPublicUrl(member?.image?.substring(member.image?.indexOf("/"))): null;//removing the first "file/"
        member = {...member,image: publicUrl?.data?.publicUrl ? publicUrl.data.publicUrl : "/temp/avatar.jpeg"};
        members.push(member);
    }
    
    if(user != null){

        // check if the user is an executive
        let isExecutive = false;
        let { data: leader } = await supabase.from('team').select('*').eq('member_id', user.id).limit(1).single();   
        if(leader){
            isExecutive = true;
        }

        // fetch the current user from the database
        let {data: currentUser} = await supabase.from("member").select('id,image,date_of_birth,name,surname,username,year_of_study,qualification, points, email').eq('id', user.id).single();

        // get the public url of the user's image from supabase storage
        if(currentUser){
            let publicUrl = currentUser.image ? await supabase.storage.from("files").getPublicUrl(currentUser.image?.substring(currentUser.image?.indexOf("/"))) : null;//removing the first "file/"
            currentUser = {...currentUser,image: publicUrl?.data?.publicUrl ? publicUrl.data.publicUrl : "/temp/avatar.jpeg"};
        
            //take the user email and insert into the database
            const {data, error} = await supabase.from("member").update({email: user.email}).eq("id", user.id);

            return {isLoggedIn: true, isExecutive, currentUser, members};
        }
    }
    else{
        return {isLoggedIn: false, members};
    }
}