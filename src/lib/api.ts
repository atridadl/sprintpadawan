import { page } from '$app/stores';

export const getRooms = async () => {
	return await fetch('/api/room');
};

export const getRoomById = async (roomId: string) => {
	return await fetch(`/api/room/${roomId}`, {
		method: 'GET'
	});
};

export const createRoom = async () => {
	await fetch('/api/room', {
		method: 'POST'
	});
};

export const deleteRoom = async (id: string) => {
	await fetch(`/api/room/${id}`, {
		method: 'DELETE',
		headers: {
			'content-type': 'application/json'
		}
	});
};

export const setVote = async (storyId: string, value: string) => {
	await fetch('/api/vote', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			value,
			storyId
		})
	});
};

export const resetStory = async (storyId: string, name: string) => {
	await fetch(`/api/story/${storyId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			visible: false
		})
	});
};

export const updateStoryVisibility = async (storyId: string, visible: boolean) => {
	await fetch(`/api/story/${storyId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			visible
		})
	});
};

export const deleteUser = async () => {
	await fetch('/api/user', {
		method: 'DELETE'
	});
};
