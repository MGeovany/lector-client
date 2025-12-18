<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { initializeAuth, authLoading } from '$lib/stores/auth';
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/stores';
	import '../app.css';

	onMount(() => {
		if (browser) {
			initializeAuth();
		}
	});
</script>

<svelte:head>
	<title>Lector — Simple reader for simple readers</title>
	<meta
		name="description"
		content="Lector is a simple, elegant PDF reader designed for comfortable reading. Customize themes, fonts, and reading preferences for the best reading experience."
	/>
	<meta
		name="keywords"
		content="PDF reader, ebook reader, reading app, document reader, PDF viewer"
	/>
	<meta name="author" content="The Founders" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://lector.thefndrs.com/" />
	<meta property="og:title" content="Lector — Simple reader for simple readers" />
	<meta
		property="og:description"
		content="Lector is a simple, elegant PDF reader designed for comfortable reading. Customize themes, fonts, and reading preferences for the best reading experience."
	/>
	<meta property="og:site_name" content="Lector" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://lector.thefndrs.com/" />
	<meta name="twitter:title" content="Lector — Simple reader for simple readers" />
	<meta
		name="twitter:description"
		content="Lector is a simple, elegant PDF reader designed for comfortable reading. Customize themes, fonts, and reading preferences for the best reading experience."
	/>

	<!-- Theme Color -->
	<meta name="theme-color" content="#121212" />
	<meta name="msapplication-TileColor" content="#121212" />

	<!-- Canonical URL -->
	<link rel="canonical" href="https://lector.thefndrs.com/" />

	<!-- Robots -->
	<meta name="robots" content="index, follow" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<slot />

	{#if $authLoading && !['/login', '/register', '/forgot-password', '/landing'].includes($page.url.pathname)}
		<div class="fixed inset-0 z-40 flex items-center justify-center bg-white/80">
			<div class="text-sm font-medium text-slate-700">Loading…</div>
		</div>
	{/if}
</main>

<Toaster
	position="top-center"
	expand={false}
	closeButton
	toastOptions={{
		class: 'text-sm font-semibold',
		style:
			'font-family: "Parkinsans", "Inter", "SF Pro Text", "Segoe UI", system-ui, -apple-system, sans-serif;'
	}}
/>
