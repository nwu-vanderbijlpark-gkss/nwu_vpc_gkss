export const load = async({locals: {supabase}}) => {
    const {data: Project} = await supabase.from("Project").select("name,description,link,created_at,id,type,Member(username,name,surname),project_views(id)").order('created_at', { ascending: false });
    return {projects: Project}
}