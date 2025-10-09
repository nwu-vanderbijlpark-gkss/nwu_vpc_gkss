import { json } from '@sveltejs/kit'

export const GET = async ({locals: {supabase}}) => {
    const {data: memberData} = await supabase.from("member").select("name, surname, username, image, points").order('points', { ascending: false });
    let members = [];
    for(let member of memberData){
        let publicUrl = member.image ? await supabase.storage.from("files").getPublicUrl(member?.image?.substring(member.image?.indexOf("/"))): null;//removing the first "file/"
        member = {...member,image: publicUrl?.data?.publicUrl ? publicUrl.data.publicUrl : "/temp/avatar.jpeg"};
        members.push(member);
    }

    members = members.filter((m) => m.name && m.username);
    return json({success: true,members});
}

