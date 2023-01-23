<script>
	// Import css
	import 'carbon-components-svelte/css/g100.css';
	// Import components
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		Content,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import OverflowMenuVertical from 'carbon-icons-svelte/lib/OverflowMenuVertical.svelte';
	// Import Svelte
	import { onMount } from 'svelte';
	// Import constants
	import { SITE_NAME } from '$lib/constants';
	// Import from Firebase
	import { analytics, auth, login, logout } from '$lib/firebase';
	import { logEvent } from 'firebase/analytics';
	import { userStore } from 'sveltefire';

	const user = userStore(auth);

	let navMenuIsOpen = false;

	onMount(() => {
		logEvent(analytics, 'notification_received');
	});
</script>

<Header platformName={SITE_NAME}>
	<HeaderUtilities>
		<HeaderAction
			bind:isOpen={navMenuIsOpen}
			icon={OverflowMenuVertical}
			closeIcon={OverflowMenuVertical}
		>
			<span slot="icon">
				{#if $user}
					<img
						style="border-radius: 50%; margin: auto;"
						width="32"
						height="32"
						src={$user.photoURL}
						alt=""
					/>
				{:else}
					<UserAvatarFilledAlt fill="white" size={32} />
				{/if}
			</span>
			<span slot="closeIcon">
				{#if $user}
					<img
						style="border-radius: 50%; margin: auto;"
						width="32"
						height="32"
						src={$user.photoURL}
						alt=""
					/>
				{:else}
					<UserAvatarFilledAlt fill="white" size={32} />
				{/if}
			</span>
			<HeaderPanelLinks>
				{#if $user}
					<HeaderPanelDivider>{$user.displayName}</HeaderPanelDivider>
					<HeaderPanelLink on:click={logout}>Sign Out</HeaderPanelLink>
				{:else}
					<HeaderPanelDivider>Signed Out</HeaderPanelDivider>
					<HeaderPanelLink on:click={login}>Sign In</HeaderPanelLink>
				{/if}
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<Content>
	<Grid>
		<Row>
			<Column>
				<slot />
			</Column>
		</Row>
	</Grid>
</Content>
