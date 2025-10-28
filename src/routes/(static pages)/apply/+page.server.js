import moment from 'moment';

export async function load({ locals: { supabase } }) {
	const { data: periods, error } = await supabase.from('application_period').select('*');
	if (error) console.error(error);
	else {
		const period = periods.find(
			(period) =>
				moment(period.open_date).isBefore(moment()) && moment(period.close_date).isAfter(moment())
		);
		if (period) {
			let roles = [
				'Chairperson',
				'Deputy Chairperson',
				'Secretary',
				'Treasurer',
				'Tech and Innovation Lead',
				'Community Manager',
				'Recruitment Officer',
				'Sponsorship and Fundraising Coordinator',
				'Marketing Manager',
				'Project Manager',
				'Other'
			];

			//filter roles that are already filled for the period
			const { data: filledRoles, error: filledRolesError } = await supabase
				.from('team')
				.select('role')
				.eq('year', period.year);

			roles = roles.filter(
				(role) =>
					!filledRoles.some((filledRole) => filledRole.role.toLowerCase() === role.toLowerCase())
			);
			return { period, applicationsOpen: true, roles };
		} else return { period: null, applicationsOpen: false };
	}
}
