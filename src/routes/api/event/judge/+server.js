import { returnData } from '$lib/server/core.js';
import { json } from '@sveltejs/kit';
import { decrypt, encrypt } from '$lib/server/core.js';
import { gkssConfig } from '$lib/config.ts';

export const POST = async ({ locals: { supabase }, request, url, fetch }) => {
	//create a judge, then send email to the judge.
	//get the data sent from client
	const { data } = await request.json();
	//data is expected to be an object with {fullname,email, event pathname, event topic}, we create a code for the judge.

	const code = encodeURIComponent(encrypt(data.event.id + '*' + data.email)); //use the encryption of their email and event_id in one long string.

	const { data: judge, error } = await supabase
		.from('event_judge')
		.insert({
			fullname: data.name,
			email: data.email,
			event_id: data.event.id
		})
		.select('fullname');

	const message = `
        We are excited to have you as our judge for <b>${data.event.topic}</b>,<br/>
        Please find below the URL to our portal.<br/><br/>
        You will be able to use our judging criteria to judge groups.<br/><br/>
        <a href="${gkssConfig.url}/events/${data.event.id}/judging?code=${code}">Click here to access the judging portal</a>
    `;

	await fetch('/api/sendEmail', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data: {
				fullName: data.name,
				email: data.email,
				subject: 'You have been added as a judge',
				message: message,
				type: 'broadcast'
			}
		})
	});

	return returnData(judge, error);
};

export const GET = async ({ locals: { supabase }, url, cookies }) => {
	const event_id = url.searchParams.get('event') || null; //used to display judges of an event
	let code = url.searchParams.get('code') || null;

	code ? (code = decodeURIComponent(code.trim()).replace(/ /g, '+')) : ''; //used to verify a judge
	if (code) {
		//verify the judge
		//decrypt the info
		const decoded = decrypt(code);
		const delimiterIndex = decoded.indexOf('*');
		const ev_id = decoded.substring(0, delimiterIndex);
		const email = decoded.substring(delimiterIndex + 1);

		//get the info that matches
		const { data: judge, error } = await supabase
			.from('event_judge')
			.select('*')
			.eq('event_id', ev_id)
			.eq('email', email);

		if (!error) {
			//set cookies
			cookies.set('judge', encrypt(JSON.stringify(judge)), { path: '/' });
			return returnData(judge, error);
		} else {
			return returnData(judge, error);
		}
	} else if (event_id) {
		//return the judges of a certain event
		const { data: judges, error } = await supabase
			.from('event_judge')
			.select('*')
			.eq('event_id', event_id);
		return returnData(judges, error);
	} else {
		return returnData(null, { message: 'No info provided in the requested url.\n' + url });
	}
};
