import { json } from '@sveltejs/kit';

export const POST = async ({ locals: { supabase }, request }) => {
	const { points, quiz_id } = await request.json();
	const {
		data: { user }
	} = await supabase.auth.getUser();
	//insert quiz
	const { data: attempt, error } = await supabase.from('quiz_attempt').insert({
		quiz_id: quiz_id,
		user_id: user.id,
		points: points
	});
	if (!error) {
		const { data: member } = await supabase.from('member').select('points').eq('id', user.id);
		let newPts = Number(member[0].points) + Number(points);
		await supabase.from('member').update({ points: newPts }).eq('id', user.id);
		return json({ success: true });
	}
	console.log(error);
	return json({ success: false, error });
};
