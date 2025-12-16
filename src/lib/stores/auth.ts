import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { supabase } from '$lib/supabase';

// Auth state
export const isAuthenticated = writable<boolean>(false);
export const currentUser = writable<User | null>(null);
export const authLoading = writable<boolean>(true);
// TODO: Add type for session
export const session = writable<any>(null);

console.log(session, 'SSESSION');

// Initialize auth state from Supabase
export function initializeAuth() {
	// Get initial session
	supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
		session.set(initialSession);
		if (initialSession) {
			isAuthenticated.set(true);
			currentUser.set(initialSession.user);
		}
		authLoading.set(false);
	});

	// Listen for auth changes
	supabase.auth.onAuthStateChange((event, newSession) => {
		session.set(newSession);
		if (newSession) {
			isAuthenticated.set(true);
			currentUser.set(newSession.user);
		} else {
			isAuthenticated.set(false);
			currentUser.set(null);
		}
		authLoading.set(false);
	});
}

// Login with Google (OAuth)
export async function loginWithGoogle() {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: browser ? `${window.location.origin}/login` : undefined
		}
	});

	if (error) {
		throw error;
	}

	return data;
}

// Logout function
export async function logout() {
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw error;
	}
}

// Get current session token for API calls
export function getSessionToken(): string | null {
	let currentSession: any = null;
	session.subscribe((s) => (currentSession = s))();
	return currentSession?.access_token || null;
}
