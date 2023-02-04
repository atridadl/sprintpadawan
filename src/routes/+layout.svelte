<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-modern.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { Toast } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Sprint Padawan</title>
	<meta name="description" content="Plan. Sprint. Repeat." />
</svelte:head>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<Toast />
	<svelte:fragment slot="header">
		<AppBar>
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
						<button on:click={signOut}>Logout</button>
						<Avatar width="w-10" src={$page.data.session.user?.image || ''} />
					{:else}
						<a href="/" class="btn hover:text-pink-500" data-sveltekit-preload-data="hover">
							<Icon icon="material-symbols:arrow-back" /> Back
						</a>
					{/if}
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="footer">
		<div class="text-center m-auto">
			Built by <a href="https://atridad.dev">Atridad Lahiji</a> using SvelteKit + Vercel + Planetscale
			+ Ably
		</div>
	</svelte:fragment>
</AppShell>
