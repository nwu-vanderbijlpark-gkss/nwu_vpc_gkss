export const load = async({locals: {supabase},params}) => {
    const {data: Project} = await supabase.from("Project").select("name,description,link,created_at,id,Member(username,name,surname)").eq("id",params.tool).order('created_at', { ascending: false });
    return {project: Project[0]};
} 