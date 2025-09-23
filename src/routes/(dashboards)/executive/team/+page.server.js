import { gkssConfig } from '$lib/config.ts';
import { redirect } from '@sveltejs/kit';

export const load = async ({locals: {supabase}}) => {
    const {data: team} = await supabase.from("team").select("*, member(*)").eq("year", new Date().getFullYear()).order("created_at",{ascending: true});
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
    addMember: async ({locals: {supabase},request, fetch}) => {
        const data = await request.formData();
        const member_id = data.get("member_id");
        const member = JSON.parse(data.get("member"));//get the member object
        const role = data.get("role");
        const year = data.get("year");
        const {error} = await supabase.from("team").insert({member_id: member_id, role: role, year: year});

        const subject = `You have been added to the Executive Team`;
        const message = `You have been added to the Executive Team as ${role} for the year ${year}.\n
        Go to  <a href="${gkssConfig.url}/executive">executive dashboard </a> to view your team.`;
        //send email to the member added
        const req = await fetch("/api/sendEmail", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                data: {
                                    fullName: member?.name + " " + member?.surname,
                                    email: member?.email,
                                    subject: subject,
                                    message: message,
                                    type: 'broadcast'
                                }
                            })
                        })
        const res = await req.json();


        redirect(303,"/executive/team");
    },
}