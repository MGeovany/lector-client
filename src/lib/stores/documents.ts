import { writable, get } from 'svelte/store';
import type { Document } from '$lib/api/types';
import { DocumentAPI } from '$lib/api';

// Document state
export const documents = writable<Document[]>([]);
export const currentDocument = writable<Document | null>(null);
export const documentsLoading = writable<boolean>(false);
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
	if (!forceRefresh && documentsCache && (now - lastLoadTime) < CACHE_DURATION) {
		// Get current documents from store
		const currentDocsValue = get(documents);

		// If we have cached data and store is empty or same user, use cache
		// This allows cache to work when navigating back
		if (documentsCache.length > 0 && (currentDocsValue.length === 0 || lastUserID === userID)) {
			documents.set(documentsCache);
			return;
		}
	}

	documentsLoading.set(true);
	try {
		const docs = await DocumentAPI.getDocumentsByUserID(userID);
		documentsCache = docs;
		lastLoadTime = now;
		lastUserID = userID;
		documents.set(docs);
	} catch (error) {
		console.error('Failed to load documents:', error);
		documents.set([]);
	} finally {
		documentsLoading.set(false);
	}
}

// Upload document
export async function uploadDocument(file: File) {
	try {
		const document = await DocumentAPI.uploadDocument(file);
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
