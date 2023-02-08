<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { RealTimeData } from '$lib/types';
	import { invalidateAll, goto } from '$app/navigation';
	import { createRoom, deleteRoom } from '$lib/api';

	export let data: PageData;

	$: session = data.session;
	$: rooms = data.rooms;
	$: env = data.env;

	let roomIdInput = '';

	const joinRoom = (roomId: string) => {
		if (roomId.length > 0) {
			goto(`/room/${roomId}`);
		} else {
			const t: ToastSettings = {
				message: 'Please enter a Room ID.',
				preset: 'error',
				autohide: true,
				timeout: 4000
			};

			toastStore.trigger(t);
		}
	};

	const onUserEventHandler = async (eventData: RealTimeData) => {
		let messageString = '';

		if (eventData.action === 'ADD') {
			messageString = eventData.success
				? '🙌🏽 Your room has been created!'
				: 'Uh-oh! Something went wrong!';
		} else if (eventData.action === 'DELETE') {
			messageString = eventData.success
				? '🙌🏽 Your room has been deleted!'
				: 'Uh-oh! Something went wrong!';
		} else {
			messageString = 'Error communicating with event backend.';
		}

		const t: ToastSettings = {
			message: messageString,
			preset: eventData.success ? 'success' : 'error',
			autohide: true,
			timeout: 4000
		};

		toastStore.trigger(t);

		if (eventData.success) {
			invalidateAll();
		}
	};

	onMount(async () => {
		if (session) {
			const { initAbly, subscribeToChannel } = await import('$lib/ably.client');
			initAbly(session.user.id!);
			subscribeToChannel(`${env}-${session.user.id!}`, 'event', true, onUserEventHandler);
		}
	});

	onDestroy(async () => {
		if (session) {
			const { unsubscribe } = await import('$lib/ably.client');
			unsubscribe(`${env}-${session.user.id!}`);
		}
	});
</script>

<div class="container h-full mx-auto flex flex-col justify-center items-center text-center">
	<div>
		{#if session}
			<h1>Hi, {session.user?.name}!</h1>

			<h3>Join a room!</h3>
			<label class="input-label">
				<span>Room ID</span>
				<input
					type="text"
					id="sessionId"
					class="input text-center mb-2"
					bind:value={roomIdInput}
					minlength="2"
					required
				/>
				<button
					on:click={() => joinRoom(roomIdInput)}
					disabled={roomIdInput.length === 0}
					class="btn variant-filled-primary btn-base"
				>
					Join!
				</button>
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
				src="/logo.svg"
				alt="Logo for Sprint Padawan"
			/>

			<h1>
				<span
					class="bg-gradient-to-br from-pink-600 to-pink-400 bg-clip-text text-transparent box-decoration-clone"
					>Plan.</span
				>
				<span
					class="bg-gradient-to-br from-purple-600 to-purple-400 bg-clip-text text-transparent box-decoration-clone"
					>Sprint.</span
				>
				<span
					class="bg-gradient-to-br from-cyan-600 to-cyan-400 bg-clip-text text-transparent box-decoration-clone"
					>Repeat.</span
				>
			</h1>

			<h2 class="my-4">Sprint Padawan helps agile teams do less planning and more building.</h2>
			<button on:click={() => signIn('github')} class="btn variant-ghost-surface btn-base">
				Sign in with Github
			</button>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
