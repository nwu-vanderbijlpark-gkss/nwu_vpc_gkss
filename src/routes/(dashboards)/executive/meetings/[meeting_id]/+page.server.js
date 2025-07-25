import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({fetch,params}) {
    const id = params.meeting_id;
    const req = await fetch(`/api/ex/meeting?meeting=${id}`);
    const res = await req.json();
    if(res.success){
        return {meeting: res.data[0]};
    }
    else{
        throw error(400);
    }
    
}