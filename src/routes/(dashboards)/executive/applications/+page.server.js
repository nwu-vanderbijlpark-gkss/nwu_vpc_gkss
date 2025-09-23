export const load = async ({ locals: {supabase} }) => {
    const {data: periods, error} = await supabase.from("application_period").select("*,applications(id)").order('created_at', { ascending: false });
    return { periods };
}