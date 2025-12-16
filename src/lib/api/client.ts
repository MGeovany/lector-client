import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
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
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
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
    // Handle 401 Unauthorized - sign out from Supabase
    if (error.response?.status === 401) {
      const { supabase } = await import('$lib/supabase');
      await supabase.auth.signOut();
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
