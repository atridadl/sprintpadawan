import type { ExtendedSession } from '$lib/types';
import type { Vote } from '@prisma/client';
import { VERCEL_ENV } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import type { Config } from '@sveltejs/adapter-vercel';
 
export const config: Config = {
  runtime: 'edge',
};

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = (async ({ fetch, locals, params }) => {
	const session: ExtendedSession = (await locals.getSession()) as ExtendedSession;
	const roomResponse: Response = await fetch(`/api/room/${params.roomid}`);
	const room = await roomResponse.json();

	if (!room) {
		throw error(404, 'This is not the room you are looking for...');
	}

	console.log(room.activeStory.votes.find((vote: Vote) => vote.userId === session.user.id));

	return {
		session,
		room,
		vote: room.activeStory.votes.find((vote: Vote) => vote.userId === session.user.id),
		env: VERCEL_ENV ? VERCEL_ENV : 'local'
	};
}) satisfies PageServerLoad;
