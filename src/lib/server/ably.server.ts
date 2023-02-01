import Ably from 'ably';
import { ABLY_PUB_KEY } from '$env/static/private';
import type { RealTimeData } from '../../types';
const ably = new Ably.Realtime.Promise(ABLY_PUB_KEY);

export const writeToChannel = async (channel: string, event: string, data: RealTimeData) => {
	const eventChannel = ably.channels.get(channel);
	await eventChannel.publish(event, JSON.stringify(data));
};
