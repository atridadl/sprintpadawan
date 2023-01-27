import Pusher from 'pusher-js';
import { PUBLIC_PUSHER_SUB_KEY } from '$env/static/public';

export const pusher = new Pusher('9a38bdc04658a111ed39', {
	cluster: 'us3'
});

export const unsubFromPusher = (channel: string) => {
	pusher.unsubscribe(channel);
};
