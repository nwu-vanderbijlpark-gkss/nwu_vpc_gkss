import { json } from '@sveltejs/kit';

export const POST = async ({locals: {supabase},request}) => {
    const {quiz} = await request.json();
    const {data: {user}} = await supabase.auth.getUser();
    const {data: members} = await supabase.from("Member").select();
    //insert quiz
    const {data: dbQuiz ,error} = await supabase.from("Quiz").insert({
        title: quiz.title,
        creator_id: user.id,
        due: quiz.due
    }).select();
    if(!error){
        //insert questions
        quiz.questions.forEach(async (question) => {
            const {data: res, error} = await supabase.from("quiz_questions").insert({
                quiz_id: dbQuiz[0].id,
                type: question.type,
                text: question.text,
                options: question.options,
                correctOption: question.correctOption,
                correctAnswer: question.correctAnswer,
                points: question.points,
            }).select();  
        });

        //send emails to every member with an email
        members.forEach(async(member) => {
            if(member.email){
                let data = {
                    subject: 'New Quiz Alert',
                    message: `A new quiz: <b>${quiz.title}</b> has been posted,<br>
                The quiz is due: ${quiz.due}<br/>
                This is an automatic message sent by our website. <a href="https://nwu-vaal-gkss.netlify.app">https://nwu-vaal-gkss.netlify.app<a/><br/>
                    `
                };
        
                const res = await fetch('https://nwu-vaal-gkss.netlify.app/community/api/sendEmail', {
                    method: 'POST',
                    body: JSON.stringify({ data })
                });
        }
        });
        return json({success: true})
    }else{
        return json({success: false,error});
    }
}