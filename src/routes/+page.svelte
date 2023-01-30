<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: session = data.session;

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
			Hi, {session.user?.name}!
		{:else}
			Not Logged In!
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
