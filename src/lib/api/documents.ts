import apiClient from './client';
import type { Document } from './types';

export class DocumentAPI {
	/**
	 * Get all user documents
	 */
	static async getDocumentsByUserID(userID: string): Promise<Document[]> {
		const response = await apiClient.get<Document[]>(`/documents/user/${userID}`);
		return response.data;
	}

	/**
	 * Upload a new document
	 */
	static async uploadDocument(file: File): Promise<Document> {
		const formData = new FormData();
		formData.append('file', file);

		const response = await apiClient.post<Document>('/documents', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		return response.data;
	}

	/**
	 * Get a specific document
	 */
	static async getDocument(id: string): Promise<Document> {
		const response = await apiClient.get<Document>(`/documents/${id}`);
		return response.data;
	}

	/**
	 * Delete a document
	 */
	static async deleteDocument(id: string): Promise<void> {
		await apiClient.delete(`/documents/${id}`);
	}

	/**
	 * Search documents
	 */
	static async searchDocuments(query: string): Promise<Document[]> {
		const response = await apiClient.get<Document[]>('/documents/search', {
			params: { q: query }
		});
		return response.data;
	}
}
