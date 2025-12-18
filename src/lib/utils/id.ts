/**
 * Shorten a UUID to a shorter ID for URLs
 * Takes the first 8 characters (before first hyphen)
 */
export function shortenId(id: string): string {
	if (!id) return '';
	// Remove hyphens and take first 8 characters
	return id.replace(/-/g, '').substring(0, 8);
}

import type { Document } from '$lib/api/types';

/**
 * Find a full document ID from a short ID
 * Searches through documents to find matching ID
 */
export function findFullId(shortId: string, documents: Document[]): string | null {
	if (!shortId || !documents) return null;

	// Remove hyphens from short ID for comparison
	const normalizedShort = shortId.replace(/-/g, '').substring(0, 8);

	// Find document whose ID starts with the short ID
	const found = documents.find((doc) => {
		const normalizedDocId = doc.id?.replace(/-/g, '').substring(0, 8);
		return normalizedDocId === normalizedShort;
	});

	return found?.id || null;
}
