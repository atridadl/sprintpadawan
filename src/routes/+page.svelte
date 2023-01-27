<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import * as Ably from 'ably';
	import { PUBLIC_ABLY_KEY } from '$env/static/public';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	$: users = data.data;

	onMount(async () => {
		const ably = new Ably.Realtime.Promise(PUBLIC_ABLY_KEY);
		const channel = ably.channels.get('sprintpadawan');

		await channel.subscribe('event', (message) => {
			console.log('Event Received: ' + message.data);

			switch (message.data) {
				case 'DB_FETCH':
					invalidateAll();
					break;

				default:
					break;
			}
		});
	});

	onDestroy(() => {
		const ably = new Ably.Realtime.Promise(PUBLIC_ABLY_KEY);

		ably.close();
	});

	const postMessage = async () => {
		const channel = ably.channels.get('sprintpadawan');
		await channel.publish('event', 'DB_FETCH');
	};
</script>

<div class="container h-full mx-auto flex flex-col justify-center items-center text-center">
	<div>
		{#if users}
			{#each users as user}
				{user.name}
				<br />
			{/each}
		{/if}
	</div>

	<div>
		<button class="btn variant-filled-primary btn-base" on:click={postMessage}>Event Fire</button>
	</div>
</div>

<style lang="postcss">
</style>
