<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	export let currentPage: number;
	export let totalPages: number;
	export let onPrevious: () => void;
	export let onNext: () => void;
	export let hudBg: string;
	export let hudBorder: string;
	export let hudText: string;
</script>

<div class="fixed bottom-15 left-1/2 z-40 -translate-x-1/2">
	<div
		class="flex items-center gap-1 rounded-full border p-1 shadow-lg backdrop-blur"
		style={`background: ${hudBg}; border-color: ${hudBorder}; color: ${hudText};`}
	>
		<button
			type="button"
			class="inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-black/5 focus:outline-none disabled:opacity-40"
			on:click={onPrevious}
			disabled={currentPage === 1}
			aria-label="Previous page"
		>
			<ChevronLeft class="h-5 w-5" strokeWidth={1.75} />
		</button>
		<div class="px-2 text-xs">
			<span class="font-semibold">{currentPage}</span>/<span>{totalPages}</span>
		</div>
		<button
			type="button"
			class="inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-black/5 focus:outline-none disabled:opacity-40"
			on:click={onNext}
			disabled={currentPage === totalPages}
			aria-label="Next page"
		>
			<ChevronRight class="h-5 w-5" strokeWidth={1.75} />
		</button>
	</div>
</div>
