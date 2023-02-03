<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { RealTimeData } from '../../../types';
	import type { PageData } from './$types';
	import { writable, type Writable } from 'svelte/store';
	import { RadioGroup, RadioItem, SlideToggle } from '@skeletonlabs/skeleton';

	export let data: PageData;

	// Local form data
	const voteStore: Writable<number> = writable(0);
	let resultsVisible: boolean = false;
	let polling: boolean = false;

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
		<h4>Room ID: {room.id}</h4>

		{#if session.user.id === room.owner.id}
			<div class="card variant-glass-tertiary p-4 m-4 flex justify-center items-center space-x-4">
				<p>Vote:</p>
				<RadioGroup selected={voteStore}>
					<RadioItem value={0}>0.5</RadioItem>
					<RadioItem value={1}>1</RadioItem>
					<RadioItem value={2}>2</RadioItem>
					<RadioItem value={3}>3</RadioItem>
					<RadioItem value={5}>5</RadioItem>
					<RadioItem value={99}>99</RadioItem>
				</RadioGroup>
			</div>

			<div class="card variant-glass-tertiary p-4 m-4 flex justify-center items-center space-x-4">
				<p>Admin Controls:</p>
				<button class="btn variant-filled-secondary btn-base">Set Story</button>
				<SlideToggle class="my-auto" bind:checked={polling}>Polling</SlideToggle>
				<SlideToggle bind:checked={resultsVisible}>Show Results</SlideToggle>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
