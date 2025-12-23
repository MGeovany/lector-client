<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Document } from '$lib/api/types';
	import { BookOpen, Calendar, CircleMinus } from '@lucide/svelte';
	import { formatBytes } from '../../utils/format';
	import { shortenId } from '$lib/utils/id';
	import { readingPositions } from '$lib/stores/preferences';
	import { deleteDocument } from '$lib/stores/documents';
	import { showToast } from '$lib/stores/toast';
	import {
		Tooltip as ShadTooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
	import { Progress } from '$lib/components/ui/progress';
	import DetailsPopover from './DetailsPopover.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	export let document: Document;

	$: readingPosition = $readingPositions.get(document.id);
	function derivePageCount(doc: Document): number {
		const fromMeta = doc.metadata?.page_count ?? 0;
		if (fromMeta && fromMeta > 0) return fromMeta;

		const content = doc.content ?? [];
		if (Array.isArray(content) && content.length > 0) {
			const pages = new Set<number>();
			for (const block of content as any[]) {
				const p = Number(block?.page_number ?? 0);
				if (p > 0) pages.add(p);
			}
			if (pages.size > 0) return pages.size;
		}
		return 0;
	}

	$: pageCount = derivePageCount(document);
	$: progress =
		pageCount > 0 && readingPosition ? Math.min(1, readingPosition.page_number / pageCount) : 0;
	$: progressPercent = Math.round(progress * 100);
	// Keep "read/unread" semantics consistent with the library tab logic in `src/routes/+page.svelte`
	// - If page count is known: read when position reaches the end
	// - If page count is unknown: treat any progress beyond page 1 as read

	$: isRead = (() => {
		if (!readingPosition) return false;
		if (pageCount > 0) return readingPosition.page_number >= pageCount;
		return readingPosition.page_number > 1;
	})();

	$: author = document.author || 'Unknown author';
	$: tag = document.tag || 'Unknown tag';

	function resolveUploadedAt(): string {
		const created = document.created_at;
		const updated = document.updated_at;
		const createdDate = new Date(created);
		const updatedDate = new Date(updated);
		const createdOk =
			created && !Number.isNaN(createdDate.getTime()) && createdDate.getFullYear() >= 2000;
		const updatedOk =
			updated && !Number.isNaN(updatedDate.getTime()) && updatedDate.getFullYear() >= 2000;
		return createdOk ? created : updatedOk ? updated : '';
	}

	function formatDate(dateString: string): string {
		if (!dateString) return '—';
		const date = new Date(dateString);
		if (Number.isNaN(date.getTime())) return '—';
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		// Use floor to avoid showing "Yesterday" for recent uploads due to timezone boundaries.
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays}d ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function handleRead() {
		goto(`/documents/${shortenId(document.id)}`);
	}

	let confirmDeleteOpen = false;
	let deleting = false;

	function openDeleteModal() {
		confirmDeleteOpen = true;
	}

	async function confirmDelete() {
		if (deleting) return;
		deleting = true;
		try {
			await deleteDocument(document.id);
			showToast('Book deleted', 'success');
			confirmDeleteOpen = false;
		} catch (error) {
			console.error('Failed to delete document', error);
			showToast('Failed to delete book', 'error');
		} finally {
			deleting = false;
		}
	}
</script>

<article class="group flex gap-6 border-b border-black/10 p-4 py-6 transition hover:bg-black/5">
	<!-- Left content (clickable) -->
	<button
		type="button"
		class="flex min-w-0 flex-1 cursor-pointer flex-col gap-3 text-left"
		on:click={handleRead}
		aria-label={`Open ${document.title}`}
	>
		<!-- Publisher info -->
		<div class="flex items-center gap-2 text-xs text-slate-600">
			<span class="font-medium tracking-widest uppercase">{document.tag}</span>
		</div>

		<!-- Title -->
		<h2 class="text-xl leading-snug font-medium text-slate-900">{document.title}</h2>

		<!-- Description/Summary -->
		<p class="line-clamp-2 text-sm leading-relaxed text-slate-600">
			{author && author !== 'Unknown author' ? `${author} • ` : ''}
			{pageCount > 0 ? `${pageCount} pages` : 'PDF document'} • {formatBytes(
				document.metadata.file_size ?? 0
			)}
		</p>

		<!-- Metadata -->
		<div class="flex items-center gap-4 text-xs text-slate-600">
			<div class="flex items-center gap-1.5">
				<Calendar class="h-3.5 w-3.5" strokeWidth={1.5} />
				<span>{formatDate(resolveUploadedAt())}</span>
			</div>
			{#if readingPosition}
				<div class="flex items-center gap-1.5">
					<BookOpen class="h-3.5 w-3.5" strokeWidth={1.5} />
					<span
						>Page {Math.min(
							readingPosition.page_number,
							pageCount || readingPosition.page_number
						)}{pageCount > 0 ? ` of ${pageCount}` : ''}</span
					>
				</div>
			{/if}
		</div>

		{#if pageCount > 0}
			<div class="mt-1">
				<Progress
					value={progressPercent}
					class="h-1.5 bg-black/10 **:data-[slot=progress-indicator]:bg-black/70"
				/>
				<p class="mt-2 text-[11px] text-slate-600">
					<span class="font-medium text-slate-900">{progressPercent}%</span> read
				</p>
			</div>
		{/if}
	</button>

	<!-- Action buttons -->
	<div class="flex shrink-0 items-start gap-1 opacity-100 transition-opacity">
		<TooltipProvider>
			<ShadTooltip>
				<TooltipTrigger>
					<button
						type="button"
						class="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/10"
						on:click|stopPropagation={(e) => {
							e.preventDefault();
							openDeleteModal();
						}}
						aria-label="Delete book"
					>
						<CircleMinus class="h-4 w-4 text-slate-600" strokeWidth={1.5} />
					</button>
				</TooltipTrigger>
				<TooltipContent side="top" sideOffset={8}>Delete book</TooltipContent>
			</ShadTooltip>
		</TooltipProvider>
		<DetailsPopover {isRead} {document} {pageCount} {author} />
	</div>

	<AlertDialog.Root bind:open={confirmDeleteOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Delete book</AlertDialog.Title>
				<AlertDialog.Description>
					Are you sure you want to delete
					<span class="font-semibold">"{document.title}"</span>? This action cannot be undone.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
				<button
					type="button"
					class={buttonVariants({ variant: 'destructive' })}
					on:click={(e) => {
						e.preventDefault();
						confirmDelete();
					}}
					disabled={deleting}
					aria-busy={deleting}
				>
					<CircleMinus class="h-4 w-4" strokeWidth={1.5} />
					{deleting ? 'Deleting…' : 'Delete'}
				</button>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</article>
