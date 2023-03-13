import type { Session } from '@auth/core/types';
import { Prisma } from '@prisma/client';

// Prisma validators
const extendedRoom = Prisma.validator<Prisma.RoomArgs>()({
	include: {
		activeStory: {
			include: {
				_count: true,
				votes: {
					include: {
						owner: true
					}
				}
			}
		},
		owner: true
	}
});

const extendedVote = Prisma.validator<Prisma.VoteArgs>()({
	include: {
		story: true,
		owner: true
	}
});

// Extended Types
export type ExtendedRoom = Prisma.RoomGetPayload<typeof extendedRoom>;
export type ExtendedVote = Prisma.RoomGetPayload<typeof extendedVote>;

export interface ExtendedSession extends Session {
	user: {
		id: string;
		email: string;
		image: string;
		name: string;
	};
}

export interface RTEvent {
	type: 'ROOM' | 'STORY' | 'VOTE';
	action: 'UPDATE' | 'ADD' | 'DELETE';
	success: boolean;
	data?: string;
}
