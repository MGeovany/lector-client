import type { PageLoad } from './$types';
import { DocumentAPI } from '$lib/api';
import { documents, loadDocuments } from '$lib/stores/documents';
import { get } from 'svelte/store';
import { findFullId } from '$lib/utils/id';
import { currentUser } from '$lib/stores/auth';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
	let documentId = params.id;
	
	// If the ID is short (8 chars or less), try to find the full ID
	if (documentId.length <= 8) {
		let docs = get(documents);
		
		// If cache is empty, try to load documents first
		if (docs.length === 0) {
			const user = get(currentUser);
			if (user?.id) {
				await loadDocuments(user.id);
				docs = get(documents);
			}
		}
		
		const fullId = findFullId(documentId, docs);
		if (fullId) {
			documentId = fullId;
		} else {
			// If still not found, throw error
			throw new Error(`Document with ID ${documentId} not found`);
		}
	}
	
	const document = await DocumentAPI.getDocument(documentId);

	return {
		document
	};
};
