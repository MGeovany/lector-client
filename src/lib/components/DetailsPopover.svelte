<script lang="ts">
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Badge } from '$lib/components/ui/badge';
	import { showToast } from '$lib/stores/toast';
	import { Check, MoreHorizontal, Plus, SquarePen, Tag, X } from '@lucide/svelte';
	import type { Document } from '$lib/api/types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { updateDocumentDetails, updateReadingPosition, documents } from '$lib/stores';
	import { updatePreferences } from '$lib/stores/preferences';
	import { documentMarkedAsRead } from '$lib/stores/ui';
	import {
		documentTags,
		getDocumentTags,
		createDocumentTag,
		deleteDocumentTag
	} from '$lib/stores/document-tags';
	import { onMount } from 'svelte';

	export let isRead: boolean;
	export let document: Document;
	export let pageCount: number;
	export let author: string;

	let popoverOpen = false;
	let editDetailsOpen = false;
	let savingDetails = false;
	let editTitle = '';
	let editAuthor = '';
	let savingTag = false;
	let newTagInput = '';
	let showNewTagInput = false;
	let creatingTag = false;

	// Get updated document from store to reflect changes immediately
	$: updatedDocument = $documents.find((d) => d.id === document.id) || document;
	$: documentTag = updatedDocument.tag;

	onMount(async () => {
		await getDocumentTags();
	});

	async function markAsUnread() {
		await updateReadingPosition(document.id, { page_number: 1, progress: 0 });
		showToast('Marked as unread', 'success');
	}

	async function markAsRead() {
		// If page count is unknown, we still allow "mark as read" by moving past page 1.
		const nextPageNumber = pageCount > 0 ? pageCount : 2;
		const progress = pageCount > 0 ? Math.min(nextPageNumber / pageCount, 1) : 1;
		await updateReadingPosition(document.id, {
			page_number: nextPageNumber,
			progress: progress
		});
		// Close popover after marking as read
		popoverOpen = false;
		// Notify that this document was marked as read (triggers tab switch)
		// Use setTimeout to ensure store update is processed first
		setTimeout(() => {
			documentMarkedAsRead.set(document.id);
		}, 0);
	}

	function openEditDetails() {
		editTitle = document.title ?? '';
		editAuthor = author === 'Unknown author' ? '' : author;
		editDetailsOpen = true;
		popoverOpen = false;
	}

	async function saveDetails() {
		if (savingDetails) return;
		savingDetails = true;
		try {
			await updateDocumentDetails(document.id, {
				title: editTitle.trim() || document.title,
				author: editAuthor.trim()
			});
			showToast('Details updated', 'success');
			editDetailsOpen = false;
		} catch (error) {
			console.error('Failed to update details', error);
			showToast('Failed to update details', 'error');
		} finally {
			savingDetails = false;
		}
	}

	async function setDocumentTag(tag: string | undefined) {
		if (savingTag) return;
		savingTag = true;
		try {
			// Store handles optimistic update, so UI updates immediately
			await updateDocumentDetails(document.id, { tag: tag });
			// Success toast (update happens instantly, this confirms backend sync)
		} catch (error) {
			console.error('Failed to update document tag', error);
			// Error toast (store will revert the optimistic update)
			console.error('Failed to update document tag', error);
			showToast('Failed to update tag', 'error');
		} finally {
			savingTag = false;
		}
	}

	async function selectTag(tag: string) {
		// Don't allow selection if there's a pending request
		if (savingTag) {
			return;
		}
		// If clicking the same tag that's already selected, do nothing
		if (documentTag === tag) {
			return;
		}
		// Otherwise, set the new tag
		await setDocumentTag(tag);
	}

	// Create a new tag
	async function createNewTag() {
		if (!newTagInput.trim() || creatingTag) return;

		const tagName = newTagInput.trim();

		// Check if tag already exists
		if ($documentTags.includes(tagName)) {
			showToast('Tag already exists', 'error');
			return;
		}

		creatingTag = true;
		try {
			await createDocumentTag(tagName);
			newTagInput = '';
			showNewTagInput = false;
		} catch (error: any) {
			const errorMessage = error?.message || 'Failed to create tag';
			showToast(errorMessage, 'error');
		} finally {
			creatingTag = false;
		}
	}

	async function deleteTag(tag: string, event: MouseEvent) {
		event.stopPropagation();
		if (creatingTag) return;

		// If this tag is assigned to the current document, remove it first
		if (documentTag === tag) {
			await setDocumentTag(undefined);
		}

		try {
			await deleteDocumentTag(tag);
			showToast(`Tag "${tag}" deleted`, 'success');
		} catch (error: any) {
			const errorMessage = error?.message || 'Failed to delete tag';
			console.error('Failed to delete tag', error);
			showToast(errorMessage, 'error');
		}
	}
</script>

