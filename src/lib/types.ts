export interface ExtendedSession {
	expires: string;
	user: {
		id: string | null | undefined;
		email: string | null | undefined;
		image: string | null | undefined;
		name: string | null | undefined;
	};
}

export interface RTEvent {
	type: 'ROOM' | 'STORY' | 'VOTE';
	action: 'UPDATE' | 'ADD' | 'DELETE';
	success: boolean;
	data?: string;
}
