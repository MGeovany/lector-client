import axios from 'axios';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { getSessionToken } from '$lib/stores/auth';

// Create axios instance with base configuration
const api = axios.create({
	baseURL: PUBLIC_API_BASE_URL
});

// Add auth token to requests
api.interceptors.request.use((config) => {
	const token = getSessionToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export interface UserProfile {
	id: string;
	email: string;
	user_metadata: {
		name?: string;
		avatar_url?: string;
	};
	created_at: string;
	updated_at: string;
}

export interface UpdateProfileRequest {
	name: string;
}

// Get current user profile from backend
export async function getUserProfile(): Promise<UserProfile> {
	const response = await api.get('/auth/profile');
	return response.data;
}

// Update user profile
export async function updateUserProfile(data: UpdateProfileRequest): Promise<UserProfile> {
	const response = await api.put('/auth/profile', data);
	return response.data;
}

// Validate current token with backend
export async function validateToken(): Promise<{ valid: boolean; user: UserProfile }> {
	const response = await api.get('/auth/validate');
	return response.data;
}
