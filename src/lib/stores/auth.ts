import { get, writable } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { supabase } from '$lib/supabase';

// Auth state
export const isAuthenticated = writable<boolean>(false);
export const currentUser = writable<User | null>(null);
export const authLoading = writable<boolean>(true);
export const session = writable<Session | null>(null);
export const authError = writable<string | null>(null);

// Initialize auth state from Supabase
export function initializeAuth() {
	if (!browser) return;

	// Get initial session
	supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
		if (error) {
			console.error('Error getting session:', error);
			authError.set(error.message);
		}

		session.set(initialSession);
		if (initialSession) {
			isAuthenticated.set(true);
			currentUser.set(initialSession.user);
		}
		authLoading.set(false);
	});

	// Listen for auth changes
	supabase.auth.onAuthStateChange((event, newSession) => {
		console.log('Auth state changed:', event, newSession?.user?.email);

		session.set(newSession);
		if (newSession) {
			isAuthenticated.set(true);
			currentUser.set(newSession.user);
			authError.set(null);
		} else {
			isAuthenticated.set(false);
			currentUser.set(null);
		}
		authLoading.set(false);
	});
}

// Login with email and password
export async function loginWithEmail(email: string, password: string) {
	authError.set(null);
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		authError.set(error.message);
		throw error;
	}

	return data;
}

// Register with email and password
export async function registerWithEmail(email: string, password: string, name?: string) {
	authError.set(null);
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				name: name || ''
			}
		}
	});

	if (error) {
		authError.set(error.message);
		throw error;
	}

	return data;
}

// Login with Google (OAuth)
export async function loginWithGoogle() {
	authError.set(null);
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: browser ? `${window.location.origin}/` : undefined
		}
	});

	if (error) {
		authError.set(error.message);
		throw error;
	}

	return data;
}

// Reset password
export async function resetPassword(email: string) {
	authError.set(null);
	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: browser ? `${window.location.origin}/reset-password` : undefined
	});

	if (error) {
		authError.set(error.message);
		throw error;
	}

	return data;
}

// Logout function
export async function logout() {
	authError.set(null);
	const { error } = await supabase.auth.signOut();
	if (error) {
		authError.set(error.message);
		throw error;
	}

	// Redirect to login after successful logout
	if (browser) {
		window.location.href = '/login';
	}
}

// Get current session token for API calls
export function getSessionToken(): string | null {
	return get(session)?.access_token ?? null;
}
