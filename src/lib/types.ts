import type { Story, User, Vote } from '@prisma/client';

export interface ExtendedSession {
	expires: string;
	user: {
		id: string | null | undefined;
		email: string | null | undefined;
		image: string | null | undefined;
		name: string | null | undefined;
	};
}

export interface RealTimeData {
	type: 'DB';
	action: 'UPDATE' | 'ADD' | 'DELETE';
	success: true;
	data?: string;
}
