import { uploadDocument } from '$lib/stores/documents';
import { documents } from '$lib/stores/documents';
import { showToast } from '$lib/stores/toast';
import { get } from 'svelte/store';
import type { Document } from '$lib/api/types';

const MAX_STORAGE_BYTES = 15 * 1024 * 1024; // 15MB

export async function handleFileUpload(setUploading: (value: boolean) => void): Promise<void> {
	setUploading(true);

	try {
		// Check current storage
		const currentDocs = get(documents);
		const totalBytes = currentDocs.reduce(
			(sum: number, doc: Document) => sum + (doc?.file_size ?? 0),
			0
		);
		const isOverLimit = totalBytes >= MAX_STORAGE_BYTES;

		if (isOverLimit) {
			showToast(
				"You're out of storage. If you're enjoying Lector, feel free to reach out and I can increase your space with a special offer.",
				'error'
			);
			setUploading(false);
			return;
		}

		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/pdf';
		input.onchange = async (e) => {
			const selectedFile = (e.target as HTMLInputElement).files?.[0];
			if (!selectedFile) {
				setUploading(false);
				return;
			}

			// Frontend validation against 15MB quota
			const nextUsageBytes = totalBytes + selectedFile.size;
			if (nextUsageBytes > MAX_STORAGE_BYTES) {
				showToast(
					"You're out of storage. If you're enjoying Lector, feel free to reach out and I can increase your space with a special offer.",
					'error'
				);
				(e.target as HTMLInputElement).value = '';
				setUploading(false);
				return;
			}

			try {
				await uploadDocument(selectedFile);
				(e.target as HTMLInputElement).value = '';
				showToast('Book added successfully', 'success');
			} catch (error) {
				console.error('Upload failed', error);
				showToast('Failed to add book', 'error');
			} finally {
				setUploading(false);
			}
		};
		input.click();
	} catch (error) {
		console.error('Upload error', error);
		setUploading(false);
	}
}
