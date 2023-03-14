<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { deleteUser } from '$lib/api';
	import { signOut } from '@auth/sveltekit/client';
	import type { User } from '@prisma/client';
	import { Avatar, modalStore, popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faCircleXmark, faTrashCan } from '@fortawesome/free-regular-svg-icons';
	import { faSignOut } from '@fortawesome/free-solid-svg-icons';

	const deleteTooltipSettings: PopupSettings = {
		event: 'hover',
		target: 'deleteTooltip',
		placement: 'top'
	};

	const signOutTooltipSettings: PopupSettings = {
		event: 'hover',
		target: 'signOutTooltip',
		placement: 'top'
	};

	const closeTooltipSettings: PopupSettings = {
		event: 'hover',
		target: 'closeTooltip',
		placement: 'top'
	};

	export let user: User;

	const onDeleteHandler = async () => {
		modalStore.close();
		await deleteUser();
		invalidateAll();
	};

	const onLogoutHandler = async () => {
		modalStore.close();
		await signOut();
		invalidateAll();
	};

	const onCancelHandler = async () => {
		modalStore.close();
	};
</script>

<div class="card p-4 w-modal-slim shadow-xl space-y-4">
	<div class="card variant-filled-secondary p-4 float-right" data-popup="closeTooltip">
		Close
		<div class="arrow variant-filled-secondary" />
	</div>
	<button use:popup={closeTooltipSettings} on:click={onCancelHandler} class="btn float-right">
		<Fa class="text-xl" icon={faCircleXmark} />
	</button>
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
				<div class="card variant-filled-secondary p-4" data-popup="deleteTooltip">
					Delete
					<div class="arrow variant-filled-secondary" />
				</div>
				<button
					use:popup={deleteTooltipSettings}
					on:click={onDeleteHandler}
					class="btn variant-filled-error m-2"
				>
					<Fa class="text-xl" icon={faTrashCan} />
				</button>

				<div class="card variant-filled-secondary p-4" data-popup="signOutTooltip">
					Sign Out
					<div class="arrow variant-filled-secondary" />
				</div>
				<button
					use:popup={signOutTooltipSettings}
					on:click={signOut}
					class="btn variant-ghost-primary m-2"
				>
					<Fa class="text-xl" icon={faSignOut} />
				</button>
			</div>
		{/if}
	</div>
</div>
