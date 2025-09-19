import { returnData } from '$lib/server/core.js';
import { json } from '@sveltejs/kit';

export const POST = async({locals:{supabase}, request}) => {
    //create an event
    //get the data sent from client
    const { data } = await request.json();
    const {data: event, error: eventError} = await supabase.from("events").insert({
        topic: data.topic,
        description: data.description,
        date: data.date,
        venue: data.venue,
        hasGroups: data.hasGroups,
        slug: data.topic.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        max_group_members: data.max_group_members

    }).select();
    return returnData(event,eventError);
}

export const GET = async({locals:{supabase}}) => {
    //fetch an event, do later
}

export const PUT = async({locals:{supabase}, request}) => {
    //update an event
    const { data } = await request.json();
    
    const {data: event, error: eventError} = await supabase.from("events").update({
        topic: data.topic,
        description: data.description,
        date: data.date,
        venue: data.venue,
        hasGroups: data.hasGroups,
        max_group_members: data.max_group_members,
        resources: data.resources
    }).eq('id', data.id).select();

    return returnData(event,eventError);
}