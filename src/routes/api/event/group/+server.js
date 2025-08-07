import { returnData, table } from '$lib/server/core.js';
import { json } from '@sveltejs/kit';
import { decrypt, encrypt } from "$lib/server/core.js"


const tableName = "event_group";

export const POST = async({locals:{supabase}, request, url}) => {
    //create a group
    const {data: {user}} = await supabase.auth.getUser();

    if(!user){
        return returnData(null,{message: "User not authenticated to create group"});
    }

    const { data } = await request.json();

    const event_id = url.searchParams.get("event") || null;
    const group_id = url.searchParams.get("id") || null;//used to submit the team's solution

    //data is expected to be an object with {name}, requires event_id and user_id
    if(event_id){
        const {data: group, error} = await table(supabase,tableName).insert({
            name: data.name,
            user_id: user.id,
            event_id: event_id
        }).select("*");

        return returnData(group,error);
    }
    if(group_id){
        //update only the submission part.
        const {data: group, error} = await table(supabase,tableName).update({
            submission: data.submission,
        }).eq("id",group_id);
        return returnData(group,error);
    }

}

export const GET = async({locals:{supabase}, url}) => {
    
    //get all groups if no id exists, get one group if the id exists
    const id = url.searchParams.get("id") || null;//used to get one group

    const judge_id = url.searchParams.get("judge") || null;//if available, only return groups the judge hasnt judged yet.

    const event_id = url.searchParams.get("event") || null;//used to get all groups in an event

    //getting all groups
    if(event_id && !judge_id){
        const {data: groups, error} = await table(supabase,tableName).select("*").eq("event_id",event_id);

        return returnData(groups,error);
    }
    else if (event_id && judge_id) {
        //  Get all groups and their event_results
        const {data: groups, error: groupsError} = await table(supabase, tableName)
            .select("*, event_results(*)")
            .eq("event_id", event_id); 

        // Filter out groups that the judge has already judged
        const unjudgedGroups = groups.filter(group => {
            // Assuming event_results is an array of results for each group
            const judgedByThisJudge = group.event_results.some(result => result.judge_id === judge_id);
            return !judgedByThisJudge;  // Keep only groups that the judge hasn't judged
        });
        console.log(groups)
        return returnData(unjudgedGroups, groupsError);
    }
    else if(id){
        //getting one group
        const {data: group, error} = await table(supabase,tableName).select("*").eq("id",id);
        return returnData(group,error);
    }
    else{
        return returnData(null,{message: "No info provided in the requested url.\n"+url});
    }
}