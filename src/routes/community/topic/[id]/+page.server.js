import CryptoJS from "crypto-js";
import { GROQ_API_KEY } from '$env/static/private';

const SECRET_KEY = GROQ_API_KEY; 

function hashIP(ip) {
    return CryptoJS.HmacSHA256(ip, SECRET_KEY).toString(CryptoJS.enc.Hex);
}

export async function load({ locals: { supabase }, request, params, getClientAddress }) {
    const topic_id = params.id;
    let ip_address = getClientAddress();
    let hashed_ip = hashIP(ip_address);

    try {
        // Check if this IP already viewed the topic
        const { data: existingViews, error: lookupError } = await supabase
            .from('topic_views')
            .select('id')
            .eq('topic_id', topic_id)
            .eq('ip_address', hashed_ip)
            .limit(1);

        if (lookupError) throw lookupError;

        // Only insert if there's no existing view
        if (!existingViews || existingViews.length === 0) {
            const { error: insertError } = await supabase
                .from('topic_views')
                .insert({
                    topic_id: topic_id,
                    ip_address: hashed_ip, // Store hashed IP
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

        const {error} = await supabase.from("comment").insert(
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
        const {data: member} = await supabase.from("member").select("points").eq("id",user.id);
        let newPts = Number(member[0].points) + 5;
        await supabase.from("member").update({points: newPts}).eq("id",user.id);
    }
}
