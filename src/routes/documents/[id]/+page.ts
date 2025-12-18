import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { DocumentAPI } from '$lib/api';
import { documents, loadDocuments } from '$lib/stores/documents';
import { get } from 'svelte/store';
import { findFullId } from '$lib/utils/id';
import { supabase } from '$lib/supabase';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
	let documentId = params.id;

	// If the ID is short (8 chars or less), we need to resolve it to the full UUID
	if (documentId.length <= 8) {
		// Wait for Supabase session to be ready (max 5 seconds)
		let attempts = 0;
		let session = null;

		while (attempts < 50) {
			const { data, error: sessionError } = await supabase.auth.getSession();
			if (!sessionError && data.session) {
				session = data.session;
				break;
			}
			await new Promise((resolve) => setTimeout(resolve, 100));
			attempts++;
		}

		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		// Try to get documents from cache first
		let docs = get(documents);

		// If cache is empty, load documents
		if (docs.length === 0) {
			await loadDocuments(session.user.id);
			docs = get(documents);
		}

		// Try to find the full ID
		const fullId = findFullId(documentId, docs);
		if (fullId) {
			documentId = fullId;
		} else {
			// If still not found, return 404
			throw error(404, 'Document not found');
		}
	}

	// Load the document with the resolved ID
	try {
		const document = await DocumentAPI.getDocument(documentId);
		return {
			document
		};
	} catch (err) {
		console.error('Failed to load document', err);
		// If it's a 404 from the API, throw 404, otherwise throw 500
		const axiosError = err as { response?: { status?: number } };
		if (axiosError?.response?.status === 404) {
			throw error(404, 'Document not found');
		}
		throw error(500, 'Failed to load document');
	}
};
