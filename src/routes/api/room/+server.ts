import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { writeToChannel } from '$lib/server/ably.server';
import type { ExtendedSession } from '$lib/types';
import { VERCEL_ENV } from '$env/static/private';

const env = VERCEL_ENV ? VERCEL_ENV : 'local';

export const GET = (async ({ locals }) => {
	const session = (await locals.getSession()) as ExtendedSession;

	if (session) {
		const room = await prisma.room.findMany({
			where: {
				userId: session.user.id!
			}
		});
		return new Response(String(JSON.stringify(room)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;

export const POST = (async ({ locals }) => {
	const session = (await locals.getSession()) as ExtendedSession;

	if (session) {
		const room = await prisma.room.create({
			data: {
				userId: session.user.id!
			}
		});
		if (room) {
			const story = await prisma.story.create({
				data: {
					name: 'First Story!',
					userId: session.user.id!,
					roomId: room.id,
					visible: false
				}
			});

			writeToChannel(`${env}-${session.user.id!}`, 'event', {
				type: 'DB',
				action: 'ADD',
				success: true
			});
		}
		return new Response(String(JSON.stringify(!!room)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
