// ===============================
// User & Auth
// ===============================

export interface User {
	id: string;
	email: string;
	name?: string;
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

// ===============================
// API
// ===============================

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

// ===============================
// Document Content
// ===============================

export type TextBlockType = 'paragraph' | 'heading' | 'list' | 'table' | 'quote' | 'code';

export interface TextBlock {
	type: TextBlockType;
	content: string;

	level?: number;
	page_number?: number;
	position?: number;
}

// ===============================
// Document Metadata
// ===============================

export type DocumentSource = 'upload' | 'web' | 'note';

export interface DocumentMetadata {
	original_title?: string;
	original_author?: string;

	language?: string;
	page_count?: number;
	word_count?: number;
	file_size?: number;

	format?: string;
	source?: DocumentSource;
	has_password?: boolean;
}

// ===============================
// Documents
// ===============================

export interface Document {
	id: string;
	user_id: string;

	title: string;
	author?: string;
	description?: string;

	metadata: DocumentMetadata;
	content: TextBlock[];

	tag?: string;
	is_favorite?: boolean;
	reading_position?: ReadingPosition;

	created_at: string;
	updated_at: string;
}

// ===============================
// User Preferences
// ===============================

export type Theme = 'light' | 'dark' | 'system';

export interface UserPreferences {
	user_id: string;

	font_size: number;
	font_family: string;
	theme: Theme;
	tags: string[]; // Default tags available for documents

	updated_at: string;
}

// ===============================
// Reading Position
// ===============================

export interface ReadingPosition {
	user_id: string;
	document_id: string;

	progress: number;
	page_number: number;

	updated_at: string;
}

// ===============================
// Combined / View Models
// ===============================

export interface DocumentWithReadingPosition {
	document: Document;
	reading_position?: ReadingPosition;
}

export interface LibraryResponse {
	documents: DocumentWithReadingPosition[];
}
