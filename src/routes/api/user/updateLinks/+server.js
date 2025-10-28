import { json } from '@sveltejs/kit';

export const POST = async ({ locals: { supabase }, request }) => {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	const { linkedin, github, portfolio } = await request.json();
	const { data: Member, error } = await supabase
		.from('member')
		.update({ linkedin: linkedin, github: github, portfolio: portfolio })
		.eq('id', user.id);
	if (!error) {
		return json({ success: true });
	} else {
		return json({ success: false, error });
	}
};
