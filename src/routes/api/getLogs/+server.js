import { json } from '@sveltejs/kit';

export const GET = async ({locals: {supabase}}) => {
    const {data, error} = await supabase.from("app_usage").select("*").order('created_at', { ascending: false });
    if(error) return json({success: false, error})
    return json({success: true, data})
}