<script lang="ts">
	import { documents, documentsLoading } from '$lib/stores/documents';
	import { formatBytes } from '../../utils/format';
	import { deleteDocument } from '$lib/stores/documents';
	import { Loader, Trash } from '@lucide/svelte';

	let deletingDocumentIds = new Set<string>();

	function openFile(file: string) {
		window.open(file, 'filewin');
	}

	function isDeleting(documentID: string) {
		return deletingDocumentIds.has(documentID);
	}

	async function handleDeleteDocument(documentID: string) {
		if (deletingDocumentIds.has(documentID)) return;

		deletingDocumentIds = new Set(deletingDocumentIds).add(documentID);
		try {
			await deleteDocument(documentID);
		} finally {
			const next = new Set(deletingDocumentIds);
			next.delete(documentID);
			deletingDocumentIds = next;
		}
	}
</script>

<section id="library" class="rounded-2xl border border-slate-200 bg-white">
	<div class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
		<div>
			<h2 class="text-sm font-semibold text-slate-900">Library</h2>
			<p class="mt-1 text-sm text-slate-600">Your documents, ready to read.</p>
		</div>
	</div>

	{#if $documentsLoading}
		<div class="px-5 py-10 text-sm text-slate-600">Loading documents…</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead
					class="border-b border-slate-200 bg-slate-50/60 text-xs font-semibold tracking-wide text-slate-600 uppercase"
				>
					<tr>
						<th class="px-5 py-3">Title</th>
						<th class="px-5 py-3">Pages</th>
						<th class="px-5 py-3">Size</th>
						<th class="px-5 py-3 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each $documents as document}
						<tr class="hover:bg-slate-50/70">
							<td class="px-5 py-4">
								<p class="font-medium text-slate-900">{document.title}</p>
								<p class="mt-1 text-xs text-slate-500">{document.original_name}</p>
							</td>
							<td class="px-5 py-4 text-slate-700">
								{document.metadata?.page_count ?? '—'}
							</td>
							<td class="px-5 py-4 text-slate-700">{formatBytes(document.file_size)}</td>
							<td class="px-5 py-4">
								<div class="flex justify-end gap-2">
									<button
										type="button"
										class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
										on:click={() => openFile((document as any).file_path)}
										disabled={isDeleting(document.id)}
										aria-label="Read document"
									>
										Read
									</button>
									<button
										type="button"
										class="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
										on:click={() => handleDeleteDocument(document.id)}
										disabled={isDeleting(document.id)}
										aria-label="Delete document"
										aria-busy={isDeleting(document.id)}
									>
										{#if isDeleting(document.id)}
											<Loader class="h-4 w-4 animate-spin" />
										{:else}
											<Trash class="h-4 w-4" />
										{/if}
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
