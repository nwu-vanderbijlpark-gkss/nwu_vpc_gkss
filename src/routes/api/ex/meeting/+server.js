import { json } from '@sveltejs/kit';

const returnData = (data, error) => {
	//used for returning data
	if (error) {
		return json({ success: false, data: error });
	} else {
		return json({ success: true, data: data });
	}
};

export const POST = async ({ url, locals: { supabase }, request }) => {
	const {
		data: { user }
	} = await supabase.auth.getUser();

	//the user is not authenticated
	if (!user) {
		return json({ success: false, data: { error: 'Not authenticated' } });
	}

	//get the url search params "tool", "meeting"
	const tool = url.searchParams.get('tool') || null;
	const tool_id = url.searchParams.get('toolId') || null;
	const meeting_id = url.searchParams.get('meeting') || null;

	//get the data sent
	const { data } = await request.json();

	//a specific tool is created for a specific meeting
	if (tool && meeting_id) {
		if (tool_id == 1) {
			//meaning this tool does not have an id yet
			const { data: toolData, error } = await supabase
				.from('meeting_tool')
				.insert({
					meeting_id: meeting_id,
					content: data.content,
					tool: tool,
					user_id: user.id
				})
				.select();
			return returnData(toolData, error);
		}
		const { data: toolData, error } = await supabase
			.from('meeting_tool')
			.upsert({
				id: tool_id,
				meeting_id: meeting_id,
				content: data.content,
				tool: tool,
				user_id: user.id
			})
			.select();
		return returnData(toolData, error);
	}

	//creation of a meeting
	const { data: meeting, error } = await supabase
		.from('meetings')
		.insert({
			name: data.name,
			date: data.date,
			description: data.description,
			creator_id: user.id
		})
		.select();

	return returnData(meeting, error);
};

export const GET = async ({ url, locals: { supabase } }) => {
	//get the url search params "tool", "meeting"
	const tool = url.searchParams.get('tool') || null;
	const meeting_id = url.searchParams.get('meeting') || null;

	//get a tool for a meeting
	if (tool && meeting_id) {
		const { data: toolData, er } = await supabase
			.from('meeting_tool')
			.select('content,member(username,email)')
			.eq('meeting_id', meeting_id)
			.eq('tool', tool)
			.order('created_at', { ascending: false });
		return returnData(toolData, er);
	}

	//get a meeting
	if (meeting_id) {
		const { data: meeting, error } = await supabase
			.from('meetings')
			.select('*,member(username,email)')
			.eq('id', meeting_id)
			.order('created_at', { ascending: false });
		return returnData(meeting, error);
	}
	//get all meetings
	const { data: meetings, error } = await supabase
		.from('meetings')
		.select('*,member(username,email)')
		.order('created_at', { ascending: false });
	return returnData(meetings, error);
};
