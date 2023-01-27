<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { pusher, unsubFromPusher } from '$lib/pusher';

	export let data: PageData;

	$: users = data.data;

	onMount(async () => {
		const channel = pusher.subscribe('sprintpadawan');
		channel.bind('event', function (data: any) {
			console.log(data);
		});
	});

	onDestroy(() => {
		unsubFromPusher('sprintpadawan');
	});

	// const postMessage = async () => {};
</script>

<div class="container h-full mx-auto flex flex-col justify-center items-center text-center">
	<div>
		{#if users}
			{#each users as user}
				{user.name}
				<br />
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
