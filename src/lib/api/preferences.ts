import apiClient from './client';
import type { UserPreferences, ReadingPosition } from './types';

export class PreferenceAPI {
	/**
	 * Get user preferences
	 */
	static async getPreferences(): Promise<UserPreferences> {
		const response = await apiClient.get<UserPreferences>('/preferences');
		return response.data;
	}

	/**
	 * Update user preferences
	 */
	static async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
		const response = await apiClient.put<UserPreferences>('/preferences', preferences);
		return response.data;
	}

	/**
	 * Get reading position for a document
	 */
	static async getReadingPosition(documentId: string): Promise<ReadingPosition> {
		const response = await apiClient.get<ReadingPosition>(
			`/preferences/reading-position/${documentId}`
		);
		return response.data;
	}

	/**
	 * Update reading position for a document
	 */
	static async updateReadingPosition(
		documentId: string,
		position: Partial<ReadingPosition>
	): Promise<ReadingPosition> {
		const response = await apiClient.put<ReadingPosition>(
			`/preferences/reading-position/${documentId}`,
			position
		);
		return response.data;
	}
}
