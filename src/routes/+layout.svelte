<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeAuth, authLoading } from '$lib/stores/auth';
	import '../app.css';

	onMount(() => {
		initializeAuth();
	});
</script>

<svelte:head>
	<title>Lector</title>
	<meta name="description" content="Lector, app for readers across the world" />
</svelte:head>

{#if $authLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-lg">Loading...</div>
	</div>
{:else}
	<main class="min-h-screen bg-gray-50">
		<slot />
	</main>
{/if}
