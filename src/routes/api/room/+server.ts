import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { writeToChannel } from '$lib/server/ably.server';

let cookieName =
	process.env.NODE_ENV === 'production'
		? '__Secure-next-auth.session-token'
		: 'next-auth.session-token';

export const POST = (async ({ cookies }) => {
	const currentCookie = cookies.get(cookieName);
	const session = await prisma.session.findUnique({
		where: {
			sessionToken: currentCookie
		}
	});
	if (session) {
		const room = await prisma.room.create({
			data: {
				userId: session.userId
			}
		});
		if (room) {
			writeToChannel(session.userId, 'event', 'DB_UPDATE');
		}
		return new Response(String(JSON.stringify(room)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;

export const DELETE = (async ({ cookies, request }) => {
	const currentCookie = cookies.get(cookieName);
	const session = await prisma.session.findUnique({
		where: {
			sessionToken: currentCookie
		}
	});
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
			writeToChannel(session.userId, 'event', 'DB_UPDATE');
		}

		return new Response(String(JSON.stringify({})));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
