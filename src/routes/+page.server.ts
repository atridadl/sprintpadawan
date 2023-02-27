import type { PageServerLoad } from './$types';
import type { ExtendedSession } from '$lib/types';
import type { Room } from '@prisma/client';
import { VERCEL_ENV } from '$env/static/private';

import type { Config } from '@sveltejs/adapter-vercel';
 
export const config: Config = {
  runtime: 'edge',
  external: ["prisma"]
};

export const load: PageServerLoad = (async ({ fetch, locals }) => {
	const session: ExtendedSession = (await locals.getSession()) as ExtendedSession;
	const roomsResponse: Response = await fetch('/api/room');
	const rooms: Room[] = await roomsResponse.json();

	return {
		session,
		rooms,
		env: VERCEL_ENV ? VERCEL_ENV : 'local'
	};
}) satisfies PageServerLoad;
