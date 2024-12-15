export async function load({locals: {supabase}}) {
    const {data,error} = await supabase.from("Events").select("*").limit(5).order('created_at', { ascending: false });
    return {events: data};
}


// src/routes/+page.server.js
export const actions = {
    toggleTopicLike: async ({ request, locals: { supabase } }) => {
        try {
            const formData = await request.formData();
            const topicId = formData.get('topicId');
            const userId = formData.get('userId');

            if (!topicId || !userId) {
                return { status: 400, body: { error: 'Topic ID and User ID are required.' } };
            }

            // Check if the like exists
            const { data: existingLike, error: fetchError } = await supabase
                .from('Topic_likes')
                .select('*')
                .eq('topic_id', topicId)
                .eq('user_id', userId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                return { status: 500, body: { error: 'Error checking existing like.' } };
            }

            if (existingLike) {
                // Remove like if it exists
                const { error: deleteError } = await supabase
                    .from('Topic_likes')
                    .delete()
                    .eq('id', existingLike.id);

                if (deleteError) {
                    return { status: 500, body: { error: 'Error removing like.' } };
                }

                return { status: 200, body: { message: 'Like removed successfully.' } };
            } else {
                // Add like if it doesn't exist
                const { error: insertError } = await supabase
                    .from('Topic_likes')
                    .insert({ topic_id: topicId, user_id: userId });

                if (insertError) {
                    return { status: 500, body: { error: 'Error adding like.' } };
                }

                return { status: 200, body: { message: 'Like added successfully.' } };
            }
        } catch (err) {
            console.error('Unexpected error in toggleTopicLike:', err);
            return { status: 500, body: { error: 'Unexpected error occurred.' } };
        }
    }
};
