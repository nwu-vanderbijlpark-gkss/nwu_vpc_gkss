export const load = async ({ params, locals: { supabase } }) => {
    const { data: { user } } = await supabase.auth.getUser();
    let isAdmin = false;

    if (user) {
        const { data: Team } = await supabase.from('Team').select('*');

        if (Team) {
            for (const member of Team) {
                if (user.email === member.email) {
                    isAdmin = true;
                    break;
                }
            }
        } else {
            return {
                success: false,
                message: "You have no rights to visit this page. Ask the leaders to assist."
            };
        }

        // Check if user is admin before proceeding
        if (!isAdmin) {
            return {
                success: false,
                message: "Only an executive member can confirm attendance."
            };
        }

        let event_id = params.event_id;
        let attendance_id = params.attendance_id;

        const { data: attendance, error } = await supabase
            .from("event_attendee")
            .select("*,Events(topic),Member(name,surname,gender,points)")
            .eq("id", attendance_id);

        if (attendance) {
            if (attendance[0].status !== "attended") {
                const { data: attending, error } = await supabase
                    .from("event_attendee")
                    .update({ status: "attended" })
                    .eq("id", attendance_id)
                    .select("*,Member(id,name,surname,gender,points)");

                if (!error) {
                    let newPts = Number(attending[0].Member.points) + 100;
                    await supabase
                        .from("Member")
                        .update({ points: newPts })
                        .eq("id", attending[0].Member.id);
                    return { success: true, info: attending[0] };
                }
            } else {
                return {
                    success: false,
                    message: "You have already confirmed your attendance",
                    info: attendance[0]
                };
            }
        } else {
            return { success: false, message: "You have not registered for this event." };
        }
    } else {
        return { success: false, message: "You are not authenticated" };
    }
};
