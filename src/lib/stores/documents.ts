import { writable, get } from 'svelte/store';
import type { Document } from '$lib/api/types';
import { DocumentAPI } from '$lib/api';

function isBadTimestamp(value: string | null | undefined): boolean {
	if (!value) return true;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return true;
	// Backend sometimes returns year 1 / placeholder dates; treat anything pre-2000 as invalid for uploaded_at.
	return date.getFullYear() < 2000;
}

function normalizeDocument(doc: Document): Document {
	const created = doc?.created_at ?? '';
	const updated = doc?.updated_at ?? '';
	const safeCreatedAt = isBadTimestamp(created)
		? isBadTimestamp(updated)
			? ''
			: updated
		: created;
	const safeUpdatedAt = isBadTimestamp(updated) ? safeCreatedAt : updated;

	return {
		...doc,
		created_at: safeCreatedAt,
		updated_at: safeUpdatedAt
	} as Document;
}

function normalizeDocuments(docs: Document[]): Document[] {
	return (docs ?? []).map(normalizeDocument);
}

// Document state
export const documents = writable<Document[]>([]);
export const currentDocument = writable<Document | null>(null);
export const documentsLoading = writable<boolean>(false);
export const isSearchMode = writable<boolean>(false);
export const searchQuery = writable<string>('');
let documentsCache: Document[] | null = null;
let lastLoadTime = 0;
let lastUserID: string | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Load all documents (with caching)
export async function loadDocuments(userID: string, forceRefresh = false) {
	// If user changed, clear cache
	if (lastUserID !== userID) {
		documentsCache = null;
		lastUserID = userID;
	}

	// Return cached data if available and not expired
	const now = Date.now();
	if (!forceRefresh && documentsCache && now - lastLoadTime < CACHE_DURATION) {
		// Get current documents from store
		const currentDocsValue = get(documents);

		// If we have cached data and store is empty or same user, use cache
		// This allows cache to work when navigating back
		if (documentsCache.length > 0 && (currentDocsValue.length === 0 || lastUserID === userID)) {
			documents.set(documentsCache);
			return documentsCache;
		}
	}

	documentsLoading.set(true);
	isSearchMode.set(false);
	searchQuery.set('');
	try {
		const docs = await DocumentAPI.getDocumentsByUserID(userID);
		const normalized = normalizeDocuments(docs);
		documentsCache = normalized;
		lastLoadTime = now;
		lastUserID = userID;
		documents.set(normalized);
		return normalized;
	} catch (error) {
		console.error('Failed to load documents:', error);
		documents.set([]);
		return [];
	} finally {
		documentsLoading.set(false);
	}
}

// Upload document
export async function uploadDocument(file: File) {
	try {
		const document = normalizeDocument(await DocumentAPI.uploadDocument(file));

		documents.update((docs) => [document, ...docs]);
		// Update cache
		const currentDocs = get(documents);
		documentsCache = currentDocs;
		lastLoadTime = Date.now();
		return document;
	} catch (error) {
		console.error('Failed to upload document:', error);
		throw error;
	}
}

// Delete document
export async function deleteDocument(id: string) {
	try {
		await DocumentAPI.deleteDocument(id);
		documents.update((docs) => docs.filter((doc) => doc.id !== id));

		// Update cache
		const currentDocs = get(documents);
		documentsCache = currentDocs;
		lastLoadTime = Date.now();

		// Clear current document if it was deleted
		currentDocument.update((current) => (current?.id === id ? null : current));
	} catch (error) {
		console.error('Failed to delete document:', error);
		throw error;
	}
}

// Update document details (title/author/tag) with optimistic updates
export async function updateDocumentDetails(
	id: string,
	updates: { title?: string; author?: string; tag?: string }
) {
	// Get current document state
	const currentDocs = get(documents);
	const currentDoc = currentDocs.find((d) => d.id === id);

	// Create optimistic update
	const optimisticDoc: Document | null = currentDoc
		? {
			...currentDoc,
			...(updates.title !== undefined && { title: updates.title }),
			...(updates.author !== undefined && { author: updates.author }),
			...(updates.tag !== undefined && { tag: updates.tag }),
			updated_at: new Date().toISOString()
		}
		: null;

	// Apply optimistic update immediately
	if (optimisticDoc) {
		documents.update((docs) => docs.map((d) => (d.id === id ? optimisticDoc : d)));
		// Update cache
		documentsCache = get(documents);
		lastLoadTime = Date.now();
		// Update current document if needed
		currentDocument.update((current) => (current?.id === id ? optimisticDoc : current));
	}

	try {
		// Sync with backend
		const updated = normalizeDocument(await DocumentAPI.updateDocument(id, updates));

		// Update with server response (in case server made additional changes)
		documents.update((docs) => docs.map((d) => (d.id === id ? updated : d)));

		// Update cache
		const finalDocs = get(documents);
		documentsCache = finalDocs;
		lastLoadTime = Date.now();

		// Update current document if needed
		currentDocument.update((current) => (current?.id === id ? updated : current));

		return updated;
	} catch (error) {
		// Revert optimistic update on error
		if (currentDoc) {
			documents.update((docs) => docs.map((d) => (d.id === id ? currentDoc : d)));
			// Update cache
			documentsCache = get(documents);
			lastLoadTime = Date.now();
			// Revert current document if needed
			currentDocument.update((current) => (current?.id === id ? currentDoc : current));
		}
		console.error('Failed to update document:', error);
		throw error;
	}
}

// Load specific document
export async function loadDocument(id: string) {
	try {
		const document = await DocumentAPI.getDocument(id);
		currentDocument.set(document);
		return document;
	} catch (error) {
		console.error('Failed to load document:', error);
		currentDocument.set(null);
		throw error;
	}
}

// Search documents
export async function searchDocuments(query: string) {
	documentsLoading.set(true);
	isSearchMode.set(true);
	searchQuery.set(query);
	try {
		const docs = await DocumentAPI.searchDocuments(query);
		documents.set(docs);
		return docs;
	} catch (error) {
		console.error('Failed to search documents:', error);
		documents.set([]);
		throw error;
	} finally {
		documentsLoading.set(false);
	}
}
