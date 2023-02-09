import Ably from 'ably';
import { ABLY_PUB_KEY } from '$env/static/private';
import type { RTEvent } from '../types';
const ably = new Ably.Realtime(ABLY_PUB_KEY);

export const writeToChannel = async (channel: string, event: string, data: RTEvent) => {
	const eventChannel = ably.channels.get(channel);
	await eventChannel.publish(event, JSON.stringify(data));
};
