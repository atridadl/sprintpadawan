import Ably from 'ably';
import { PUBLIC_ABLY_SUB_KEY } from '$env/static/public';

const ably = new Ably.Realtime.Promise(PUBLIC_ABLY_SUB_KEY);

export const subscribeToChannel = async (channel: string, event: string, callback: Function) => {
	const eventChannel = ably.channels.get(channel);
	await eventChannel.subscribe(event, (message) => {
		console.log(`${event} received from channel ${channel}: ` + message.data);
		callback();
	});
};

export const unsubscribe = () => {
	ably.close();
};
