import { redirect } from '@sveltejs/kit';

export const load = async ({locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect(303,"/login");
    }
    const {data: Member} = await supabase.from("Member").select("").eq("id",user.id);
    if(Member.length > 0){
        if(Member[0].interests){
            let member = Member[0];
            let publicUrl = await supabase.storage.from("files").getPublicUrl(member.image.substring(member.image.indexOf("/")+1));//removing the first "file/"
            member.image = publicUrl.data.publicUrl;
            member.id = 0;//hide the member's id
            console.log(member);
            return member;    
        }
        else{
            redirect(303,"/onboarding");
        }
    }
    else{
        redirect(303,"/login");
    }
}

export const actions = {
    logout: async ({locals: {supabase}}) => {
        const { error } = await supabase.auth.signOut();
        redirect(303,"/login");
    },
    inviteUser: async ({locals: {supabase},request}) => {
        console.log("here")
    }
}