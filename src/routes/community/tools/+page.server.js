export const load = async({locals: {supabase}}) => {
    const {data: Project} = await supabase.from("Project").select("name,description,link,created_at,id,Member(username,name,surname)").order('created_at', { ascending: false });
    return {projects: Project}
}