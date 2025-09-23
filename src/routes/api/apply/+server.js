import { gkssConfig } from '$lib/config';

export const POST = async ({locals: {supabase}, request, fetch}) => {
    const {data: {user}} = await supabase.auth.getUser();

    if(!user) 
        return new Response(JSON.stringify({error: "You must be logged in to apply"}), {status: 401});

    const data = await request.formData();

    const role = data.get("role");
    const message = data.get("message");

    const {error} = await supabase.from("applications").insert({role: role, message: message, status: "submitted", member_id: user.id});
    if(error) 
        return new Response(JSON.stringify({error: error.message}), {status: 500});
    

    const emailMessage = `
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #4a4a4a; margin: 10px 0;">
            We have received your application for the position of <b style="color: #005b99;">${role}</b> with the ${gkssConfig.name}.<br><br>
            Best regards,<br>
            ${gkssConfig.name} Recruitment Team
        </p>
        `;
    const subject = 'Application confirmation';

    const { data:  member  } = await supabase.from("member").select("*").eq("id", user.id).single();
    const req = await fetch("/api/sendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: {
                        fullName: member.name + " " + member.surname,
                        email: member.email,
                        subject: subject,
                        message: emailMessage,
                        type: 'broadcast'
                    }
                })
            })
    const res = await req.json();
    return new Response(JSON.stringify({success: "Application submitted successfully"}), {status: 200});
}