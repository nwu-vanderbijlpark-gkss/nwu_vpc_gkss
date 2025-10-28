import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const newPassword = formData.get('newPassword');
		const { data, error } = await supabase.auth.updateUser({
			password: newPassword
		});
		if (!error) {
			redirect(303, '/dashboard');
		} else {
			redirect(303, '/login');
		}
	}
};
