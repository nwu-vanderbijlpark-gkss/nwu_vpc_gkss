import { json } from '@sveltejs/kit';

export const POST = async ({locals: {supabase},request, fetch}) => {
    const formData = await request.formData();

    // Extract quiz details
    const title = formData.get('title');
    const due = formData.get('due');
    const time_limit = formData.get('time_limit');

    // Extract questions
    const questions = [];
    for (let i = 0; ; i++) {
        const text = formData.get(`questions[${i}][text]`);
        const image = formData.get(`questions[${i}][image]`); // This will be a File object
        const options = formData.get(`questions[${i}][options]`);
        const type = formData.get(`questions[${i}][type]`);
        const correctOption = formData.get(`questions[${i}][correctOption]`);
        const correctAnswer = formData.get(`questions[${i}][correctAnswer]`);
        const points = formData.get(`questions[${i}][points]`);
        if (!text) break; // Stop when there are no more questions

        questions.push({ text, image, options, correctOption, correctAnswer, points, type });
    }

    const {data: {user}} = await supabase.auth.getUser();
    const {data: members} = await supabase.from("member").select();
    //insert quiz
    const {data: dbQuiz ,error} = await supabase.from("quiz").insert({
        title: title,
        creator_id: user.id,
        due: due,
        time_limit: time_limit
    }).select();
    if(!error){
        //insert questions
        questions.forEach(async (question) => {
            let image = "none";
            if(question.image){
                const file_url = `quiz_images/${Date.now()}_${question.image.name}`;
                            const {data,error:uploadError} = await supabase.storage
                                                        .from("files")
                                                        .upload(file_url,question.image);
                image = `https://cwzpmcosygdpwfgxgmbd.supabase.co/storage/v1/object/public/files/${file_url}`
            }
            if(question.type == "multipleChoice"){
                const {data: res, error} = await supabase.from("quiz_questions").insert({
                    quiz_id: dbQuiz[0].id,
                    type: question.type,
                    text: question.text,
                    options: JSON.parse(question.options),
                    correctOption: question.correctOption,
                    correctAnswer: question.correctAnswer,
                    points: question.points,
                    image: image
                }).select(); 
            }else{
                const {data: res, error} = await supabase.from("quiz_questions").insert({
                    quiz_id: dbQuiz[0].id,
                    type: question.type,
                    text: question.text,
                    correctAnswer: question.correctAnswer,
                    points: question.points,
                    image: image
                }).select(); 
            }                                        
        });

        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #4a90e2; font-size: 24px; margin: 0; display: inline-block; border-bottom: 3px solid #4a90e2; padding-bottom: 5px;">🎉 New Quiz Alert! 🎉</h2>
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="font-size: 16px; line-height: 1.5; color: #333; margin: 0 0 10px 0;">Exciting news! A fresh quiz has just landed in our portal, ready to challenge your wits and spark some fun discussions.</p>
                <p style="font-size: 18px; color: #e74c3c; margin: 0; font-weight: bold;">📚 Quiz Title: ${newQuiz.title}</p>
            </div>
            <div style="text-align: center;">
                <a href="/community/quiz/${dbQuiz[0].id}" 
                style="display: inline-block; background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; box-shadow: 0 2px 5px rgba(74,144,226,0.3); transition: background-color 0.3s ease;">
                🚀 Dive into the Quiz Now!
                </a>
            </div>
            <div style="text-align: center; margin-top: 15px; font-size: 12px; color: #888;">
                <p>Don't miss out—your community is waiting for your score! 📊</p>
            </div>
            </div>
            `;


            //send email to members
        members.map(async(member) => {
            await fetch("/api/sendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: {
                        fullName: member.name + " " + member.surname,
                        email: member.email,
                        subject: `New Quiz Challenge: Test Your Knowledge on ${newQuiz.title}!`,
                        message: message,
                        type: 'broadcast'
                    }
                })
            });
        })
        return json({success: true})
    }else{
        return json({success: false,error});
    }
}