<script lang="ts">
	import { Menu, Search, Loader, X, Send } from '@lucide/svelte';
	import { currentUser } from '$lib/stores/auth';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { handleFileUpload } from '$lib/utils/upload';
	import { sidebarOpen } from '$lib/stores/ui';
	import { searchDocuments, loadDocuments, searchQuery } from '$lib/stores/documents';
	import { showToast } from '$lib/stores/toast';
	import { onMount } from 'svelte';

	let uploading = false;
	let localSearchQuery = '';
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;
	let isSearching = false;
	let isSyncingFromStore = false;

	function toggleSidebar() {
		sidebarOpen.update((open) => !open);
	}

	$: userName =
		$currentUser?.user_metadata?.name ||
		$currentUser?.user_metadata?.full_name ||
		$currentUser?.email ||
		'User';
	$: userEmail = $currentUser?.email || '';
	$: avatarUrl =
		$currentUser?.user_metadata?.picture ||
		$currentUser?.user_metadata?.avatar_url ||
		$currentUser?.user_metadata?.image ||
		'';

	async function uploadFileButton() {
		if (uploading) return;
		await handleFileUpload((value) => {
			uploading = value;
		});
	}

	async function handleSearch() {
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		searchTimeout = setTimeout(async () => {
			if (!localSearchQuery.trim()) {
				// If search is empty, reload all documents
				if ($currentUser?.id) {
					await loadDocuments($currentUser.id);
				}
				return;
			}

			isSearching = true;
			try {
				await searchDocuments(localSearchQuery.trim());
			} catch (error) {
				console.error('Search failed:', error);
				showToast('Failed to search documents. Please try again.', 'error');
				// Reload all documents on error
				if ($currentUser?.id) {
					await loadDocuments($currentUser.id);
				}
			} finally {
				isSearching = false;
			}
		}, 300); // Debounce 300ms
	}

	$: if (localSearchQuery !== undefined && !isSyncingFromStore) {
		handleSearch();
	}

	// Sync local search query with store (but don't trigger search)
	$: if ($searchQuery !== localSearchQuery && !isSyncingFromStore) {
		isSyncingFromStore = true;
		localSearchQuery = $searchQuery;
		// Reset flag after sync to allow future user input to trigger search
		setTimeout(() => {
			isSyncingFromStore = false;
		}, 0);
	}

	onMount(() => {
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	});
</script>

<header class="fixed inset-x-0 top-0 z-30 border-b border-black/10 bg-white">
	<div class="flex items-center gap-4 px-6 py-3">
		<button
			type="button"
			class="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/5"
			on:click={toggleSidebar}
			aria-label="Toggle sidebar"
			aria-expanded={$sidebarOpen}
		>
			<div class="relative h-5 w-5">
				<Menu
					strokeWidth={1.5}
					class="absolute inset-0 h-5 w-5 transition-all duration-300 {$sidebarOpen
						? 'rotate-90 opacity-0'
						: 'rotate-0 opacity-100'}"
				/>
				<X
					strokeWidth={1.5}
					class="absolute inset-0 h-5 w-5 transition-all duration-300 {$sidebarOpen
						? 'rotate-0 opacity-100'
						: 'rotate-90 opacity-0'}"
				/>
			</div>
		</button>

		<div class="font-brand mr-4 text-2xl font-bold tracking-tight">Lector</div>

		<div class="flex min-w-0 flex-1 items-center">
			<div
				class="relative flex min-w-0 flex-1 items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-sm"
			>
				{#if isSearching}
					<Loader class="h-4 w-4 shrink-0 animate-spin text-slate-500" strokeWidth={1.5} />
				{:else}
					<Search class="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.5} />
				{/if}
				<input
					type="text"
					bind:value={localSearchQuery}
					class="min-w-0 flex-1 bg-transparent text-slate-900 placeholder:text-xs placeholder:font-extralight placeholder:text-slate-500 focus:outline-none"
					placeholder="Search documents..."
					aria-label="Search documents"
				/>
				{#if localSearchQuery}
					<button
						type="button"
						class="shrink-0 rounded-full p-0.5 hover:bg-black/5"
						on:click={() => {
							localSearchQuery = '';
							if ($currentUser?.id) {
								loadDocuments($currentUser.id);
							}
						}}
						aria-label="Clear search"
					>
						<X class="h-3.5 w-3.5 text-slate-500" strokeWidth={1.5} />
					</button>
				{/if}
			</div>
		</div>

		<div class="flex items-center gap-2">
			<button
				type="button"
				class="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-extralight text-slate-900 hover:bg-black/5 md:inline-flex"
				on:click={() => uploadFileButton()}
				disabled={uploading}
				aria-busy={uploading}
			>
				{#if !uploading}
					<Send class="h-4 w-4" strokeWidth={1.5} />
					Upload
				{:else}
					<Loader class="h-4 w-4 animate-spin" />
					Uploading
				{/if}
			</button>

			<ProfilePicture name={userName} email={userEmail} avatar={avatarUrl} />
		</div>
	</div>
</header>
