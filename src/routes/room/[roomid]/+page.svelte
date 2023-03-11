<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { RTEvent } from '$lib/types';
	import type { PageData } from './$types';
	import {
		Avatar,
		clipboard,
		ProgressRadial,
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
	let storyTextBox: string = '';

	const shareRoomUrlHandler = () => {
		navigator
			.share({
				url: window.location.href,
				text: 'Join my Sprint Padawan room!',
				title: 'Sprint Padawan'
			})
			.then(() => {
				console.log('Room Shared!');
			})
			.catch(() => {
				console.log('Room Share Cancelled');
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
		}
	};

	onMount(async () => {
		if (room && session) {
			const { initAbly, subscribeToChannel, enterPresenseSet } = await import('$lib/ably.client');
			initAbly(session.user.id);
			subscribeToChannel(`${env}-${room.id}`, 'event', true, onRoomEventHandler);
			storyTextBox = room.activeStory.name;
			enterPresenseSet(`${env}-${room.id}`, session.user.name, session.user.image);
			PresenceSet.subscribe((item) => {});
		}
	});

	onDestroy(async () => {
		if (room) {
			const { unsubscribe } = await import('$lib/ably.client');
			unsubscribe(`${env}-${room.id}`);
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
			{#if $PresenceSet && $PresenceSet.length > 0}
				<h3>Current Story: {room.activeStory.name}</h3>

				<ul class="list">
					{#each $PresenceSet as presenceItem}
						<li>
							<Avatar src={presenceItem.data.image} />
							<span class="flex-auto">
								{presenceItem.data.name}:
								{#if room.activeStory.visible}
									{#if room.activeStory.votes.find((vote) => vote.userId == presenceItem.clientId)}
										{room.activeStory.votes.find((vote) => vote.userId == presenceItem.clientId)
											.value}
									{:else}
										<Icon class="text-2xl mx-1 inline-block" icon="tabler:error-404" />
									{/if}
								{:else if room.activeStory.votes.find((vote) => vote.userId == presenceItem.clientId)}
									<Icon
										class="text-2xl mx-1 inline-block"
										icon="material-symbols:check-circle-outline"
									/>
								{:else}
									<Icon
										class="text-2xl mx-1 inline-block animate-spin"
										icon="ic:round-hourglass-empty"
									/>
								{/if}
							</span>
						</li>
					{/each}
				</ul>

				<span class="h-1 w-full bg-cyan-200 rounded my-4" />

				<div class="flex gap-4 flex-wrap items-center justify-center">
					<button
						on:click={() => {
							setVote(room.activeStory.id, '0.5');
						}}
						class={!vote
							? 'btn-icon variant-ghost-tertiary'
							: vote.value === '0.5'
							? 'btn-icon variant-ghost-primary'
							: 'btn-icon variant-ghost-tertiary'}>0.5</button
					>
					<button
						on:click={() => {
							setVote(room.activeStory.id, '1');
						}}
						class={!vote
							? 'btn-icon variant-ghost-tertiary'
							: vote.value === '1'
							? 'btn-icon variant-ghost-primary'
							: 'btn-icon variant-ghost-tertiary'}>1</button
					>
					<button
						on:click={() => {
							setVote(room.activeStory.id, '2');
						}}
						class={!vote
							? 'btn-icon variant-ghost-tertiary'
							: vote.value === '2'
							? 'btn-icon variant-ghost-primary'
							: 'btn-icon variant-ghost-tertiary'}>2</button
					>
					<button
						on:click={() => {
							setVote(room.activeStory.id, '3');
						}}
						class={!vote
							? 'btn-icon variant-ghost-tertiary'
							: vote.value === '3'
							? 'btn-icon variant-ghost-primary'
							: 'btn-icon variant-ghost-tertiary'}>3</button
					>
					<button
						on:click={() => {
							setVote(room.activeStory.id, '5');
						}}
						class={!vote
							? 'btn-icon variant-ghost-tertiary'
							: vote.value === '5'
							? 'btn-icon variant-ghost-primary'
							: 'btn-icon variant-ghost-tertiary'}>5</button
					>
					<button
						on:click={() => {
							setVote(room.activeStory.id, '99+');
						}}
						class={!vote
							? 'btn-icon variant-ghost-tertiary'
							: vote.value === '99+'
							? 'btn-icon variant-ghost-primary'
							: 'btn-icon variant-ghost-tertiary'}>99+</button
					>
				</div>
			{:else}
				<ProgressRadial
					stroke={150}
					width={'w-10'}
					meter="stroke-primary-500"
					track="stroke-primary-500/30"
				/>
			{/if}
		</div>

		{#if session.user.id === room.owner.id}
			<div
				class="card variant-glass-tertiary p-4 m-4 flex flex-auto text-center justify-center items-center space-x-4 flex-wrap"
			>
				<input
					type="text"
					id="story"
					class="input text-center m-2"
					bind:value={storyTextBox}
					required
				/>
				<button
					on:click={() => {
						updateStoryVisibility(room.activeStory.id, !room.activeStory.visible);
					}}
					class="btn variant-filled-secondary m-2"
				>
					{#if room.activeStory.visible}
						<Icon class="text-xl mr-2" icon="ph:eye" />
						Visible
					{:else}
						<Icon class="text-xl mr-2" icon="ph:eye-closed" />
						Hidden
					{/if}
				</button>

				<button
					on:click={() => resetStory(room.activeStory.id, storyTextBox)}
					class="btn variant-filled-secondary m-2"
				>
					{#if storyTextBox === room.activeStory.name}
						<Icon class="text-xl mr-2" icon="fa:bomb" />
						Reset Votes
					{:else}
						<Icon class="text-xl mr-2" icon="fluent:save-multiple-24-regular" />
						Save Story
					{/if}
				</button>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
