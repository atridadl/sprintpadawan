import type { RequestHandler } from './$types';
import PrismaClient from '$lib/prisma';

export const GET = (async ({ url }) => {
	const prisma = new PrismaClient();
	const users = await prisma.user.findMany();
	return new Response(String(JSON.stringify(users)));
}) satisfies RequestHandler;
