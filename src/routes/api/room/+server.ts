import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { writeToChannel } from '$lib/server/ably.server';
import type { ExtendedSession } from '../../../types';

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
			writeToChannel(session.user.id!, 'event', 'DB_UPDATE');
		}
		return new Response(String(JSON.stringify(room)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;

export const DELETE = (async ({ locals, request }) => {
	const session = (await locals.getSession()) as ExtendedSession;

	if (session) {
		const body = await request.json();

		if (!body.id) {
			throw error(400, 'Room ID not provided!');
		}

		const deletedRoom = await prisma.room.delete({
			where: {
				id: body.id
			}
		});

		if (deletedRoom) {
			writeToChannel(session.user.id!, 'event', 'DB_UPDATE');
		}

		return new Response(String(JSON.stringify({})));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
