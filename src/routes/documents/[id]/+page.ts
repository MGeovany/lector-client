import type { PageLoad } from './$types';
import { DocumentAPI } from '$lib/api';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
	const document = await DocumentAPI.getDocument(params.id);

	return {
		document
	};
};
