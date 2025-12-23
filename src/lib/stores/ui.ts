import { writable } from 'svelte/store';

// UI state
export const sidebarOpen = writable<boolean>(true);

// Track when a document is marked as read to trigger tab switch
export const documentMarkedAsRead = writable<string | null>(null);
