import { writable } from 'svelte/store';
import type { UserPreferences, ReadingPosition } from '$lib/api/types';
import { PreferenceAPI } from '$lib/api';

// Default preferences
const defaultPreferences: UserPreferences = {
	user_id: '',
	font_size: 16,
	font_family: 'system-ui',
	theme: 'light',
	tags: [],
	updated_at: new Date().toISOString()
};

// Preference state
export const userPreferences = writable<UserPreferences>(defaultPreferences);
export const readingPositions = writable<Map<string, ReadingPosition>>(new Map());
export const preferencesLoading = writable<boolean>(false);

// Normalize preferences from backend (handles both PascalCase and snake_case)
function normalizePreferences(prefs): UserPreferences {
	return {
		user_id: prefs.user_id || prefs.UserID || '',
		font_size: prefs.font_size || prefs.FontSize || 16,
		font_family: prefs.font_family || prefs.FontFamily || 'system-ui',
		theme: (prefs.theme || prefs.Theme || 'light') as 'light' | 'dark' | 'system',
		tags: prefs.tags || prefs.Tags || [],
		updated_at: prefs.updated_at || prefs.UpdatedAt || new Date().toISOString()
	};
}

// Load user preferences
export async function loadPreferences(): Promise<UserPreferences> {
	preferencesLoading.set(true);
	try {
		const prefs = await PreferenceAPI.getPreferences();
		const normalized = normalizePreferences(prefs);
		userPreferences.set(normalized);
		return normalized;
	} catch (error) {
		console.error('Failed to load preferences:', error);
		userPreferences.set(defaultPreferences);
		return defaultPreferences;
	} finally {
		preferencesLoading.set(false);
	}
}

// Update preferences
export async function updatePreferences(updates: Partial<UserPreferences>) {
	try {
		const updatedPrefs = await PreferenceAPI.updatePreferences(updates);
		userPreferences.set(updatedPrefs);
		return updatedPrefs;
	} catch (error) {
		console.error('Failed to update preferences:', error);
		throw error;
	}
}

// Load reading position for a document
export async function loadReadingPosition(documentId: string) {
	try {
		const position = await PreferenceAPI.getReadingPosition(documentId);
		readingPositions.update((positions) => {
			positions.set(documentId, position);
			return positions;
		});
		return position;
	} catch (error) {
		console.error('Failed to load reading position:', error);
		throw error;
	}
}

// Update reading position
export async function updateReadingPosition(documentId: string, updates: Partial<ReadingPosition>) {
	try {
		const position = await PreferenceAPI.updateReadingPosition(documentId, updates);
		readingPositions.update((positions) => {
			positions.set(documentId, position);
			return positions;
		});
		return position;
	} catch (error) {
		console.error('Failed to update reading position:', error);
		throw error;
	}
}
