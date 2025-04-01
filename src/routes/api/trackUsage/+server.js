import { json } from "@sveltejs/kit";

export const POST = async ({ request, locals: { supabase } }) => {
    const { location } = await request.json();
    const { data, error } = await supabase.from("app_usage").insert({ location: location });
    if (!error) return json({ success: true });
    else return json({ success: false, error });
}