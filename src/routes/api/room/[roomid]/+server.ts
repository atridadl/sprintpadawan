import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { writeToChannel } from '$lib/server/ably.server';
import type { ExtendedSession } from '$lib/types';
import { VERCEL_ENV } from '$env/static/private';

const env = VERCEL_ENV ? VERCEL_ENV : 'local';

export const GET = (async ({ locals, params }) => {
	const session = (await locals.getSession()) as ExtendedSession;

	if (session) {
		if (!params.roomid) {
			throw error(400, 'Room ID not provided!');
		}

		const room = await prisma.room.findUnique({
			where: {
				id: params.roomid
			},
			select: {
				id: true,
				userId: true,
				activeStory: {
					select: {
						_count: true,
						name: true,
						id: true,
						visible: true,
						votes: {
							select: {
								id: true,
								value: true,
								userId: true,
								owner: {
									select: {
										_count: true,
										name: true,
										image: true,
										email: true
									}
								}
							}
						}
					}
				},
				owner: true
			}
		});
		return new Response(String(JSON.stringify(room)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;

export const DELETE = (async ({ locals, params }) => {
	const session = (await locals.getSession()) as ExtendedSession;

	if (session) {
		if (!params.roomid) {
			throw error(400, 'Room ID not provided!');
		}

		const deletedRoom = await prisma.room.delete({
			where: {
				id: params.roomid
			}
		});

		if (deletedRoom) {
			writeToChannel(`${env}-${session.user.id!}`, 'event', {
				type: 'DB',
				action: 'DELETE',
				success: true
			});
		}

		return new Response(String(JSON.stringify({})));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
