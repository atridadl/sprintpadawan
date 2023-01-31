<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;

	const subscribeToRooms = async () => {
		const { subscribeToChannel } = await import('$lib/ably.client');
		const { invalidateAll } = await import('$app/navigation');
		subscribeToChannel(session.user.id!, 'event', invalidateAll);
	};

	const createRoom = async () => {
		await fetch('/api/room', {
			method: 'POST'
		});
	};

	const deleteRoom = async (id: string) => {
		await fetch('/api/room', {
			method: 'DELETE',
			body: JSON.stringify({
				id
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
	};

	$: session = data.session;
	$: rooms = data.rooms;

	let roomId = '';

	onMount(async () => {
		if (session) {
			subscribeToRooms();
		}
	});

	onDestroy(async () => {
		const { unsubscribe } = await import('$lib/ably.client');
		unsubscribe();
	});
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

			{#if rooms.length > 0}
				<div class="table-container mt-4">
					<table class="table table-hover">
						<thead>
							<tr>
								<th>Room ID</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each rooms as room}
								<tr>
									<td>{room.id}</td>
									<td>
										<button on:click={() => deleteRoom(room.id)}>
											<Icon icon="fa6-regular:trash-can" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		{:else}
			<img
				class="my-4 mx-auto"
				width="200px"
				height="200px"
				src="/logo.webp"
				alt="Logo for Sprint Padawan"
			/>
			<h1 class="my-4">
				<span class="text-pink-600 hover:drop-shadow-lg">Plan.</span>
				<span class="text-purple-600 hover:drop-shadow-lg">Sprint.</span>
				<span class="text-cyan-400 hover:drop-shadow-lg">Repeat.</span>
			</h1>

			<h2 class="my-4">Sprint Padawan helps agile teams do less planning and more building.</h2>
			<h3 class="my-4">Please sign in above using your GitHub account!</h3>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
