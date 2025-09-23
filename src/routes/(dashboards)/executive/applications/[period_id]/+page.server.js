export const load = async ({ locals: {supabase}, params }) => {
    const period_id = params.period_id;
    const {data: application_period, error} = await supabase.from('application_period').select('*, applications(*, member(id,name,surname,email, whatsapp))').eq('id', period_id).order('created_at', { ascending: false }).single();
    return { application_period, error };
}