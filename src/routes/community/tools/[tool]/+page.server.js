import CryptoJS from "crypto-js";
import { GROQ_API_KEY } from '$env/static/private';

const SECRET_KEY = GROQ_API_KEY; 

function hashIP(ip) {
    return CryptoJS.HmacSHA256(ip, SECRET_KEY).toString(CryptoJS.enc.Hex);
}
export const load = async({locals: {supabase},params,getClientAddress }) => {
    const project_id = params.tool;
    let ip_address = getClientAddress();
    let hashed_ip = hashIP(ip_address);

    try {
        // Check if this IP already viewed the topic
        const { data: existingViews, error: lookupError } = await supabase
            .from('project_views')
            .select('id')
            .eq('project_id', project_id)
            .eq('ip_address', hashed_ip)
            .limit(1);

        if (lookupError) throw lookupError;

        // Only insert if there's no existing view
        if (!existingViews || existingViews.length === 0) {
            const { error: insertError } = await supabase
                .from('project_views')
                .insert({
                    project_id: project_id,
                    ip_address: hashed_ip, // Store hashed IP
                });

            if (insertError) throw insertError;
        }

    } catch (error) {
        console.error('Error tracking view:', error);
    }

    const {data: Project} = await supabase.from("Project").select("name,description,link,created_at,id,type,Member(username,name,surname),project_views(id)").eq("id",params.tool).order('created_at', { ascending: false });
    return {project: Project[0]};
} 