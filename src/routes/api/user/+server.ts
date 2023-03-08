import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { ExtendedSession } from '$lib/types';
import { VERCEL_ENV } from '$env/static/private';

const env = VERCEL_ENV ? VERCEL_ENV : 'local';

export const DELETE = (async ({ locals }) => {
	const session = (await locals.getSession()) as ExtendedSession;

	if (session) {
		const user = await prisma.user.delete({
			where: {
				id: session.user.id
			}
		});
		return new Response(String(JSON.stringify(user)));
	}
	throw error(403, 'Not signed in!');
}) satisfies RequestHandler;
