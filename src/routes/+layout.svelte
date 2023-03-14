<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-modern.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		Avatar,
		type ModalSettings,
		type ModalComponent
	} from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { version } from '$app/environment';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import ProfileModal from '$lib/components/ProfileModal.svelte';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const openProfileModal = () => {
		if ($page.data.session) {
			const profileModalComponent: ModalComponent = {
				ref: ProfileModal,
				props: { user: $page.data.session.user }
			};

			const alert: ModalSettings = {
				type: 'component',
				component: profileModalComponent
			};
			modalStore.trigger(alert);
		}
	};
</script>

<svelte:head>
	<title>Sprint Padawan</title>
	<meta name="description" content="Plan. Sprint. Repeat." />
</svelte:head>

<AppShell>
	<Modal />
	<svelte:fragment slot="header">
		<AppBar background="bg-surface">
			<svelte:fragment slot="lead">
				<img
					class="mr-2 mx-auto"
					width="32px"
					height="32px"
					src="/logo.svg"
					alt="Logo for Sprint Padawan"
				/>
				<a href="/" class="text-xl hover:text-pink-500">Sprint Padawan</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $page.data.session}
					{#if $page.route.id === '/'}
						<Avatar
							on:click={openProfileModal}
							width="w-10"
							border="border-2 border-surface-300-600-token hover:!border-primary-500"
							cursor="cursor-pointer"
							src={$page.data.session.user?.image || ''}
						/>
					{:else}
						<a href="/" class="btn hover:text-pink-500 text-lg" data-sveltekit-preload-data="hover">
							<Fa icon={faChevronLeft} />
							Back
						</a>
					{/if}
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="footer">
		<div class="text-center m-auto">
			<p>
				Version
				<a
					href={`https://github.com/atridadl/sprintpadawan/releases/tag/${version}`}
					target="_blank"
					rel="noreferrer">{version}</a
				>
				- Built with 💜 by <a href="https://atridad.dev">Atridad Lahiji</a>
			</p>
		</div>
	</svelte:fragment>
</AppShell>
