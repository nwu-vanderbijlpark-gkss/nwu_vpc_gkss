import { models } from '$lib/state.svelte.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase } }) {
	/** @author: @lethabomaepa11
	 * @title : Protecting Executive pages
	 * @description:
	 * Gets the currently logged in user
	 * checks if the user is an executive user, how?
	 * and the executive team in the database have their student number stored
	 * so we check the student email if it belongs to an executive member, then  redirect to the correct page if not an executive member
	 * if its an executive member, do not redirect
	 */
	const {
		data: { user }
	} = await supabase.auth.getUser();
	let currentUser = null;

	if (user) {
		let { data: member } = await supabase
			.from('team')
			.select('*, member(*)')
			.eq('member_id', user.id)
			.limit(1)
			.single();
		if (!member) {
			redirect(303, '/dashboard'); //redirect the user to member dashboard if theyre not an executive member
		}
		currentUser = member;
		//data to be returned
		let publicUrl = await supabase.storage
			.from('files')
			.getPublicUrl(currentUser.member.image.substring(currentUser.member.image.indexOf('/'))); //removing the first "file/"
		currentUser.member = { ...currentUser.member, image: publicUrl.data.publicUrl };

		//events
		const { data: events, error } = await supabase.from('events').select('*,event_attendee(id)');

		//members
		const { data: memberData } = await supabase.from('member').select('*');
		const members = [];
		for (let member of memberData) {
			let publicUrl = await supabase.storage
				.from('files')
				.getPublicUrl(member.image.substring(member.image.indexOf('/'))); //removing the first "file/"
			member = { ...member, image: publicUrl.data.publicUrl };
			members.push(member);
		}

		return { currentUser, members, events };
	} else {
		redirect(303, '/login');
	}
}
