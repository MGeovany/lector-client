<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated, currentUser, logout } from '$lib/stores/auth';
	import { documents, loadDocuments, documentsLoading } from '$lib/stores/documents';

	onMount(() => {
		// Redirect if not authenticated
		if (!$isAuthenticated) {
			goto('/login');
			return;
		}

		// Load user documents
		loadDocuments();
	});

	async function handleLogout() {
		await logout();
		goto('/login');
	}
</script>

{#if !$isAuthenticated}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-lg">Redirecting to login...</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<header class="bg-white shadow">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between py-6">
					<div>
						<h1 class="text-3xl font-bold text-gray-900">PDF Text Reader</h1>
						<p class="text-sm text-gray-600">
							Welcome back, {$currentUser?.user_metadata?.name || $currentUser?.email || 'User'}
						</p>
					</div>
					<button
						on:click={handleLogout}
						class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
					>
						Logout
					</button>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
			<div class="px-4 py-6 sm:px-0">
				<div class="rounded-lg border-4 border-dashed border-gray-200 p-8">
					<div class="text-center">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">Your Document Library</h2>

						{#if $documentsLoading}
							<div class="text-lg text-gray-600">Loading documents...</div>
						{:else if $documents.length === 0}
							<div class="text-gray-600">
								<p class="mb-4">No documents uploaded yet.</p>
								<button
									class="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
								>
									Upload Your First PDF
								</button>
							</div>
						{:else}
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{#each $documents as document}
									<div class="rounded-lg border bg-white p-6 shadow">
										<h3 class="mb-2 text-lg font-semibold text-gray-900">{document.title}</h3>
										<p class="mb-4 text-sm text-gray-600">
											{document.metadata.page_count} pages • {Math.round(document.file_size / 1024)} KB
										</p>
										<div class="flex space-x-2">
											<button
												class="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
											>
												Read
											</button>
											<button
												class="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
											>
												Delete
											</button>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</main>
	</div>
{/if}
