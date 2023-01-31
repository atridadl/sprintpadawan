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
			writeToChannel('sprintpadawan', 'event', 'DB_UPDATE');
		}
		return new Response(String(JSON.stringify(room)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
