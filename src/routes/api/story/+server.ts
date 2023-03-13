import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { ExtendedSession } from '$lib/types';

export const GET = (async ({ locals }) => {
	const session = (await locals.getSession()) as ExtendedSession;

	if (session) {
		const story = await prisma.story.findFirst({
			where: {
				userId: session.user.id
			}
		});
		return new Response(String(JSON.stringify(story)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
