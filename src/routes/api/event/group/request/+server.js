import { returnData, table } from '$lib/server/core.js';
import { json } from '@sveltejs/kit';
import { decrypt, encrypt } from "$lib/server/core.js"

const tableName = "join_request";

export const POST = async({locals:{supabase}, url}) => {
    //send a send request to a group and send email to group creator
    const group_id = url.searchParams.get("group");
    const {data: {user}} = await supabase.auth.getUser();

    if(!user){
        return returnData(null,{message: "User not authenticated to send or accept join request"});
    }
    if(!group_id){
        return returnData(null, {message: "Expected request url to have '?group', which is the group id"});
    }

    const {data: request, error} = await table(supabase,tableName).insert({
        user_id: user.id,
        group_id: group_id,
    }).select();

    return returnData(request,error);
}

export const PUT = async({locals:{supabase}, request, url, fetch}) => {
    //update a request and send email to request sender
    const requestId = url.searchParams.get("id") || null;//used to update a request
    const state = url.searchParams.get("state");//used to determine if the request was rejected or accepted

    const {data} = await request.json();//expect group object, group_id and event_id

    if(requestId && state){
        const {data: request, error} = await table(supabase,tableName).update({
            state: state
        }).eq("id",requestId).select("*,member(id,email,name,surname),event_group(name)");

        //update the participant's group_id
        const {data: up, error: upError} = await table(supabase,"event_participant").update({
            event_group_id: data.group_id,
        }).eq("event_id",data.event_id).eq("user_id",request[0].member.id).select();

   

        if(!upError){
            //send email
            const subject = `Your group request status has changed`;
            const message = `You have been ${state} to join ${request[0].event_group.name}.\n
            Go to the event workspace or your dashboard.`;

            const req = await fetch("/api/sendEmail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        data: {
                            fullName: request[0].member?.name + " " + request[0].member?.surname,
                            email: request[0].member?.email,
                            subject: subject,
                            message: message,
                            type: 'broadcast'
                        }
                    })
                })
            const res = await req.json();
        }
        return returnData(request, error);
    }
    else{
        return returnData(null, {message: "Expected url to have '?id' and '?state'\n id: id of the request and state: the state the request is going to be updated to. "})
    }
}


export const GET = async({locals:{supabase}, url}) => {
    
    
    //Get all requests that are still in pending mode for a given group    
    const group_id = url.searchParams.get("group");

    //getting all requests
    if(group_id){
        const {data: requests, error} = await table(supabase,tableName).select("id,member(name,surname,email)").eq("group_id",group_id).eq("state","pending");

        return returnData(requests,error);
    }
    else{
        return returnData(null,{message: "Expected '?group={group_id}'\n group_id: Id of the group."});
    }
}