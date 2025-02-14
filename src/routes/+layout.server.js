export const load = async({request, locals: {supabase}}) => {
    const {data: {user}} = await supabase.auth.getUser();
    let currentUser = null;
    const {data: Member} = await supabase.from("Member").select('*');
    const members = [];
    for(let member of Member){
        let publicUrl = await supabase.storage.from("files").getPublicUrl(member.image.substring(member.image.indexOf("/")));//removing the first "file/"
        member = {...member,image: publicUrl.data.publicUrl};
        members.push(member);
    }
    let todaysBirthdays = members.filter((member) => {
        const today = new Date();
        const birthDate = new Date(member.date_of_birth);

        // Check if the member's birthday is today (ignore the year)
        return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
    });
    if(user){
        let { data: Team } = await supabase
            .from('Team')
            .select('*')   
        if(Team){
            let isMember = false;
            Team.forEach(member => {
                //check if the user accessing the executive pages is an executive member
                if(user.email === (member.email)){ 
                    isMember = true;   
                    currentUser = member;                 
                }
            });

            if(isMember){
                let publicUrl = await supabase.storage.from("files").getPublicUrl(currentUser.image.substring(currentUser.image.indexOf("/")));//removing the first "file/"
                currentUser = {...currentUser,image: publicUrl.data.publicUrl}
            }
            return {isLoggedIn: true, isExecutive: isMember, currentUser, todaysBirthdays};
        }
    }
    else{
        return {isLoggedIn: false, todaysBirthdays};
    }
}