import { redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase } }) {
	const {data: {user}} = await supabase.auth.getUser();
	if(user) redirect("308","/dashboard")
	const { data, error } = await supabase
		.from('events')
		.select('*')
		.limit(5)
		.order('created_at', { ascending: false });
	return { events: data };
}
