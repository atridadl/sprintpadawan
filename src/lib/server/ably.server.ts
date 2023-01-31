import Ably from 'ably';
import { ABLY_PUB_KEY } from '$env/static/private';
const ably = new Ably.Realtime.Promise(ABLY_PUB_KEY);

export const writeToChannel = async (channel: string, event: string, message: string) => {
	const eventChannel = ably.channels.get(channel);
	await eventChannel.publish(event, message);
};
