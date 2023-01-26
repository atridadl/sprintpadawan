<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: users = data.data;
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
