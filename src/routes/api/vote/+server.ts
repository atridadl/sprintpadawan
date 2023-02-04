import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { writeToChannel } from '$lib/server/ably.server';
import type { ExtendedSession } from '$lib/types';
import { VERCEL_ENV } from '$env/static/private';

const env = VERCEL_ENV ? VERCEL_ENV : 'local';

export const POST = (async ({ locals, request }) => {
	const session = (await locals.getSession()) as ExtendedSession;
	const body = await request.json();
	if (session) {
		if (!body.value) {
			throw error(400, 'Value not provided!');
		}

		if (!body.storyId) {
			throw error(400, 'Story ID not provided!');
		}

		const vote = await prisma.vote.upsert({
			where: {
				userId_storyId: {
					storyId: body.storyId,
					userId: session.user.id!
				}
			},
			create: {
				value: body.value,
				userId: session.user.id!,
				storyId: body.storyId
			},
			update: {
				value: body.value,
				userId: session.user.id!,
				storyId: body.storyId
			},
			select: {
				value: true,
				userId: true,
				storyId: true,
				id: true,
				story: true,
				owner: {
					select: {
						name: true
					}
				}
			}
		});

		if (vote) {
			writeToChannel(`${env}-${vote.story.roomId}`, 'event', {
				type: 'DB',
				action: 'UPDATE',
				success: !!vote
			});
		}
		return new Response(String(JSON.stringify(!!vote)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
