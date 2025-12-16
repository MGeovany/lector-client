import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		autoRefreshToken: true,
		persistSession: browser, // Only persist session in browser
		detectSessionInUrl: true
	}
});

// Database types (will be generated from Supabase)
export interface Database {
	public: {
		Tables: {
			documents: {
				Row: {
					id: string;
					user_id: string;
					original_name: string;
					title: string;
					content: string; // JSON string
					metadata: string; // JSON string
					file_path: string;
					file_size: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					original_name: string;
					title: string;
					content: string;
					metadata: string;
					file_path: string;
					file_size: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					original_name?: string;
					title?: string;
					content?: string;
					metadata?: string;
					file_path?: string;
					file_size?: number;
					created_at?: string;
					updated_at?: string;
				};
			};
			user_preferences: {
				Row: {
					user_id: string;
					font_size: number;
					font_family: string;
					text_color: string;
					background_color: string;
					line_height: number;
					max_width: number;
					theme: string;
					updated_at: string;
				};
				Insert: {
					user_id: string;
					font_size?: number;
					font_family?: string;
					text_color?: string;
					background_color?: string;
					line_height?: number;
					max_width?: number;
					theme?: string;
					updated_at?: string;
				};
				Update: {
					user_id?: string;
					font_size?: number;
					font_family?: string;
					text_color?: string;
					background_color?: string;
					line_height?: number;
					max_width?: number;
					theme?: string;
					updated_at?: string;
				};
			};
			reading_positions: {
				Row: {
					user_id: string;
					document_id: string;
					position: number;
					page_number: number;
					updated_at: string;
				};
				Insert: {
					user_id: string;
					document_id: string;
					position?: number;
					page_number?: number;
					updated_at?: string;
				};
				Update: {
					user_id?: string;
					document_id?: string;
					position?: number;
					page_number?: number;
					updated_at?: string;
				};
			};
		};
	};
}
