<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated, currentUser } from '$lib/stores/auth';
	import { documents, loadDocuments, uploadDocument } from '$lib/stores/documents';
	import { showToast } from '$lib/stores/toast';
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import { Loader, Plus } from '@lucide/svelte';
	import { formatBytes } from '../utils/format';
	import UploadFiles from '$lib/components/UploadFiles.svelte';
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import ProjectFooter from '$lib/components/ProjectFooter.svelte';

	let uploading = false;

	onMount(() => {
		if (!$isAuthenticated) {
			goto('/landing');
			return;
		}
		// Only load if documents are empty (use cache otherwise)
		if ($documents.length === 0) {
			loadDocuments($currentUser?.id || '');
		}
	});

	$: documentCount = $documents?.length ?? 0;
	$: totalBytes = ($documents ?? []).reduce(
		(sum: number, doc: any) => sum + (doc?.file_size ?? 0),
		0
	);
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

		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/pdf';
		input.onchange = async (e) => {
			const selectedFile = (e.target as HTMLInputElement).files?.[0];
			if (!selectedFile) return;

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

<ProtectedRoute>
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
							<p class="text-xs text-slate-600">
								Storage: <span class="font-bold">{formatBytes(totalBytes)}</span>
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-xl border border-slate-900 bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
