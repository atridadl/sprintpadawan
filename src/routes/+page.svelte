<script lang="ts">
	// Import components
	import { DataTable, InlineLoading, Loading } from 'carbon-components-svelte';
	// Import from Firebase
	import { auth, firestore } from '$lib/firebase';
	import { Collection, collectionStore, Doc, FirebaseApp, userStore } from 'sveltefire';

	const user = userStore(auth);
	const sessions = collectionStore(firestore, 'users');
</script>

<FirebaseApp {auth} {firestore}>
	{#if $user}
		Hi, {$user.displayName}!
		<br />
		<div>
			<Doc ref={`users/${$user.uid}`} let:data={user} let:ref={userRef}>
				<Collection ref={userRef?.path + '/sessions'} let:data={sessions}>
					{#if sessions.length}
						<DataTable
							headers={[
								{ key: 'name', value: 'Name' },
								{ key: 'id', value: 'ID' }
							]}
							rows={sessions}
						/>
					{:else}
						<InlineLoading description="Loading sessions..." />
					{/if}
				</Collection>
			</Doc>
		</div>
	{:else if $user === null}
		<Loading />
	{:else}
		Welcome to Sprint Padawan! You will need to sign in by clicking on the placeholder avatar in the
		top-left corner of the page before you can use these services.
	{/if}
</FirebaseApp>
