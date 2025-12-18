<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { initializeAuth, authLoading } from '$lib/stores/auth';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	onMount(() => {
		if (browser) {
			initializeAuth();
		}
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

<Toaster
	position="top-center"
	richColors
	expand={false}
	closeButton
	toastOptions={{
		class: 'text-sm font-semibold',
		style:
			'font-family: "Parkinsans", "Inter", "SF Pro Text", "Segoe UI", system-ui, -apple-system, sans-serif;'
	}}
/>
