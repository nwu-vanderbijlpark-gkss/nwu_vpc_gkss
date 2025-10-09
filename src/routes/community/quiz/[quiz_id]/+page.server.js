export const load = async ({params,locals: {supabase}}) => {
    const {data: quiz, error} = await supabase.from("quiz").select("id,title,due,time_limit,created_at,member(username,name,surname,email),quiz_questions(*)").eq("id",params.quiz_id);
    let alreadyCompleted = false;
    let isAuthor = false;
    const {data: {user}} = await supabase.auth.getUser();
    
    if(quiz && user){
        const {data: attempt} = await supabase.from("quiz_attempt").select("*").eq("quiz_id",params.quiz_id).eq("user_id",user.id);
        if(attempt.length > 0){
            alreadyCompleted = true;
        }
        if(user.email == quiz[0].member.email){
            isAuthor = true;
        }
        return {quiz: quiz[0], alreadyCompleted, isAuthor};
    }

    else{
        if(!user){
            return {error: "User not authenticated"};
        }
        if(!quiz){
            return {error: "Quiz not found"}
        }
    }

}