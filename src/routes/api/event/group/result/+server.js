import { returnData, table } from '$lib/server/core.js';
import { json } from '@sveltejs/kit';
import { decrypt, encrypt } from '$lib/server/core.js';

const tableName = 'event_results';

export const POST = async ({ locals: { supabase }, request, url }) => {
	//submit results

	const { data } = await request.json();

	/**
     * Data expected to be an array of :
     * {
            criteria_id: string,
            points: number,
            event_id: string,
            group_id: string
	    }
     */
	const { data: group, error } = await table(supabase, tableName).insert(data);
	return returnData(group, error);
};

export const GET = async ({ locals: { supabase }, url }) => {
	//get all results
	const id = url.searchParams.get('id') || null; //used to get one group

	const event_id = url.searchParams.get('event') || null; //used to get all groups in an event

	//getting all groups
	if (event_id) {
		const { data: groups, error } = await table(supabase, tableName)
			.select('*')
			.eq('event_id', event_id);

		return returnData(groups, error);
	} else if (id) {
		//getting one group
		const { data: group, error } = await table(supabase, tableName).select('*').eq('id', id);
		return returnData(group, error);
	} else {
		return returnData(null, { message: 'No info provided in the requested url.\n' + url });
	}
};
