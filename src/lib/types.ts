export interface ExtendedSession {
	expires: string;
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
