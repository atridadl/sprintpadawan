import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import type { ExtendedSession } from '../types';

export const load: PageServerLoad = (async ({ fetch, locals }) => {
	const session = (await locals.getSession()) as ExtendedSession;
	const rooms = await prisma.room.findMany({
		where: {
			userId: session?.user.id!
		}
	});

	return {
		session,
		rooms
	};
}) satisfies PageServerLoad;
