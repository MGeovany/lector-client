<script lang="ts">
	import { onMount } from 'svelte';
	import { isAuthenticated, currentUser } from '$lib/stores/auth';
	import { documents, loadDocuments, uploadDocument } from '$lib/stores/documents';
	import { showToast } from '$lib/stores/toast';
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import { AlertTriangle, Info, Loader, Plus } from '@lucide/svelte';
	import { formatBytes } from '../utils/format';
	import UploadFiles from '$lib/components/UploadFiles.svelte';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import ProjectFooter from '$lib/components/ProjectFooter.svelte';

	let uploading = false;
	let hasLoadedDocuments = false;
	const MAX_STORAGE_BYTES = 15 * 1024 * 1024; // 15MB

	onMount(() => {
		// In case the user is already authenticated when this page mounts.
		if ($isAuthenticated && !hasLoadedDocuments) {
			hasLoadedDocuments = true;
			loadDocuments($currentUser?.id || '');
		}
	});

	// React to auth becoming ready after initial mount (e.g. on reload).
	$: if ($isAuthenticated && !hasLoadedDocuments) {
		hasLoadedDocuments = true;
		loadDocuments($currentUser?.id || '');
	}

	$: documentCount = $documents?.length ?? 0;
	$: totalBytes = ($documents ?? []).reduce(
		(sum: number, doc: any) => sum + (doc?.file_size ?? 0),
		0
	);
	$: storageRatio = totalBytes / MAX_STORAGE_BYTES;
	$: isNearLimit = storageRatio >= 0.8 && storageRatio < 1;
	$: isOverLimit = storageRatio >= 1;
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

		// Prevent upload if user is already over the quota
		if (isOverLimit) {
			showToast(
				"You're out of storage. If you're enjoying Lector, feel free to reach out and I can increase your space with a special offer.",
				'error'
			);
			return;
		}

		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/pdf';
		input.onchange = async (e) => {
			const selectedFile = (e.target as HTMLInputElement).files?.[0];
			if (!selectedFile) return;

			// Frontend validation against 15MB quota
			const nextUsageBytes = totalBytes + selectedFile.size;
			if (nextUsageBytes > MAX_STORAGE_BYTES) {
				showToast(
					"You're out of storage. If you're enjoying Lector, feel free to reach out and I can increase your space with a special offer.",
					'error'
				);
				(e.target as HTMLInputElement).value = '';
				return;
			}

			uploading = true;
			try {
				await uploadDocument(selectedFile);
				(e.target as HTMLInputElement).value = '';
				showToast('Book added successfully', 'success');
			} catch (error) {
				console.error('Upload failed', error);
				showToast('Failed to add book', 'error');
			} finally {
				uploading = false;
			}
		};
		input.click();
	}
</script>

<ProtectedRoute redirectTo="/landing">
	<div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
		<!-- <Sidebar /> -->

		<main class="flex-1 transition-[padding] duration-200 peer-hover/sidebar:pl-64">
			<div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
				<header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div class="flex flex-col gap-3">
						<div class="flex items-center gap-3">
							<div>
								<h1 class="text-2xl font-semibold tracking-wider text-slate-900 uppercase">
									Lector
								</h1>
								<div class="flex flex-row items-center gap-2">
									<ProfilePicture name={userName} email={userEmail} avatar={avatarUrl} />
									<p class="mt-1 text-lg text-slate-600">{userName}</p>
								</div>
							</div>
						</div>

						<div class="mt-1 mb-2 flex flex-row items-center gap-4">
							<p class="text-xs text-slate-600">
								Documents: <span class="font-bold">{documentCount}</span>
							</p>
							<div class="flex items-center gap-2 text-xs text-slate-600">
								<p>
									Storage:
									<span class="font-bold">
										{formatBytes(totalBytes)} / {formatBytes(MAX_STORAGE_BYTES)}
									</span>
								</p>

								{#if isNearLimit}
									<div
										class="group relative inline-flex cursor-default items-center"
										aria-label="You are running low on storage"
									>
										<AlertTriangle class="h-3.5 w-3.5 text-orange-400" strokeWidth={2.5} />
										<div
											class="pointer-events-none absolute top-full left-1/2 z-30 mt-2 w-64 -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700 opacity-0 shadow-lg transition group-hover:opacity-100"
										>
											<p class="flex items-start gap-1">
												<Info class="mt-[1px] h-3 w-3 text-slate-400" />
												<span>
													You're running low on storage. You can delete a few documents, or if
													you're enjoying Lector, feel free to reach out and I can increase your
													space with a special offer.
												</span>
											</p>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-xl border bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
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
					</div>
				</header>

				<UploadFiles />
			</div>
		</main>

		<ProjectFooter />
	</div>
</ProtectedRoute>
