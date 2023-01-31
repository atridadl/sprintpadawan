<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: session = data.session;
	$: rooms = data.rooms;

	let roomId = '';

	onMount(async () => {
		const { subscribeToChannel } = await import('$lib/ably.client');
		subscribeToChannel('sprintpadawan', 'event', invalidateAll);
		// const channel = pusher.subscribe('sprintpadawan');
		// channel.bind('event', function (data: any) {
		// 	console.log(data);
		// 	if (data.message === 'DB_UPDATE') {
		// 		invalidateAll();
		// 	}
		// });
	});

	onDestroy(async () => {
		const { unsubscribe } = await import('$lib/ably.client');
		unsubscribe();
	});

	const createRoom = async () => {
		await fetch('/api/room', {
			method: 'POST'
		});
	};
</script>

<div class="container h-full mx-auto flex flex-col justify-center items-center text-center">
	<div>
		{#if session}
			<h1>Hi, {session.user?.name}!</h1>

			<h3>Join a room!</h3>
			<label class="input-label">
				<span>Room ID</span>
				<input type="text" id="sessionId" bind:value={roomId} minlength="2" required />
				<button class="btn variant-filled-primary btn-base"> Join! </button>
			</label>

			<h3>Create a new room!</h3>
			<button class="btn variant-filled-primary btn-base" on:click={createRoom}> New Room </button>

			<div class="table-container mt-4">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Room ID</th>
						</tr>
					</thead>
					<tbody>
						{#each rooms as room}
							<tr>
								<td>{room.id}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<h3>Please sign in above using your GitHub account!</h3>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
