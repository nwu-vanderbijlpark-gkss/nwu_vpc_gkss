import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({fetch}) {
    const req = await fetch("/api/ex/meeting");
    
    const res = await req.json();

    if(res.success){
        return {meetings: res.data}
    }
    else{
        throw error(404);
    }
}