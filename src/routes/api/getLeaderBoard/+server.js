

import { json } from '@sveltejs/kit'

export const GET = async ({locals: {supabase}}) => {
    const {data: Member} = await supabase.from("member").select("name, surname, username, image, points, topic(id),project(id)");
    let members = [];
    for(let member of Member){
        let publicUrl = member.image ? await supabase.storage.from("files").getPublicUrl(member?.image?.substring(member.image?.indexOf("/"))): null;//removing the first "file/"
        member = {...member,image: publicUrl?.data?.publicUrl ? publicUrl.data.publicUrl : "/temp/avatar.jpeg"};
        members.push(member);
    }
    return json({success: true,members});
}

