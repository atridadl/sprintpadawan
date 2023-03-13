<script lang="ts">
	import { deleteUser } from '$lib/api';
	import type { User } from '@prisma/client';
	import { Avatar, modalStore } from '@skeletonlabs/skeleton';

	export let user: User;

	const onDeleteHandler = async () => {
		modalStore.close();
		await deleteUser();
		location.reload();
	};

	const onCancelHandler = async () => {
		modalStore.close();
	};
</script>

<div class="card p-4 w-modal-slim shadow-xl space-y-4">
	<div
		class="container h-full mx-auto flex flex-col justify-center items-center text-center flex-wrap gap-2"
	>
		{#if user.image}
			<Avatar
				width="w-32"
				border="border-2 border-surface-300-600-token hover:!border-primary-500"
				cursor="cursor-pointer"
				src={user.image}
			/>
		{/if}

		{#if user.name}
			<div>
				Name:
				<input
					type="text"
					id="profileName"
					class="input text-center mb-2"
					bind:value={user.name}
					disabled
					required
				/>
			</div>
		{/if}

		{#if user.email}
			<div>
				Email:
				<input
					type="text"
					id="profileEmail"
					class="input text-center mb-2"
					bind:value={user.email}
					disabled
					required
				/>
			</div>
		{/if}
		{#if user}
			<div>
				<button on:click={onDeleteHandler} class="btn variant-filled-error m-2"
					>Delete Account</button
				>
				<button on:click={onCancelHandler} class="btn variant-filled-tertiary m-2">Close</button>
			</div>
		{/if}
	</div>
</div>
