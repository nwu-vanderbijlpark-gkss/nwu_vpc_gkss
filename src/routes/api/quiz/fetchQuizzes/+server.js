import { json } from '@sveltejs/kit';

export const GET = async ({locals: {supabase}}) => {
    const {data: quizzes, error} = await supabase.from("quiz").select("id,title,created_at,due, time_limit,member(username,name,surname),quiz_questions(*)");
    if(error){
        return json({success: false, error})
    }
    return json({success: true,quizzes})
}