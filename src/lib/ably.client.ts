import Ably from 'ably';
import { PUBLIC_ABLY_SUB_KEY } from '$env/static/public';
import type { RealTimeData } from '../types';

export const ably = new Ably.Realtime({
	key: PUBLIC_ABLY_SUB_KEY,
	recover: (_, cb) => {
		cb(true);
	}
});

export const subscribeToChannel = async (channel: string, event: string, callback: Function) => {
	const eventChannel = ably.channels.get(channel);
	try {
		await eventChannel.subscribe(event, (message) => {
			const eventData: RealTimeData = JSON.parse(message.data);
			console.log(
				`${eventData.success ? '✅' : '❌'} ${eventData.type} ${eventData.action} ${
					eventData.success ? 'SUCCESS' : 'FAILED'
				} received from channel ${channel}.`
			);
			callback(eventData);
		});
	} catch (error) {
		console.log(`ℹ️ Connection to ${channel} ended.`);
	}
};

export const unsubscribe = (channel: string) => {
	const eventChannel = ably.channels.get(channel);
	eventChannel.unsubscribe();
};
