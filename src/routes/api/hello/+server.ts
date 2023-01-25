import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET = (async ({ url }) => {
	const users = await prisma.user.findMany();
	return new Response(String(JSON.stringify(users)));
}) satisfies RequestHandler;
