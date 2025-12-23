<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let hudBg: string;
	export let hudBorder: string;
	export let hudText: string;

	let shouldShow = true;
	let timer: ReturnType<typeof setTimeout> | null = null;

	export let onScrollUp: (() => void) | null = null;
	export let onScrollDown: (() => void) | null = null;

	function handleKeyDown(event: KeyboardEvent) {
		// Hide when user uses arrow keys to navigate
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			shouldShow = false;
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
		}
		// Handle scroll with arrow up/down
		if (event.key === 'ArrowUp' && onScrollUp) {
			event.preventDefault();
			onScrollUp();
		} else if (event.key === 'ArrowDown' && onScrollDown) {
			event.preventDefault();
			onScrollDown();
		}
	}

	onMount(() => {
		// Hide after 2 minutes (120,000ms)
		timer = setTimeout(() => {
			shouldShow = false;
		}, 120000);

		// Listen for arrow key presses
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
		window.removeEventListener('keydown', handleKeyDown);
	});
</script>

{#if shouldShow}
	<div class="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2">
		<div
			class="rounded-full border px-4 py-2 text-xs shadow-sm backdrop-blur"
			style={`background: ${hudBg}; border-color: ${hudBorder}; color: ${hudText};`}
		>
			<span class="font-medium">Tip:</span>
			Use <span class="mx-1 rounded border border-black/10 bg-white px-1.5 py-0.5">←</span> /
			<span class="mx-1 rounded border border-black/10 bg-white px-1.5 py-0.5">→</span> to switch pages,
			<span class="mx-1 rounded border border-black/10 bg-white px-1.5 py-0.5">↑</span> /
			<span class="mx-1 rounded border border-black/10 bg-white px-1.5 py-0.5">↓</span> to scroll
		</div>
	</div>
{/if}
