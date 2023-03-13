import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import prisma from '$lib/server/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { ExtendedSession } from '$lib/types';

async function authorization({ event, resolve }: any) {
	if (event.url.pathname.startsWith('/room')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/');
		}
	}

	// If the request is still here, just proceed as normally
	const result = await resolve(event, {
		transformPageChunk: ({ html }: any) => html
	});
	return result;
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(
	SvelteKitAuth({
		providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
		adapter: PrismaAdapter(prisma),
		callbacks: {
			session({ session, user }) {
				if (session.user && session.user.email && session.user.name && session.user.image) {
					const extendedSession: ExtendedSession = {
						expires: session.expires,
						user: {
							id: user.id,
							email: session.user.email,
							image: session.user.image,
							name: session.user.name
						}
					};
					return extendedSession;
				}
				return session;
			}
		}
	}),
	authorization
);
