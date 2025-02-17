export const load = async({locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    if(user){
        const {data: Member, error} = await supabase.from("Member").select("ai_chat").eq("id",user.id);
        return {chat: Member[0].ai_chat};
    }

}