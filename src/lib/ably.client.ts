import Ably from 'ably';
import { PUBLIC_ABLY_SUB_KEY } from '$env/static/public';
import type { RTEvent } from './types';
import { writable, type Writable } from 'svelte/store';

export const PresenceSet: Writable<Ably.Types.PresenceMessage[] | undefined> = writable([]);

let ably: Ably.Realtime | undefined;

export const initAbly = (clientId: string) => {
	ably = new Ably.Realtime({
		key: PUBLIC_ABLY_SUB_KEY,
		clientId,
		recover: (_, cb) => {
			cb(true);
		}
	});
};

export const subscribeToChannel = async (
	channel: string,
	event: string,
	presence = false,
	eventCallback: (eventData: RTEvent) => void
) => {
	if (ably) {
		const eventChannel = ably.channels.get(channel);
		try {
			await eventChannel.subscribe(event, (message) => {
				const eventData: RTEvent = JSON.parse(message.data);
				console.log(
					`${eventData.success ? '✅' : '❌'} ${eventData.type} ${eventData.action} ${
						eventData.success ? 'SUCCESS' : 'FAILED'
					} received from channel ${channel}.`
				);
				eventCallback(eventData);
			});

			if (presence) {
				await eventChannel.presence.subscribe(['enter', 'leave', 'update'], () => {
					eventChannel.presence.get((err, members) => {
						if (members) {
							console.log(members);
							PresenceSet.update(() => {
								return [...new Map(members.map((member) => [member.clientId, member])).values()];
							});
						}
					});
				});
			}
		} catch (error) {
			console.log(`ℹ️ Connection to ${channel} ended.`);
		}
	}
};

export const enterPresenseSet = (channel: string, name: string, image: string) => {
	if (ably) {
		const presenseChannel = ably.channels.get(channel);
		presenseChannel.presence.enter({
			name,
			image
		});
	}
};

export const leavePresenseSet = (channel: string) => {
	if (ably) {
		const presenseChannel = ably.channels.get(channel);
		presenseChannel.presence.leave();
	}
};

export const unsubscribe = (channel: string) => {
	if (ably) {
		const eventChannel = ably.channels.get(channel);
		eventChannel.unsubscribe();
		ably.close();
	}
};
