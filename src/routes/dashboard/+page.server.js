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
            //EVENTS
        const {data: Events} = await supabase.from("Events")
        .select('*').order('date', { ascending: false });
        const {data: Member_invitaion} = await supabase.from("Member_invitaion")
        .select('*').order('date', { ascending: false });

            return {member,events: Events,invitations: Member_invitaion};    
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
        const {data: {user}} = await supabase.auth.getUser();
        const formData = await request.formData();
        const email = formData.get("email");
        if(email){
            const {error } = await supabase.auth.admin.inviteUserByEmail(email);
            if(error){
                console.error("Failed to send invitation link: "+error);
            }else{
                //add the record
                const {} = await supabase.from("Member_invitaion").insert({
                    user_id: user.id,
                    email: email,
                })
                //award the member with 20 points
                const {data: Member} = await supabase.from("Member").select("points").eq("id",user.id);
                let newPts = Number(Member[0].points) + 20;
                await supabase.from("Member").update({points: newPts}).eq("id",user.id);

            }

        }
    },
    editProfile: async ({locals: {supabase},request}) => {
        const form = await request.formData();
        const {data: {user}} = await supabase.auth.getUser();

        if(user){
            const {data,error} = await supabase.from("Member").update({
                name: form.get("name"), surname: form.get("surname"), date_of_birth: form.get("date_of_birth"), gender: form.get("gender"),
        qualification: form.get("qualification"),  year_of_study: form.get("year_of_study"),}).eq("id",user.id);

            if(error){
                console.error(error);
            }
        }

    },
}