<div>
	<Popover bind:open={popoverOpen}>
		<PopoverTrigger
			type="button"
			class="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/10"
			aria-label="More options"
		>
			<MoreHorizontal class="h-4 w-4 text-slate-600" strokeWidth={1.5} />
		</PopoverTrigger>
		<PopoverContent class="w-64 p-0" align="end">
			<div class="flex flex-col">
				<!-- Mark as read/unread -->
				<button
					type="button"
					class="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 transition hover:bg-black/5"
					onclick={(e) => {
						e.stopPropagation();
						(async () => {
							popoverOpen = false;
							if (isRead) await markAsUnread();
							else await markAsRead();
						})();
					}}
				>
					<Check class="h-4 w-4" strokeWidth={1.5} />
					{isRead ? 'Mark as unread' : 'Mark as read'}
				</button>

				<!-- Edit details -->
				<button
					type="button"
					class="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 transition hover:bg-black/5"
					onclick={(e) => {
						e.stopPropagation();
						openEditDetails();
					}}
				>
					<SquarePen class="h-4 w-4" strokeWidth={1.5} />
					Edit details
				</button>

				<!-- Divider -->
				<div class="border-t border-black/10"></div>

				<!-- Tags section -->
				<div class="px-3 py-2">
					<div class="mb-2 flex items-center gap-2">
						<Tag class="h-4 w-4 text-slate-600" strokeWidth={1.5} />
						<span class="text-xs font-medium text-slate-600">Tag</span>
					</div>

					<!-- Available tags from backend -->
					{#if $documentTags.length > 0}
						<div class="mb-2 flex flex-wrap gap-1.5">
							{#each $documentTags as tag}
								{@const isSelected = documentTag === tag}
								<Badge
									variant={isSelected ? 'default' : 'outline'}
									class="text-xs font-light {savingTag
										? 'cursor-not-allowed opacity-50'
										: isSelected
											? 'cursor-pointer bg-black text-white hover:bg-black/80'
											: 'cursor-pointer hover:bg-black/5'}"
									onclick={(e) => {
										e.stopPropagation();
										if (!savingTag) {
											selectTag(tag);
										}
									}}
								>
									<span>{tag}</span>
									<button
										type="button"
										class="ml-1.5 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-black/20 focus:outline-none"
										onclick={(e) => {
											e.stopPropagation();
											deleteTag(tag, e);
										}}
									>
										<X class="h-2.5 w-2.5" strokeWidth={2} />
									</button>
								</Badge>
							{/each}
						</div>
					{:else}
						<p class="mb-2 text-xs text-slate-500">No tags available</p>
					{/if}

					<!-- Create new tag -->
					{#if showNewTagInput}
						<div class="flex items-center gap-1">
							<input
								type="text"
								bind:value={newTagInput}
								placeholder="Tag name"
								class="flex-1 rounded border border-black/10 px-2 py-1 text-xs focus:ring-1 focus:ring-black/20 focus:outline-none"
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										createNewTag();
									} else if (e.key === 'Escape') {
										showNewTagInput = false;
										newTagInput = '';
									}
								}}
								onclick={(e) => e.stopPropagation()}
								disabled={creatingTag}
							/>
							<button
								type="button"
								class="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-black/10"
								onclick={(e) => {
									e.stopPropagation();
									createNewTag();
								}}
								disabled={creatingTag}
							>
								<Check class="h-3 w-3" strokeWidth={1.5} />
							</button>
							<button
								type="button"
								class="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-black/10"
								onclick={(e) => {
									e.stopPropagation();
									showNewTagInput = false;
									newTagInput = '';
								}}
								disabled={creatingTag}
							>
								<X class="h-3 w-3" strokeWidth={1.5} />
							</button>
						</div>
					{:else}
						<button
							type="button"
							class="mt-1 flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs text-slate-600 transition hover:bg-black/5"
							onclick={(e) => {
								e.stopPropagation();
								showNewTagInput = true;
							}}
						>
							<Plus class="h-3 w-3" strokeWidth={1.5} />
							Create tag
						</button>
					{/if}
				</div>
			</div>
		</PopoverContent>
	</Popover>

	<AlertDialog.Root bind:open={editDetailsOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Edit details</AlertDialog.Title>
				<AlertDialog.Description>Update the document details.</AlertDialog.Description>
			</AlertDialog.Header>

			<div class="space-y-3">
				<div class="space-y-1">
					<label class="text-xs font-medium text-slate-700" for={`title-${document.id}`}
						>Title</label
					>
					<input
						id={`title-${document.id}`}
						class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-black/10 focus:outline-none"
						bind:value={editTitle}
					/>
				</div>
				<div class="space-y-1">
					<label class="text-xs font-medium text-slate-700" for={`author-${document.id}`}
						>Author</label
					>
					<input
						id={`author-${document.id}`}
						class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-black/10 focus:outline-none"
						bind:value={editAuthor}
						placeholder="e.g. Gabriel García Márquez"
					/>
				</div>
			</div>

			<div class="mt-6 flex justify-end gap-2">
				<button
					type="button"
					class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
					onclick={() => (editDetailsOpen = false)}
					disabled={savingDetails}
				>
					Cancel
				</button>
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-lg border bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
					onclick={saveDetails}
					disabled={savingDetails}
					aria-busy={savingDetails}
				>
					{savingDetails ? 'Saving…' : 'Save'}
				</button>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
