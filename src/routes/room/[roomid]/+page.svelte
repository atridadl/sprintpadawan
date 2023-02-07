<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { RealTimeData } from '$lib/types';
	import type { PageData } from './$types';
	import { Avatar, SlideToggle, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	import { PresenceSet } from '$lib/ably.client';

	export let data: PageData;

	$: session = data.session;
	$: room = data.room;
	$: vote = data.vote;
	$: env = data.env;

	// Local form data
	let resultsVisible: boolean = false;
	let storyTextBox: string = '';

	const setVote = async (storyId: string, value: string) => {
		await fetch('/api/vote', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				value,
				storyId
			})
		});
	};

	const updateStory = async (roomId: string, name: string) => {
		await fetch('/api/story', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name,
				roomId
			})
		});
	};

	const updateRoom = async (id: string, visible?: boolean) => {
		await fetch(`/api/room/${id}`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				visible
			})
		});
	};

	const onRoomEventHandler = async (eventData: RealTimeData) => {
		let messageString = '';

		if (eventData.action === 'ADD') {
			messageString = eventData.success
				? '🙌🏽 Your story has been created!'
				: 'Uh-oh! Something went wrong!';
		} else if (eventData.action === 'DELETE') {
			messageString = eventData.success
				? '🙌🏽 Your story has been deleted!'
				: 'Uh-oh! Something went wrong!';
		} else if (eventData.action === 'UPDATE') {
			messageString = eventData.success ? '🙌🏽 Room updated!' : 'Uh-oh! Something went wrong!';
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
			await invalidateAll();
			storyTextBox = room.activeStory.name;
			resultsVisible = room.visible;
		}
	};

	onMount(async () => {
		if (room) {
			const { initAbly, subscribeToChannel, enterPresenseSet } = await import('$lib/ably.client');
			initAbly(session.user.id!);
			subscribeToChannel(`${env}-${room.id!}`, 'event', true, onRoomEventHandler);
			storyTextBox = room.activeStory.name;
			resultsVisible = room.visible;
			enterPresenseSet(`${env}-${room.id!}`, session.user.name!, session.user.image!);
			PresenceSet.subscribe((item) => {});
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
		<div
			class="card variant-glass-tertiary p-4 m-4 flex flex-col justify-center items-center text-center"
		>
			<h3>Current Story: {room.activeStory.name}</h3>

			{#if room.activeStory.votes.length === 0}
				<p>Waiting for votes...</p>
			{/if}

			<ul class="list">
				{#if $PresenceSet}
					{#each $PresenceSet as presenceItem}
						<li>
							<Avatar src={presenceItem.data.image} />
							<span class="flex-auto">
								{presenceItem.data.name}:
								{#if !room.activeStory.votes.find((v) => v.userId == presenceItem.clientId)}
									-
								{:else if vote}
									{#if room.visible || vote.userId === presenceItem.clientId}
										{room.activeStory.votes.find((v) => v.userId == presenceItem.clientId).value}
									{:else}
										???
									{/if}
								{:else}
									???
								{/if}
							</span>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
		<div class="card variant-glass-tertiary p-4 m-4 flex justify-center items-center space-x-4">
			<p>Vote:</p>

			<button
				on:click={() => {
					setVote(room.activeStory.id, '0.5');
				}}
				class="btn-icon">0.5</button
			>
			<button
				on:click={() => {
					setVote(room.activeStory.id, '1');
				}}
				class="btn-icon">1</button
			>
			<button
				on:click={() => {
					setVote(room.activeStory.id, '2');
				}}
				class="btn-icon">2</button
			>
			<button
				on:click={() => {
					setVote(room.activeStory.id, '3');
				}}
				class="btn-icon">3</button
			>
			<button
				on:click={() => {
					setVote(room.activeStory.id, '5');
				}}
				class="btn-icon">5</button
			>
			<button
				on:click={() => {
					setVote(room.activeStory.id, '99+');
				}}
				class="btn-icon">99+</button
			>
		</div>

		{#if session.user.id === room.owner.id}
			<div
				class="card variant-glass-tertiary p-4 m-4 flex flex-auto justify-center items-center space-x-4"
			>
				<button
					on:click={() => updateStory(room.id, storyTextBox)}
					class="btn variant-filled-secondary btn-base">Reset Story</button
				>
				<input type="text" id="story" class="text-center" bind:value={storyTextBox} required />
				<SlideToggle
					on:change={() => {
						updateRoom(room.id, resultsVisible);
					}}
					class="my-auto"
					bind:checked={resultsVisible}>{resultsVisible ? 'Hide' : 'Show'}</SlideToggle
				>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
