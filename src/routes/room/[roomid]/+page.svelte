<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { RTEvent } from '$lib/types';
	import type { PageData } from './$types';
	import { Avatar, clipboard, ProgressRadial } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	import { PresenceSet } from '$lib/ably.client';
	import { resetStory, setVote, updateStoryVisibility } from '$lib/api';
	import type { Vote } from '@prisma/client';
	import type { Types } from 'ably';
	import Fa from 'svelte-fa';
	import {
		faCheckCircle,
		faCopy,
		faHourglass,
		faShareSquare,
		faEye,
		faEyeSlash,
		faSave
	} from '@fortawesome/free-regular-svg-icons';
	import { faBomb, faSkull } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;

	$: session = data.session;
	$: room = data.room;
	$: vote = data.vote;
	$: env = data.env;

	// Local form data
	let storyTextBox = '';

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

	const onRoomEventHandler = async (eventData: RTEvent) => {
		if (eventData.success && room.activeStory) {
			await invalidateAll();
			storyTextBox = room.activeStory.name;
		}
	};

	const findVoteForCurrentUser = (votes: Vote[], presenceItem: Types.PresenceMessage) => {
		return votes.find((vote: Vote) => vote.userId == presenceItem.clientId);
	};

	onMount(async () => {
		if (room && session && room.activeStory) {
			const { initAbly, subscribeToChannel, enterPresenseSet } = await import('$lib/ably.client');
			initAbly(session.user.id);
			subscribeToChannel(`${env}-${room.id}`, 'event', true, onRoomEventHandler);
			storyTextBox = room.activeStory.name;
			enterPresenseSet(`${env}-${room.id}`, session.user.name, session.user.image);
			PresenceSet.subscribe((item) => {
				console.log(`Subscribed!: ${item}`);
			});
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
	{#if room.activeStory != null || room.activeStory != undefined}
		<div>
			<h4>
				Room ID: {room.id}
				<button use:clipboard={window.location.href}>
					<Fa class="text-lg mx-1 hover:text-pink-500" icon={faCopy} />
				</button>

				<button on:click={shareRoomUrlHandler}>
					<Fa class="text-lg mx-1 hover:text-pink-500" icon={faShareSquare} />
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
										{#if findVoteForCurrentUser(room.activeStory.votes, presenceItem)}
											{findVoteForCurrentUser(room.activeStory.votes, presenceItem)?.value}
										{:else}
											<Fa class="text-xl mx-1 inline-block" icon={faSkull} />
										{/if}
									{:else if findVoteForCurrentUser(room.activeStory.votes, presenceItem)}
										<Fa class="text-xl inline-block" icon={faCheckCircle} />
									{:else}
										<Fa class="text-xl mx-1 inline-block animate-spin" icon={faHourglass} />
									{/if}
								</span>
							</li>
						{/each}
					</ul>

					<span class="h-1 w-full bg-cyan-200 rounded my-4" />

					<div class="flex gap-4 flex-wrap items-center justify-center">
						<button
							on:click={() => {
								room.activeStory && setVote(room.activeStory.id, '0.5');
							}}
							class={!vote
								? 'btn-icon variant-ghost-tertiary'
								: vote.value === '0.5'
								? 'btn-icon variant-ghost-primary'
								: 'btn-icon variant-ghost-tertiary'}>0.5</button
						>
						<button
							on:click={() => {
								room.activeStory && setVote(room.activeStory.id, '1');
							}}
							class={!vote
								? 'btn-icon variant-ghost-tertiary'
								: vote.value === '1'
								? 'btn-icon variant-ghost-primary'
								: 'btn-icon variant-ghost-tertiary'}>1</button
						>
						<button
							on:click={() => {
								room.activeStory && setVote(room.activeStory.id, '2');
							}}
							class={!vote
								? 'btn-icon variant-ghost-tertiary'
								: vote.value === '2'
								? 'btn-icon variant-ghost-primary'
								: 'btn-icon variant-ghost-tertiary'}>2</button
						>
						<button
							on:click={() => {
								room.activeStory && setVote(room.activeStory.id, '3');
							}}
							class={!vote
								? 'btn-icon variant-ghost-tertiary'
								: vote.value === '3'
								? 'btn-icon variant-ghost-primary'
								: 'btn-icon variant-ghost-tertiary'}>3</button
						>
						<button
							on:click={() => {
								room.activeStory && setVote(room.activeStory.id, '5');
							}}
							class={!vote
								? 'btn-icon variant-ghost-tertiary'
								: vote.value === '5'
								? 'btn-icon variant-ghost-primary'
								: 'btn-icon variant-ghost-tertiary'}>5</button
						>
						<button
							on:click={() => {
								room.activeStory && setVote(room.activeStory.id, '99+');
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
							room.activeStory &&
								updateStoryVisibility(room.activeStory.id, !room.activeStory.visible);
						}}
						class="btn variant-filled-secondary m-2"
					>
						{#if room.activeStory.visible}
							<Fa class="text-lg mr-2" icon={faEyeSlash} />
							Hide
						{:else}
							<Fa class="text-lg mr-2" icon={faEye} />
							Show
						{/if}
					</button>

					<button
						on:click={() => {
							room.activeStory && resetStory(room.activeStory.id, storyTextBox);
						}}
						class="btn variant-filled-secondary m-2"
					>
						{#if storyTextBox === room.activeStory.name}
							<Fa class="text-lg mr-2" icon={faBomb} />
							Reset Votes
						{:else}
							<Fa class="text-lg mr-2" icon={faSave} />
							Save Story
						{/if}
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="postcss">
</style>
