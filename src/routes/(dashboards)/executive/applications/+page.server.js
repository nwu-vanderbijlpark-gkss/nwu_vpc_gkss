export const load = async ({ locals: {supabase} }) => {
    const {data: applications, error} = await supabase.from('applications').select('*, member(id,name,surname,email)').order('created_at', { ascending: false });
    return { applications, error };
}