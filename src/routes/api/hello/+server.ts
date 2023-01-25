import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (({ url }) => {
	return new Response(String('Hello world!'));
}) satisfies RequestHandler;
