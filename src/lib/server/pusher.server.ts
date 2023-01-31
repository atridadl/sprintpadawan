import Pusher from 'pusher';
import { PUBLIC_PUSHER_SUB_KEY } from '$env/static/public';
import { PUSHER_PUB_KEY, PUSHER_APP_ID } from '$env/static/private';

export const pusher = new Pusher({
	appId: PUSHER_APP_ID,
	cluster: 'us3',
	key: PUBLIC_PUSHER_SUB_KEY,
	secret: PUSHER_PUB_KEY,
	useTLS: true
});

export const pushToChannel = (channel: string, event: string, message: string) => {
	pusher.trigger(channel, event, {
		message: message
	});
};
