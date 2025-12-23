<script lang="ts">
	import type { Document, TextBlock } from '$lib/api/types';
	import { ArrowLeft } from '@lucide/svelte';

	export let document: Document | null;
	export let currentTheme: { text: string; muted: string };
	export let onBack: () => void;

	function formatDate(dateString: string): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}

	function estimateReadMinutes(blocks: TextBlock[]): number {
		const text = blocks.map((b) => b.content || '').join(' ');
		const words = text.trim().split(/\s+/).filter(Boolean).length;
		return Math.max(1, Math.round(words / 200));
	}
</script>

<div class="mb-8">
	<button
		type="button"
		class="mb-6 inline-flex items-center gap-2 rounded-full p-2 text-sm transition hover:bg-black/5"
		style={`color: var(--muted-color);`}
		on:click={onBack}
		aria-label="Back to library"
	>
		<ArrowLeft class="h-4 w-4" strokeWidth={1.75} />
	</button>

	<p class="text-xs tracking-[0.22em] uppercase" style={`color: var(--muted-color);`}>
		{document?.tag || 'Document'}
	</p>

	<h1
		class="mt-3 text-4xl leading-tight font-light sm:text-5xl"
		style={`color: ${currentTheme.text};`}
	>
		{document?.title ?? 'Untitled document'}
	</h1>

	<div
		class="mx-auto my-12 grid max-w-2xl grid-cols-3 justify-items-center gap-6 text-xs sm:text-sm"
	>
		<div class="text-left">
			<p class="text-[11px] tracking-[0.18em] uppercase" style={`color: var(--muted-color);`}>
				Date
			</p>
			<p class="mt-1" style={`color: ${currentTheme.text};`}>
				{formatDate(document?.created_at ?? '')}
			</p>
		</div>
		<div class="text-center">
			<p class="text-[11px] tracking-[0.18em] uppercase" style={`color: var(--muted-color);`}>
				Author
			</p>
			<p class="mt-1" style={`color: ${currentTheme.text};`}>
				{document?.author || document?.metadata?.original_author || '—'}
			</p>
		</div>
		<div class="text-right">
			<p class="text-[11px] tracking-[0.18em] uppercase" style={`color: var(--muted-color);`}>
				Read
			</p>
			<p class="mt-1" style={`color: ${currentTheme.text};`}>
				{estimateReadMinutes(document?.content ?? [])} min read
			</p>
		</div>
	</div>
</div>
