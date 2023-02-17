<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { RTEvent } from '$lib/types';
	import type { PageData } from './$types';
	import {
		Avatar,
		SlideToggle,
		clipboard,
		toastStore,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	import { PresenceSet } from '$lib/ably.client';
	import { resetStory, setVote, updateStoryVisibility } from '$lib/api';
	import Icon from '@iconify/svelte';

	export let data: PageData;

	$: session = data.session;
	$: room = data.room;
	$: vote = data.vote;
	$: env = data.env;

	// Local form data
	let resultsVisible: boolean = false;
	let storyTextBox: string = '';

	const shareRoomUrlHandler = () => {
		navigator.share({
			url: window.location.href,
			text: 'Join my Sprint Padawan room!',
			title: 'Sprint Padawan'
		});
	};

	const copyRoomUrlHandler = () => {
		const t: ToastSettings = {
			message: 'Room URL Copied',
			preset: 'success',
			autohide: true,
			timeout: 2000
		};

		toastStore.trigger(t);
	};

	const onRoomEventHandler = async (eventData: RTEvent) => {
		if (eventData.success) {
			await invalidateAll();
			storyTextBox = room.activeStory.name;
			resultsVisible = room.activeStory.visible;
		}
	};

	onMount(async () => {
		if (room) {
			const { initAbly, subscribeToChannel, enterPresenseSet } = await import('$lib/ably.client');
			initAbly(session.user.id!);
			subscribeToChannel(`${env}-${room.id!}`, 'event', true, onRoomEventHandler);
			storyTextBox = room.activeStory.name;
			resultsVisible = room.activeStory.visible;
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

<div
	class="container h-full mx-auto flex flex-col justify-center items-center text-center flex-wrap"
>
	<div>
		<h4>
			Room ID: {room.id}
			<button on:click={copyRoomUrlHandler} use:clipboard={window.location.href}>
				<Icon
					class="text-lg mx-1 hover:text-pink-500"
					icon="material-symbols:content-copy-outline"
				/>
			</button>

			<button on:click={shareRoomUrlHandler}>
				<Icon class="text-lg mx-1 hover:text-pink-500" icon="material-symbols:ios-share" />
			</button>
		</h4>
		<div
			class="card variant-glass-tertiary p-4 m-4 flex flex-col justify-center items-center text-center flex-wrap break-words"
		>
			<h3>Current Story: {room.activeStory.name}</h3>

			<p>Your Vote: {vote ? vote.value : '-'}</p>

			<ul class="list">
				{#if $PresenceSet}
					{#each $PresenceSet as presenceItem}
						<li>
							<Avatar src={presenceItem.data.image} />
							<span class="flex-auto">
								{presenceItem.data.name}:
								{#if room.activeStory.visible}
									{#if room.activeStory.votes.find((v) => v.userId == presenceItem.clientId)}
										{room.activeStory.votes.find((v) => v.userId == presenceItem.clientId).value}
									{:else}
										-
									{/if}
								{:else if room.activeStory.votes.find((v) => v.userId == presenceItem.clientId)}
									???
								{:else}
									-
								{/if}
							</span>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
		<div
			class="card variant-glass-tertiary p-4 m-4 flex justify-center items-center space-x-4 flex-wrap"
		>
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
				class="card variant-glass-tertiary p-4 m-4 flex flex-auto justify-center items-center space-x-4 flex-wrap"
			>
				<button
					on:click={() => resetStory(room.activeStory.id, storyTextBox)}
					class="btn variant-filled-secondary btn-base m-2">Reset Story</button
				>
				<input
					type="text"
					id="story"
					class="input text-center m-2"
					bind:value={storyTextBox}
					required
				/>
				<SlideToggle
					on:change={() => {
						updateStoryVisibility(room.activeStory.id, resultsVisible);
					}}
					class="my-auto m-2"
					name="toggle-visbility"
					bind:checked={resultsVisible}>{resultsVisible ? 'Hide' : 'Show'}</SlideToggle
				>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
