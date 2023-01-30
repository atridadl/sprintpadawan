import Pusher from 'pusher-js';
import { PUBLIC_PUSHER_SUB_KEY } from '$env/static/public';

export const pusher = new Pusher(PUBLIC_PUSHER_SUB_KEY, {
	cluster: 'us3'
});

export const unsubFromPusher = (channel: string) => {
	pusher.unsubscribe(channel);
};
