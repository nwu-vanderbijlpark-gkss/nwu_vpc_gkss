//used for getting data onmount and when a new item has been added
export const getData = async (event) => {
	//get the judges and judging criteria
	const judgesPromise = await fetch('/api/event/judge?event=' + event.id);
	const criteriaPromise = await fetch('/api/event/criteria?event=' + event.id);
	const [judgesResponse, criteriaResponse] = await Promise.all([judgesPromise, criteriaPromise]);
	const judgeRes = await judgesResponse.json();
	const critRes = await criteriaResponse.json();

	let judges, judgingCriteria;
	//if success, set the data
	if (judgeRes.success) {
		judges = judgeRes.data;
	}

	if (critRes.success && critRes.data.length) {
		judgingCriteria = critRes.data;
	}
	return { judges, judgingCriteria };
};
