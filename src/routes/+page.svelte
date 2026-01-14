<script lang="ts">
	import { onMount } from 'svelte';
	import { isAuthenticated, currentUser } from '$lib/stores/auth';
	import { documents, loadDocuments, documentsLoading } from '$lib/stores/documents';
	import { readingPositions } from '$lib/stores/preferences';
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import { AlertTriangle, Info, Loader, Plus } from '@lucide/svelte';
	import { formatBytes } from '../utils/format';
	import ProjectFooter from '$lib/components/ProjectFooter.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	import BookCard from '$lib/components/BookCard.svelte';
	import { handleFileUpload } from '$lib/utils/upload';
	import { sidebarOpen, documentMarkedAsRead } from '$lib/stores/ui';
	import type { Document } from '$lib/api/types';

	let uploading = false;
	let hasLoadedDocuments = false;
	let hasLoadedPreferences = false;
	let activeTab: 'read' | 'unread' = 'unread';
	const MAX_STORAGE_BYTES = 15 * 1024 * 1024; // 15MB

	onMount(() => {
		// In case the user is already authenticated when this page mounts.
		if ($isAuthenticated && !hasLoadedDocuments) {
			hasLoadedDocuments = true;
			loadDocuments($currentUser?.id || '').then((docs) => {
				// reading_position now comes inline from GET /documents/user/{id}.
				readingPositions.update((positions) => {
					const next = new Map(positions);
					for (const doc of docs) {
						if (doc.reading_position) next.set(doc.id, doc.reading_position);
					}
					return next;
				});
			});
		}
	});

	// React to auth becoming ready after initial mount (e.g. on reload).
	$: if ($isAuthenticated && !hasLoadedDocuments) {
		hasLoadedDocuments = true;
		loadDocuments($currentUser?.id || '').then((docs) => {
			readingPositions.update((positions) => {
				const next = new Map(positions);
				for (const doc of docs) {
					if (doc.reading_position) next.set(doc.id, doc.reading_position);
				}
				return next;
			});
		});
	}
	$: if ($isAuthenticated && !hasLoadedPreferences) {
		hasLoadedPreferences = true;
	}

	$: documentCount = $documents?.length ?? 0;
	$: totalBytes = ($documents ?? []).reduce(
		(sum: number, doc: any) => sum + (doc?.metadata?.file_size ?? 0),
		0
	);
	$: storageRatio = totalBytes / MAX_STORAGE_BYTES;
	$: isNearLimit = storageRatio >= 0.8 && storageRatio < 1;
	$: isOverLimit = storageRatio >= 1;

	// Filter documents by read status
	// Make this reactive to readingPositions changes
	$: readDocuments = (() => {
		const positions = $readingPositions;
		return $documents.filter((doc: Document) => {
			const pos = positions.get(doc.id);
			const pageCount = doc.metadata?.page_count ?? 0;
			if (!pos) return false;
			if (pageCount > 0) return pos.page_number >= pageCount;
			return pos.page_number > 1;
		});
	})();

	$: unreadDocuments = (() => {
		const positions = $readingPositions;
		return $documents.filter((doc: Document) => {
			const pos = positions.get(doc.id);
			const pageCount = doc.metadata?.page_count ?? 0;
			if (!pos) return true; // If no position, it's unread
			if (pageCount > 0) return pos.page_number < pageCount;
			return pos.page_number <= 1;
		});
	})();

	$: displayedDocuments = activeTab === 'read' ? readDocuments : unreadDocuments;

	// Auto-switch to "read" tab when a document is marked as read while viewing "unread" tab
	$: if ($documentMarkedAsRead && activeTab === 'unread') {
		const markedDocId = $documentMarkedAsRead;
		// Check if the marked document is now in readDocuments
		// The readDocuments list is reactive to $readingPositions, so it should update automatically
		if (readDocuments.some((doc) => doc.id === markedDocId)) {
			activeTab = 'read';
		}
		// Reset the marker after a brief delay to allow reactivity to process
		setTimeout(() => {
			documentMarkedAsRead.set(null);
		}, 100);
	}

	// Also switch if all unread documents become read
	$: if (activeTab === 'unread' && unreadDocuments.length === 0 && readDocuments.length > 0) {
		activeTab = 'read';
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
</script>

<ProtectedRoute redirectTo="/landing">
	<div class="h-full bg-white text-slate-900">
		<Header />
		<Sidebar />

		<!-- Overlay for mobile when sidebar is open -->
		{#if $sidebarOpen}
			<button
				type="button"
				class="fixed inset-0 z-10 bg-black/20 transition-opacity duration-300 md:hidden"
				on:click={() => sidebarOpen.set(false)}
				aria-label="Close sidebar"
			></button>
		{/if}

		<div
			class="flex min-h-screen flex-col justify-between pt-14 pb-6 transition-[padding-left] duration-300"
			class:md:pl-60={$sidebarOpen}
			class:md:pl-0={!$sidebarOpen}
		>
			<main class="flex-1 py-6">
				<div class="mx-auto flex max-w-6xl flex-col gap-6 px-6">
					<!-- Tabs -->
					<div class="flex items-center gap-1 border-b border-black/10">
						<button
							type="button"
							class="px-4 py-3 text-sm font-light text-slate-600 transition hover:text-slate-900"
							class:border-b-2={activeTab === 'unread'}
							class:border-black={activeTab === 'unread'}
							class:text-slate-900={activeTab === 'unread'}
							on:click={() => (activeTab = 'unread')}
						>
							Unread {unreadDocuments.length > 0 ? `(${unreadDocuments.length})` : ''}
						</button>
						<button
							type="button"
							class="px-4 py-3 text-sm font-light text-slate-600 transition hover:text-slate-900"
							class:border-b-2={activeTab === 'read'}
							class:border-black={activeTab === 'read'}
							class:text-slate-900={activeTab === 'read'}
							on:click={() => (activeTab = 'read')}
						>
							Read {readDocuments.length > 0 ? `(${readDocuments.length})` : ''}
						</button>
					</div>

					<!-- Stats -->
					<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
						<p>
							Documents: <span class="font-medium text-slate-900">{documentCount}</span>
						</p>
						<div class="flex items-center gap-2">
							<p>
								Storage:
								<span class="font-medium text-slate-900">
									{formatBytes(totalBytes)} / {formatBytes(MAX_STORAGE_BYTES)}
								</span>
							</p>

							{#if isNearLimit}
								<div
									class="group relative inline-flex cursor-default items-center"
									aria-label="You are running low on storage"
								>
									<AlertTriangle class="h-3.5 w-3.5 text-orange-500" strokeWidth={2.5} />
									<div
										class="pointer-events-none absolute top-full left-1/2 z-30 mt-2 w-64 -translate-x-1/2 rounded-xl border border-black/10 bg-white px-3 py-2 text-[11px] text-slate-700 opacity-0 shadow-lg transition group-hover:opacity-100"
									>
										<p class="flex items-start gap-1">
											<Info class="mt-px h-3 w-3 text-slate-400" />
											<span>
												You're running low on storage. Delete a few documents, or reach out and I
												can increase your space.
											</span>
										</p>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Primary action on mobile -->
					<button
						type="button"
						class="inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-light text-white hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60 md:hidden"
						on:click={() => uploadFileButton()}
						disabled={uploading}
						aria-busy={uploading}
					>
						{#if !uploading}
							<Plus class="h-4 w-4" />
							Add a book
						{:else}
							<Loader class="h-4 w-4 animate-spin" />
							Uploading...
						{/if}
					</button>

					<!-- Book Cards -->
					{#if $documentsLoading}
						<div class="min-h-screen py-10 text-center text-sm text-slate-600">Loading books…</div>
					{:else if displayedDocuments.length === 0}
						<div class="py-10 text-center text-sm text-slate-600">
							{activeTab === 'read'
								? 'No books read yet. Start reading to see them here.'
								: 'No books yet. Upload your first book to get started.'}
						</div>
					{:else}
						<div class="flex flex-col">
							{#each displayedDocuments as document (document.id)}
								<BookCard {document} />
							{/each}
						</div>
					{/if}
				</div>
			</main>

			<ProjectFooter />
		</div>
	</div>
</ProtectedRoute>
