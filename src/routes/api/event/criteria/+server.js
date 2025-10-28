import { returnData, table } from '$lib/server/core.js';
import { json } from '@sveltejs/kit';

const tableName = 'event_criteria';

//create criteria for event
export const POST = async ({ locals: { supabase }, request }) => {
	const { data } = await request.json();
	const eventId = data[0]?.event_id; // assuming all items have the same event_id

	if (!eventId) {
		return returnData(null, 'Missing event_id');
	}

	// 1. Delete all existing criteria for this event
	const { error: deleteError } = await table(supabase, tableName).delete().eq('event_id', eventId);

	if (deleteError) {
		return returnData(null, deleteError);
	}

	// 2. Insert the new criteria array
	const { data: insertedData, error: insertError } = await table(supabase, tableName)
		.insert(data)
		.select();

	return returnData(insertedData, insertError);
};

//fetch all criteria for an event
export const GET = async ({ locals: { supabase }, url }) => {
	const event_id = url.searchParams.get('event');

	const { data: criteria, error: criteriaError } = await table(supabase, tableName)
		.select('*')
		.eq('event_id', event_id);
	return returnData(criteria, criteriaError);
};

//delete a criteria by id
export const DELETE = async ({ locals: { supabase }, url }) => {
	const id = url.searchParams.get('id') || null;

	if (id) {
		const { data, error } = await table(supabase, tableName).delete().eq('id', id);
		return returnData(data, error);
	}

	return returnData(null, { message: 'Criteria Id not provided as searchParam: id' });
};
