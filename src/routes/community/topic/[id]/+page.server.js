
export async function load({ locals: { supabase }, request, params, getClientAddress }) {
    const topic_id = params.id;
    let ip_address = getClientAddress();
    try {
        // Check for existing view from this IP
        const { data: existingViews, error: lookupError } = await supabase
            .from('topic_views')
            .select('id')
            .eq('topic_id', topic_id)
            .eq('ip_address', ip_address)
            .limit(1);

        if (lookupError) throw lookupError;

        // Only create new view if no existing record
        if (!existingViews || existingViews.length === 0) {
            const { error: insertError } = await supabase
                .from('topic_views')
                .insert({
                    topic_id: topic_id,
                    ip_address: ip_address,
                });

            if (insertError) throw insertError;
        }

    } catch (error) {
        console.error('Error tracking view:', error);
    }

    return {};
}
export const actions =   {
    default: async({locals: {supabase},request,params}) => {
    //add a comment to db
        const {data: {user}} = await supabase.auth.getUser();
        const form = await request.formData();
        const topic_id = params.id;
        const comment = form.get("comment");

        const {error} = await supabase.from("Comment").insert(
            {
                topic_id: topic_id,
                author_id: user.id,
                content: comment,
            }
        )
        if(error){
            console.error(error)
        }
        //award the member with 5 points
        const {data: Member} = await supabase.from("Member").select("points").eq("id",user.id);
        let newPts = Number(Member[0].points) + 5;
        await supabase.from("Member").update({points: newPts}).eq("id",user.id);
    }
}
