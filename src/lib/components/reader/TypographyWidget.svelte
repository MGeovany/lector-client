<script lang="ts">
	import { Type, X, Plus, Minus } from '@lucide/svelte';
	import { fade, scale } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';

	export let fontSize: number;
	export let fontFamily: string;
	export let fontOptions: ReadonlyArray<{
		readonly key: string;
		readonly label: string;
		readonly stack: string;
	}>;
	export let currentTheme: { text: string; bg: string; border: string; muted: string };

	export let onFontSizeChange: (size: number) => void;
	export let onFontFamilyChange: (family: string) => void;

	let isOpen = false;
	let widgetRef: HTMLDivElement;

	function toggleWidget() {
		isOpen = !isOpen;
	}

	function handleFontSizeChange(delta: number) {
		const newSize = Math.max(12, Math.min(24, fontSize + delta));
		onFontSizeChange(newSize);
	}

	function handleFontFamilySelect(family: string) {
		onFontFamilyChange(family);
	}

	function handleClickOutside(event: MouseEvent) {
		if (widgetRef && !widgetRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	$: if (isOpen) {
		document.addEventListener('click', handleClickOutside);
	} else {
		document.removeEventListener('click', handleClickOutside);
	}

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="relative" bind:this={widgetRef}>
	<!-- Toggle Button -->
	<button
		type="button"
		class="group fixed top-4 right-25 z-40 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur transition hover:scale-105 focus:outline-none"
		style={`background: ${currentTheme.bg}; border-color: ${currentTheme.border}; color: ${currentTheme.text};`}
		on:click={toggleWidget}
		aria-label="Typography settings"
		aria-expanded={isOpen}
	>
		{#if isOpen}
			<X class="pointer-events-none h-4 w-4" strokeWidth={1.5} />
		{:else}
			<Type class="pointer-events-none h-4 w-4" strokeWidth={1.5} />
		{/if}
	</button>

	<!-- Widget Panel -->
	{#if isOpen}
		<div
			class="fixed top-14 right-4 z-40 w-72 rounded-2xl border shadow-2xl backdrop-blur"
			style={`background: ${currentTheme.bg}; border-color: ${currentTheme.border};`}
			transition:scale={{ duration: 200, start: 0.9 }}
		>
			<div class="p-5">
				<!-- Header -->
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-sm font-light" style={`color: ${currentTheme.text};`}>Typography</h3>
				</div>

				<!-- Font Size Control -->
				<div class="mb-5">
					<div class="mb-2 flex items-center justify-between">
						<span class="text-xs font-medium" style={`color: ${currentTheme.muted};`}> Size </span>
						<span class="text-xs font-light" style={`color: ${currentTheme.text};`}>
							{fontSize}px
						</span>
					</div>
					<div class="flex items-center gap-3">
						<button
							type="button"
							class="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-black/5 disabled:opacity-40"
							style={`border-color: ${currentTheme.border}; color: ${currentTheme.text};`}
							on:click={() => handleFontSizeChange(-1)}
							disabled={fontSize <= 12}
							aria-label="Decrease font size"
						>
							<Minus class="h-4 w-4" strokeWidth={2} />
						</button>
						<div class="flex-1">
							<input
								type="range"
								min="12"
								max="24"
								value={fontSize}
								on:input={(e) => onFontSizeChange(Number(e.currentTarget.value))}
								class="h-2 w-full cursor-pointer appearance-none rounded-lg"
								style={`background: ${currentTheme.border};`}
								aria-label="Font size"
							/>
						</div>
						<button
							type="button"
							class="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-black/5 disabled:opacity-40"
							style={`border-color: ${currentTheme.border}; color: ${currentTheme.text};`}
							on:click={() => handleFontSizeChange(1)}
							disabled={fontSize >= 24}
							aria-label="Increase font size"
						>
							<Plus class="h-4 w-4" strokeWidth={2} />
						</button>
					</div>
				</div>

				<!-- Font Family Control -->
				<div>
					<span class="mb-2 block text-xs font-medium" style={`color: ${currentTheme.muted};`}>
						Font
					</span>
					<div class="grid grid-cols-2 gap-2">
						{#each fontOptions as font}
							<button
								type="button"
								class="rounded-lg border px-3 py-2.5 text-left text-sm transition hover:bg-black/5"
								class:ring-inset={fontFamily === font.key}
								style={`border-color: ${
									fontFamily === font.key ? currentTheme.text : currentTheme.border
								}; color: ${currentTheme.text}; font-family: ${font.stack};`}
								on:click={() => handleFontFamilySelect(font.key)}
							>
								{font.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
