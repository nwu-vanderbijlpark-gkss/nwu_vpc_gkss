import { json } from '@sveltejs/kit';

export const POST = async ({locals: {supabase},request}) => {
    const formData = await request.formData();

    // Extract quiz details
    const title = formData.get('title');
    const due = formData.get('due');

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
    const {data: members} = await supabase.from("Member").select();
    //insert quiz
    const {data: dbQuiz ,error} = await supabase.from("Quiz").insert({
        title: title,
        creator_id: user.id,
        due: due
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

        
        return json({success: true})
    }else{
        return json({success: false,error});
    }
}