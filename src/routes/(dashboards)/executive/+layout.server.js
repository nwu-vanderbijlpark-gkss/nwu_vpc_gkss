import { models } from '$lib/state.svelte.js';
import { redirect } from '@sveltejs/kit';

export async function load({locals: {supabase}}) {
    /** @author: @lethabomaepa11
     * @title : Protecting Executive pages
     * @description:
     * Gets the currently logged in user
     * checks if the user is an executive user, how?
     * every user must use their student email, it starts with the student number ends with @mynwu.ac.za
     * and the executive team in the database have their student number stored
     * so we check the student email if it belongs to an executive member, then  redirect to the correct page if not an executive member
     * if its an executive member, do not redirect
     */
    const {data: {user}} = await supabase.auth.getUser();
    let currentUser = null;
    if(user){
        let { data: team } = await supabase
            .from('team')
            .select('*')   
        if(team){
            let ismember = false;
            team.forEach(async(member) => {
                //check if the user accessing the executive pages is an executive member
                if(user.email === (member.email)){ 
                    ismember = true;
                    currentUser = member;
                }
            });
            !ismember && redirect(303,"/dashboard");//redirect the user to member dashboard if theyre not an executive member
        }
        //data to be returned
        let publicUrl = await supabase.storage.from("files").getPublicUrl(currentUser.image.substring(currentUser.image.indexOf("/")));//removing the first "file/"
        currentUser = {...currentUser,image: publicUrl.data.publicUrl}
        let returnData = {currentUser}; //initially with the current logged in user
        //events
        const {data: events, error} = await supabase.from("events")
                            .select('*,event_attendee(id)')                      
        returnData = {...returnData, events: events};//insert the events data

        //memberS
        const {data: memberData} = await supabase.from("member").select('*');
        const members = [];
        for(let member of memberData){
            let publicUrl = await supabase.storage.from("files").getPublicUrl(member.image.substring(member.image.indexOf("/")));//removing the first "file/"
            member = {...member,image: publicUrl.data.publicUrl};
            members.push(member);
        }
        returnData = {...returnData, members};
        //team
        const teamMembers = [];
        for(let leader of team){
            let publicUrl = await supabase.storage.from("files").getPublicUrl(leader.image.substring(leader.image.indexOf("/")));//removing the first "file/"
            leader = {...leader,image: publicUrl.data.publicUrl};
            teamMembers.push(leader);
        }
        returnData = {...returnData, team: teamMembers};//insert the team data
        //get more data like event registrations, event attendance, get the turnout percentage
        return returnData;
    }
    else{
        redirect(303,"/login");
    }
    
}