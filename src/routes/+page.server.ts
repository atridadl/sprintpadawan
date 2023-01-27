import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const response = await fetch('/api/hello');
	const data = async () => await response.json();
	return {
		data: data()
	};
}) satisfies PageServerLoad;
