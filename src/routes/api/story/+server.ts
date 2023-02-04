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
		const story = await prisma.story.findFirst({
			where: {
				userId: session.user.id!
			}
		});
		return new Response(String(JSON.stringify(story)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;

export const POST = (async ({ locals, request }) => {
	const session = (await locals.getSession()) as ExtendedSession;
	const body = await request.json();

	if (session) {
		if (!body.name) {
			throw error(400, 'Story name not provided!');
		}

		if (!body.roomId) {
			throw error(400, 'Room ID not provided!');
		}

		const story = await prisma.story.upsert({
			where: {
				roomId: body.roomId
			},
			create: {
				name: body.name,
				userId: session.user.id!,
				roomId: body.roomId
			},
			update: {
				name: body.name,
				userId: session.user.id!,
				roomId: body.roomId
			}
		});

		await prisma.vote.deleteMany({
			where: {
				storyId: story.id
			}
		});

		if (story) {
			writeToChannel(`${env}-${body.roomId}`, 'event', {
				type: 'DB',
				action: 'UPDATE',
				success: !!story
			});
		}
		return new Response(String(JSON.stringify(!!story)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
