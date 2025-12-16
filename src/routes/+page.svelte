<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '$lib/stores/auth';

	onMount(() => {
		// Redirect based on authentication status
		if ($isAuthenticated) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900">PDF Text Reader</h1>
		<p class="mb-8 text-lg text-gray-600">Transform illegible PDFs into readable text</p>
		<div class="text-lg">Redirecting...</div>
	</div>
</div>
