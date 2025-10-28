import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase } }) => {
	const { location } = await request.json();
	let visitor = null;
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (user) {
		visitor = user.email;
	} else {
		visitor = 'anonymous';
	}
	const { data, error } = await supabase
		.from('app_usage')
		.insert({ location: location, visitor: visitor });
	if (!error) return json({ success: true });
	else return json({ success: false, error });
};
