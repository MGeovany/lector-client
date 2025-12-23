<script lang="ts">
	import type { TextBlock } from '$lib/api/types';
	import { Loader } from '@lucide/svelte';

	export let blocks: TextBlock[];
	export let loading: boolean;
	export let currentTheme: { text: string };
</script>

{#if loading && blocks.length === 0}
	<div class="py-16 text-center text-sm" style={`color: var(--muted-color);`}>
		<div class="inline-flex items-center gap-2">
			<Loader class="h-5 w-5 animate-spin" style={`color: var(--muted-color);`} />
			<span>Loading…</span>
		</div>
	</div>
{:else if blocks.length}
	<div class="pb-20">
		{#each blocks as block ((block.page_number ?? 0) + '-' + (block.position ?? 0))}
			{#if block.type === 'heading'}
				<h2
					class="mt-10 mb-4 text-2xl leading-snug font-semibold sm:text-3xl"
					style={`color: ${currentTheme.text};`}
				>
					{block.content}
				</h2>
			{:else}
				<p class="mb-6 text-inherit">{block.content}</p>
			{/if}
		{/each}
	</div>
{:else}
	<div class="py-16 text-center text-sm" style={`color: var(--muted-color);`}>No content.</div>
{/if}
