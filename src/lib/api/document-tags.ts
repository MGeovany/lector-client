import apiClient from './client';

export class DocumentTagsAPI {
	static async getDocumentTags(): Promise<string[]> {
		try {
			const response = await apiClient.get<string[]>('/document-tags');
			return response.data;
		} catch (error) {
			console.error('Failed to fetch document tags', error);
			return [];
		}
	}

	static async createDocumentTag(tagName: string): Promise<string> {
		try {
			const response = await apiClient.post<{ name: string }>('/document-tags', {
				name: tagName
			});
			return response.data.name;
		} catch (error) {
			if (error.response?.status === 409) {
				throw new Error('Tag already exists');
			}
			console.error('Failed to create document tag', error);
			throw error;
		}
	}

	static async deleteDocumentTag(tagName: string): Promise<void> {
		try {
			// URL encode the tag name in case it has special characters
			const encodedTagName = encodeURIComponent(tagName);
			await apiClient.delete(`/document-tags/${encodedTagName}`);
		} catch (error) {
			if (error.response?.status === 404) {
				throw new Error('Tag not found');
			}
			console.error('Failed to delete document tag', error);
			throw error;
		}
	}
}
