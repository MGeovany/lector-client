// User types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthToken {
  token: string;
  expires_at: string;
  user: User;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
}

// Document types
export interface TextBlock {
  content: string;
  type: 'paragraph' | 'heading' | 'list' | 'table';
  level: number;
  page_num: number;
  position: number;
}

export interface DocumentMetadata {
  title: string;
  author: string;
  page_count: number;
  file_size: number;
  format: string;
  has_password: boolean;
}

export interface Document {
  id: string;
  user_id: string;
  original_name: string;
  title: string;
  content: TextBlock[];
  metadata: DocumentMetadata;
  file_size: number;
  created_at: string;
  updated_at: string;
}

// Preference types
export interface UserPreferences {
  user_id: string;
  font_size: number;
  font_family: string;
  text_color: string;
  background_color: string;
  line_height: number;
  max_width: number;
  theme: string;
  updated_at: string;
}

export interface ReadingPosition {
  user_id: string;
  document_id: string;
  position: number;
  page_number: number;
  updated_at: string;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ApiError {
  error: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
