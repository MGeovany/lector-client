import { writable } from 'svelte/store';
import type { UserPreferences, ReadingPosition } from '$lib/api/types';
import { PreferenceAPI } from '$lib/api';

// Default preferences
const defaultPreferences: UserPreferences = {
  user_id: '',
  font_size: 16,
  font_family: 'system-ui',
  text_color: '#000000',
  background_color: '#ffffff',
  line_height: 1.5,
  max_width: 800,
  theme: 'light',
  updated_at: new Date().toISOString()
};

// Preference state
export const userPreferences = writable<UserPreferences>(defaultPreferences);
export const readingPositions = writable<Map<string, ReadingPosition>>(new Map());
export const preferencesLoading = writable<boolean>(false);

// Load user preferences
export async function loadPreferences() {
  preferencesLoading.set(true);
  try {
    const prefs = await PreferenceAPI.getPreferences();
    userPreferences.set(prefs);
  } catch (error) {
    console.error('Failed to load preferences:', error);
    userPreferences.set(defaultPreferences);
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
    readingPositions.update(positions => {
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
    readingPositions.update(positions => {
      positions.set(documentId, position);
      return positions;
    });
    return position;
  } catch (error) {
    console.error('Failed to update reading position:', error);
    throw error;
  }
}
