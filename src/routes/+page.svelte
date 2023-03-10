<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { signIn } from '@auth/sveltekit/client';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { RTEvent } from '$lib/types';
	import { invalidateAll, goto } from '$app/navigation';
	import { createRoom, deleteRoom } from '$lib/api';
	import Fa from 'svelte-fa';
	import { faCirclePlay, faTrashCan } from '@fortawesome/free-regular-svg-icons';

	export let data: PageData;

	$: session = data.session;
	$: rooms = data.rooms;
	$: env = data.env;

	let roomIdInput = '';
	let pageLoading = false;

	const joinRoom = async (roomId: string) => {
		if (roomId.length > 0) {
			pageLoading = true;
			await goto(`/room/${roomId}`).then(() => {
				pageLoading = false;
			});
		}
	};

	const onUserEventHandler = async (eventData: RTEvent) => {
		if (eventData.success) {
			invalidateAll();
		}
	};

	onMount(async () => {
		if (session) {
			const { initAbly, subscribeToChannel } = await import('$lib/ably.client');
			initAbly(session.user.id);
			subscribeToChannel(`${env}-${session.user.id}`, 'event', true, onUserEventHandler);
		}
	});

	onDestroy(async () => {
		if (session) {
			const { unsubscribe } = await import('$lib/ably.client');
			unsubscribe(`${env}-${session.user.id}`);
		}
	});
</script>

<div class="container h-full mx-auto flex flex-col justify-center items-center text-center">
	{#if pageLoading}
		<ProgressRadial
			stroke={150}
			width={'w-10'}
			meter="stroke-primary-500"
			track="stroke-primary-500/30"
		/>
	{:else}
		<div>
			{#if session}
				<h1>Hi, {session.user.name}!</h1>

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
				<button class="btn variant-filled-primary btn-base" on:click={createRoom}>
					New Room
				</button>

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
										<td class="flex flex-row justify-center items-center text-center gap-2">
											<button on:click={() => joinRoom(room.id)}>
												<Fa class="text-xl mx-1 hover:text-pink-500" icon={faCirclePlay} />
											</button>

											<button on:click={() => deleteRoom(room.id)}>
												<Fa class="text-xl mx-1 hover:text-pink-500" icon={faTrashCan} />
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
	{/if}
</div>

<style lang="postcss">
</style>
