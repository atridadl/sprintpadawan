<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { RealTimeData } from '../../../types';
	import type { PageData } from './$types';

	export let data: PageData;

	$: session = data.session;
	$: room = data.room;
	$: env = data.env;

	const onRoomEventHandler = async (eventData: RealTimeData) => {
		console.log(eventData);
	};

	onMount(async () => {
		if (room) {
			const { subscribeToChannel } = await import('$lib/ably.client');
			subscribeToChannel(`${env}-${room.id!}`, 'event', onRoomEventHandler);
		}
	});

	onDestroy(async () => {
		if (room) {
			const { unsubscribe } = await import('$lib/ably.client');
			unsubscribe(`${env}-${room.id!}`);
		}
	});
</script>

<div class="container h-full mx-auto flex flex-col justify-center items-center text-center">
	<div>
		<h3>Room ID: room.</h3>
		<h4>Welcome, {session.user.id}</h4>
		{#if session.user.id === room.owner.id}
			<div>
				Admin Controls:
				<button class="btn variant-filled-primary btn-base">New Story</button>
				<button class="btn variant-filled-primary btn-base">Begin Polling</button>
				<button class="btn variant-filled-primary btn-base">Stop Polling</button>
				<button class="btn variant-filled-primary btn-base">Reveal Answers</button>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
