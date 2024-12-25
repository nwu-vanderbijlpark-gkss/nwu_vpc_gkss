export async function load({locals: {supabase}}) {
    const {data,error} = await supabase.from("Events").select("*").limit(5).order('created_at', { ascending: false });
    return {events: data};
}

export const prerender = true;
