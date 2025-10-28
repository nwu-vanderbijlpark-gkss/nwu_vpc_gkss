export const load = async ({ locals: { supabase } }) => {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (user) {
		const { data: ideas } = await supabase
			.from('ideas')
			.select('title,description,technologies,domain')
			.eq('user_id', user.id);
		return { ideas };
	}
};
