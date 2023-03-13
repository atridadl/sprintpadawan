import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { writeToChannel } from '$lib/server/ably.server';
import type { ExtendedSession } from '$lib/types';
import { VERCEL_ENV } from '$env/static/private';

const env = VERCEL_ENV ? VERCEL_ENV : 'local';

export const POST = (async ({ locals, params, request }) => {
	const session = (await locals.getSession()) as ExtendedSession;
	const body = await request.json();

	if (session) {
		if (!params.storyid) {
			throw error(400, 'Room ID not provided!');
		}

		const story = await prisma.story.update({
			where: {
				id: params.storyid
			},
			data: {
				name: body.name,
				userId: session.user.id,
				visible: body.visible
			}
		});
		if (body.name) {
			await prisma.vote.deleteMany({
				where: {
					storyId: story.id
				}
			});
		}

		writeToChannel(`${env}-${story.roomId}`, 'event', {
			type: 'STORY',
			action: 'UPDATE',
			success: true
		});
		return new Response(String(JSON.stringify(!!story)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
