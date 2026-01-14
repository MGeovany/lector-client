import apiClient from './client';
import type { Document } from './types';

// Backend returns snake_case, so we can use the response directly
function normalizeDocumentResponse(doc): Document {
	return {
		id: doc.id || '',
		user_id: doc.user_id || '',
		title: doc.title || '',
		author: doc.author || undefined,
		description: doc.description || undefined,
		metadata: doc.metadata || {},
		content: doc.content || [],
		tag: doc.tag || undefined,
		is_favorite: doc.is_favorite ?? false,
		reading_position: doc.reading_position || undefined,
		created_at: doc.created_at || '',
		updated_at: doc.updated_at || ''
	};
}

export class DocumentAPI {
	/**
	 * Get all user documents
	 */
	static async getDocumentsByUserID(userID: string): Promise<Document[]> {
		const response = await apiClient.get<Document[]>(`/documents/user/${userID}`);
		return (response.data || []).map(normalizeDocumentResponse);
	}

	/**
	 * Upload a new document
	 */
	static async uploadDocument(file: File): Promise<Document> {
		const formData = new FormData();
		formData.append('file', file);

		const response = await apiClient.post('/documents', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		return normalizeDocumentResponse(response.data);
	}

	/**
	 * Get a specific document
	 */
	static async getDocument(id: string): Promise<Document> {
		const response = await apiClient.get(`/documents/${id}`);
		return normalizeDocumentResponse(response.data);
	}

	/**
	 * Delete a document
	 */
	static async deleteDocument(id: string): Promise<void> {
		await apiClient.delete(`/documents/${id}`);
	}

	/**
	 * Update document details (title/author/tag)
	 */
	static async updateDocument(
		id: string,
		updates: { title?: string; author?: string; tag?: string }
	): Promise<Document> {
		const response = await apiClient.put(`/documents/${id}`, updates);
		return normalizeDocumentResponse(response.data);
	}

	/**
	 * Search documents
	 */
	static async searchDocuments(query: string): Promise<Document[]> {
		const response = await apiClient.get('/documents/search', {
			params: { q: query }
		});
		return (response.data || []).map(normalizeDocumentResponse);
	}

	/**
	 * Get complete library data (documents + positions + preferences)
	 * DEPRECATED: Use getDocumentsByUserID instead
	 */
	static async getLibrary(): Promise<import('./types').LibraryResponse> {
		const response = await apiClient.get<import('./types').LibraryResponse>('/documents/library');
		return response.data;
	}
}
