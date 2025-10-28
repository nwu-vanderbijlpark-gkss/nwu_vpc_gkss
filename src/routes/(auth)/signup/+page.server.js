import { gkssConfig } from '$lib/config';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals: { supabase }, request, fetch }) => {
		const details = await request.formData(); //get the form data from the submitted form
		const email = details.get('email');
		const password = details.get('password');
		const username = email.split('@')[0];

		const { data: member, error } = await supabase.from('member').select().eq('username', username);
		if (member.length > 0) {
			//if the username already exists
			return { error: 'User already exists' };
		} else {
			const { data, error } = await supabase.auth.signUp({
				email: email,
				password: password,
				options: {
					emailRedirectTo: gkssConfig.url + '/login'
				}
			});

			if (error) {
				return { error: 'Failed to create account' };
			} else {
				const { error } = await supabase
					.from('member')
					.insert({ id: data.user.id, username: username });
				if (error) {
					return { error: 'Account already exists' };
				} else {
					//send account creation confirmation email
					const emailMessage = `
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #4a4a4a; margin: 10px 0;">
                You have a new ${gkssConfig.name} account </br>
                  This is a confirmation that a ${gkssConfig.name} account was recently created for this email address.
              </p>
              `;
					const subject = gkssConfig.name + ' account created';

					const req = await fetch('/api/sendEmail', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							data: {
								fullName: '@' + username,
								email: email,
								subject: subject,
								message: emailMessage,
								type: 'broadcast'
							}
						})
					});
					const res = await req.json();
					redirect(303, '/onboarding');
				}
			}
		}
	}
};
