<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>SprintPadawan</title>
	<meta name="description" content="Scrum Planning Toolkit" />
</svelte:head>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
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
				<strong class="text-xl">Sprint Padawan</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $page.data.session}
					<button on:click={signOut}>Logout</button>
					<Avatar width="w-10" src={$page.data.session.user?.image || ''} />
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
