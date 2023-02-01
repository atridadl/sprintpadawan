import Ably from 'ably';
import { PUBLIC_ABLY_SUB_KEY } from '$env/static/public';
import type { RealTimeData } from '../types';

export const ably = new Ably.Realtime.Promise(PUBLIC_ABLY_SUB_KEY);

export const subscribeToChannel = async (channel: string, event: string, callback: Function) => {
	const eventChannel = ably.channels.get(channel);
	await eventChannel.subscribe(event, (message) => {
		const eventData: RealTimeData = JSON.parse(message.data);
		console.log(
			`${eventData.success ? '✅' : '❌'} ${eventData.type} ${eventData.action} ${
				eventData.success ? 'SUCCESS' : 'FAILED'
			} received from channel ${channel}.`
		);
		callback(eventData);
	});
};

export const unsubscribe = () => {
	ably.close();
};
