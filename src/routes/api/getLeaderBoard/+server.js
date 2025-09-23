

import { json } from '@sveltejs/kit'

export const GET = async ({locals: {supabase}}) => {
    const {data: Member} = await supabase.from("member").select("name, surname, username, image, points, topic(id),project(id)");
    let members = [];
    for(const member of Member){
        let publicUrl = await supabase.storage.from("files").getPublicUrl(member.image.substring(member.image.indexOf("/")+1));//removing the first "file/"
        members.push({...member,image: publicUrl.data.publicUrl});
    }
    return json({success: true,members});
}

