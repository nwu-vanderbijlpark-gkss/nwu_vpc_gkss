import { gkssConfig } from '$lib/config.ts';
import { json } from '@sveltejs/kit';
import moment from 'moment';

export const PUT = async ({ request, locals: { supabase }, url, fetch }) => {
    
    const { data } = await request.json();
    
    
    const status = url.searchParams.get('status') == 'true';
    const interview = url.searchParams.get('interview') == 'true';

    //change status: /api/ex/applications?status=true&interview=false
    if (status) {
        if(!['accepted', 'rejected', 'pending'].includes(data.status)) {
            return json({ error: 'Invalid status' });
        }
        const { error } = await supabase.from('applications').update({ status: data.status }).eq('id', data.id);
        //send email notification

        //letter templates
        const regretLetter = `We regret to inform you that your application for <b>${data.role}</b> has been unsuccessful. <br/> We wish you all the best in your future endeavors.`;
        const acceptLetter = `Congratulations! We are pleased to inform you that your application for <b>${data.role}</b> has been successful.<br/> You are our new <b>${data.role}</b>. We will be in touch with you soon.`;

        //determine subject and message
        const subject = data.status == 'accepted' ? 'Application successful' : 'Application unsuccessful';
        const message = data.status == 'accepted' ? acceptLetter : regretLetter;

        
        
        const req = await fetch("/api/sendEmail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        data: {
                            fullName: data.member.name + " " + data.member.surname,
                            email: data.member.email,
                            subject: subject,
                            message: message,
                            type: 'broadcast'
                        }
                    })
                })
        const res = await req.json();
        return json({ error });
    }

    //schedule interview: /api/ex/applications?status=false&interview=true
    if (interview) {
        if(data.timestamp == null) {
            return json({ error: 'Invalid timestamp' },{ status: 400 });
        }
        const { error } = await supabase.from('applications').update({ interview_timestamp: data.timestamp }).eq('id', data.id);
        //send email notification
        const interviewLetter = `
            <p style="font-family: Arial, sans-serif; font-size: 14px; color: #4a4a4a; margin: 10px 0;">
                We are pleased to inform you that you have been shortlisted for an interview for the position of <b style="color: #005b99;">${data.role}</b> with the ${gkssConfig.name}.<br><br>
                Your interview is scheduled for <b style="color: #005b99;">${moment(data.timestamp).format('MMMM D, YYYY [at] h:mm A')}</b>.<br><br>
                Please join the interview using this link: <a href="${data.meeting_link}" style="color: #005b99; text-decoration: none; font-weight: bold;">Join Interview</a>.<br><br>
                ${data.interview_notes ? `Additional Notes: ${data.interview_notes}<br><br>` : ''}
                Please arrive on time and prepare for a discussion about your application. Contact us at <a href="mailto:${gkssConfig.email}" style="color: #005b99; text-decoration: none;">${gkssConfig.email}</a> with any questions.<br><br>
                Best regards,<br>
                ${gkssConfig.name} Recruitment Team
            </p>
            `;
        const subject = 'Interview Scheduled';
        const message = interviewLetter;

        const req = await fetch("/api/sendEmail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        data: {
                            fullName: data.member.name + " " + data.member.surname,
                            email: data.member.email,
                            subject: subject,
                            message: message,
                            type: 'broadcast'
                        }
                    })
                })
        const res = await req.json();

        return json({ error });
    }
}

export const GET = async ({ locals: { supabase } }) => {
    const {data: applications, error} = await supabase.from('applications').select('*, member(name,surname,email)').order('created_at', { ascending: false });
    return json({ applications, error });
}