import type { ExtendedRoom, ExtendedSession } from '../../../types';
import type { Room } from '@prisma/client';
import { VERCEL_ENV } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = (async ({ fetch, locals, params }) => {
	const session: ExtendedSession = (await locals.getSession()) as ExtendedSession;
	const roomResponse: Response = await fetch(`/api/room/${params.roomid}`);
	const room: ExtendedRoom = await roomResponse.json();

	if (!room) {
		throw error(404, 'This is not the room you are looking for...');
	}

	return {
		session,
		room,
		env: VERCEL_ENV ? VERCEL_ENV : 'local'
	};
}) satisfies PageServerLoad;
