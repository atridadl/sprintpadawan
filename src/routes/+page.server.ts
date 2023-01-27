import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const response = await fetch('/api/hello');
	const data = await response.json();

	return {
		data
	};
}) satisfies PageServerLoad;
