import { redirect } from '@sveltejs/kit';

export const load = async ({locals: {supabase}}) => {
    const {data: team} = await supabase.from("team").select("*, member(*)").order("created_at",{ascending: true});
    const leaders = [];
    for(let leader of team){
        let publicUrl = await supabase.storage.from("files").getPublicUrl(leader.member.image.substring(leader.member.image.indexOf("/")));//removing the first "file/"
        leader.member = {...leader.member,image: publicUrl.data.publicUrl};
        leaders.push(leader);
    }
    return {team: leaders};
}

export const actions = {
    deleteMember: async ({locals: {supabase},request}) => {
        //delete event based on id
        const data = await request.formData();
        const id = data.get("id");
        const {error} = await supabase.from("team").delete().eq("id",id);
        redirect(303,"/executive/team");
    },
}