<script lang="ts">
	import prisma from '$lib/prisma';
	import type { User } from '@prisma/client';
	import { onMount } from 'svelte';

	let users: User[] | undefined;
	onMount(async () => {
		const response = await fetch('/api/hello');
		users = await response.json();
	});
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	{#if users}
		{#each users as user}
			{user.name}
			<br />
		{/each}
	{/if}
</div>

<style lang="postcss">
</style>
