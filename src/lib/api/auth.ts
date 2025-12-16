import apiClient from './client';
import type { AuthToken, LoginRequest, User, UserUpdate } from './types';

export class AuthAPI {
  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<AuthToken> {
    const response = await apiClient.post<AuthToken>('/auth/login', data);

    // Store token and user data
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UserUpdate): Promise<User> {
    const response = await apiClient.put<User>('/users/profile', data);

    // Update stored user data
    localStorage.setItem('user', JSON.stringify(response.data));

    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Get stored auth token
   */
  static getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
