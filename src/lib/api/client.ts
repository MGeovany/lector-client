import axios, { AxiosHeaders, type AxiosInstance, type AxiosResponse } from 'axios';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

// API Configuration
const API_BASE_URL = PUBLIC_API_BASE_URL;

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000, // 30 seconds
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true // Enable cookies for session management
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	async (config) => {
		// Get token from Supabase session
		const { supabase } = await import('$lib/supabase');
		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (session?.access_token) {
			config.headers ??= new AxiosHeaders();
			const headers = config.headers as AxiosHeaders;
			if (typeof headers.set === 'function') {
				headers.set('Authorization', `Bearer ${session.access_token}`);
			} else {
				(headers as Record<string, string>).Authorization = `Bearer ${session.access_token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error) => {
		// Handle 401 Unauthorized:
		// - Don't sign the user out of Supabase (a backend 401 shouldn't destroy the auth session).
		// - Try a one-time session refresh + retry in case the token rotated/expired.
		if (error.response?.status === 401 && error.config && !error.config.__retriedAfterRefresh) {
			error.config.__retriedAfterRefresh = true;

			const { supabase } = await import('$lib/supabase');
			const { data, error: refreshError } = await supabase.auth.refreshSession();

			if (!refreshError && data.session?.access_token) {
				error.config.headers ??= new AxiosHeaders();
				const headers = error.config.headers as AxiosHeaders;
				if (typeof headers.set === 'function') {
					headers.set('Authorization', `Bearer ${data.session.access_token}`);
				} else {
					(headers as Record<string, string>).Authorization = `Bearer ${data.session.access_token}`;
				}

				return apiClient.request(error.config);
			}
		}
		return Promise.reject(error);
	}
);

export default apiClient;
