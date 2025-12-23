import { DocumentTagsAPI } from '$lib/api/document-tags';
import { get } from 'svelte/store';
import { writable } from 'svelte/store';

// Document tags state
export const documentTags = writable<string[]>([]);

export async function getDocumentTags() {
	try {
		const tags = await DocumentTagsAPI.getDocumentTags();
		documentTags.set(tags);
	} catch (error) {
		documentTags.set([]);
		console.error('Failed to fetch document tags', error);
		return [];
	}
}

export async function createDocumentTag(tagName: string): Promise<string> {
	// Optimistic update: add tag immediately
	const currentTags = get(documentTags);
	if (currentTags.includes(tagName)) {
		// Tag already exists, return it
		return tagName;
	}

	// Add tag optimistically
	const optimisticTags = [...currentTags, tagName].sort();
	documentTags.set(optimisticTags);

	try {
		// Sync with backend
		const createdTag = await DocumentTagsAPI.createDocumentTag(tagName);
		// Update with server response (in case server normalized the name)
		const finalTags = get(documentTags);
		if (!finalTags.includes(createdTag)) {
			documentTags.set([...finalTags, createdTag].sort());
		}
		return createdTag;
	} catch (error) {
		// Revert optimistic update on error
		documentTags.set(currentTags);
		console.error('Failed to create document tag', error);
		throw error;
	}
}

export async function deleteDocumentTag(tagName: string): Promise<void> {
	// Optimistic update: remove tag immediately
	const currentTags = get(documentTags);
	if (!currentTags.includes(tagName)) {
		// Tag doesn't exist, nothing to do
		return;
	}

	// Remove tag optimistically
	const optimisticTags = currentTags.filter((t) => t !== tagName);
	documentTags.set(optimisticTags);

	try {
		// Sync with backend
		await DocumentTagsAPI.deleteDocumentTag(tagName);
		// Store is already updated, no need to update again
	} catch (error) {
		// Revert optimistic update on error
		documentTags.set(currentTags);
		console.error('Failed to delete document tag', error);
		throw error;
	}
}
