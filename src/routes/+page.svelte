<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: session = data.session;

	let roomId = '';

	onMount(async () => {
		const { pusher } = await import('$lib/pusher');
		const channel = pusher.subscribe('sprintpadawan');
		channel.bind('event', function (data: any) {
			console.log(data);
		});
	});

	onDestroy(async () => {
		const { unsubFromPusher } = await import('$lib/pusher');
		unsubFromPusher('sprintpadawan');
	});

	// const postMessage = async () => {};
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
			<form action="/api/room" method="POST">
				<button class="btn variant-filled-primary btn-base"> New Room </button>
			</form>
		{:else}
			<h3>Please sign in above using your GitHub account!</h3>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
