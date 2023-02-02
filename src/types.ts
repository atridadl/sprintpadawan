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
	type: 'DB' | 'ROOM';
	action: 'UPDATE' | 'ADD' | 'DELETE';
	success: true;
	data?: string;
}

export interface ExtendedRoom {
	id: string;
	userId: string;
	owner: {
		id: string;
		email: string | null;
		image: string | null;
		name: string | null;
	};
}
