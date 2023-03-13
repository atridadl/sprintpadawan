import type { PageServerLoad } from './$types';
import type { ExtendedRoom, ExtendedSession } from '$lib/types';
import { VERCEL_ENV } from '$env/static/private';

export const load: PageServerLoad = (async ({ fetch, locals }) => {
	const session: ExtendedSession = (await locals.getSession()) as ExtendedSession;
	const roomsResponse: Response = await fetch('/api/room');
	const rooms: ExtendedRoom[] = await roomsResponse.json();

	return {
		session,
		rooms,
		env: VERCEL_ENV ? VERCEL_ENV : 'local'
	};
}) satisfies PageServerLoad;
