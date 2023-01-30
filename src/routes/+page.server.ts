import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ fetch, locals }) => {
	return {
		session: await locals.getSession()
	};
}) satisfies PageServerLoad;
