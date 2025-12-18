<script lang="ts">
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import type { Document, TextBlock } from '$lib/api/types';
	import { goto } from '$app/navigation';
	import { ArrowLeft, ChevronLeft, ChevronRight, Moon, Sun, Type } from '@lucide/svelte';
	import TextPreference from '$lib/components/TextPreference.svelte';

	export let data: { document: Document };

	const fontOptions = [
		{
			key: 'montserrat',
			label: 'Montserrat',
			stack: '"Montserrat", "Helvetica Neue", Arial, sans-serif'
		},
		{
			key: 'helvetica',
			label: 'Helvetica',
			stack: 'Helvetica, "Helvetica Neue", Arial, sans-serif'
		},
		{
			key: 'merriweather',
			label: 'Merriweather',
			stack: '"Merriweather", Georgia, serif'
		},
		{
			key: 'georgia',
			label: 'Georgia',
			stack: 'Georgia, "Times New Roman", serif'
		}
	] as const;

	type FontKey = (typeof fontOptions)[number]['key'];

	let theme: 'day' | 'night' = 'day';
	let fontSize = 18;
	let fontFamily: FontKey = fontOptions[2].key;
	let lineHeight = 1.7;
	let currentPage = 1;
	let showControls = false;

	let documentData: Document | null = data?.document ?? null;
	let mutedClass = 'text-slate-500';

	$: documentData = data?.document ?? null;
	$: selectedFont = fontOptions.find((font) => font.key === fontFamily) ?? fontOptions[2];
	$: pages = groupContentByPage(documentData?.content ?? []);
	$: totalPages = documentData?.metadata?.page_count || pages.length || 1;
	$: currentPage = clamp(currentPage, 1, totalPages);
	$: displayedBlocks = pages[currentPage - 1] ?? [];
	$: progressPercent = Math.min(100, Math.max(0, (currentPage / totalPages) * 100));
	$: mutedClass = theme === 'night' ? 'text-slate-400' : 'text-slate-500';

	function groupContentByPage(content: TextBlock[]) {
		const grouped = new Map<number, TextBlock[]>();

		for (const block of content) {
			const pageBlocks = grouped.get(block.page_num) ?? [];
			pageBlocks.push(block);
			grouped.set(block.page_num, pageBlocks);
		}

		return Array.from(grouped.entries())
			.sort(([a], [b]) => a - b)
			.map(([, blocks]) => blocks.sort((a, b) => a.position - b.position));
	}

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function nextPage() {
		if (currentPage < totalPages) currentPage += 1;
	}

	function previousPage() {
		if (currentPage > 1) currentPage -= 1;
	}

	function goBack() {
		goto('/dashboard');
	}

	function toggleControls() {
		showControls = !showControls;
	}
</script>

<svelte:head>
	<title>{documentData?.title ? `${documentData.title} — Lector` : 'Lector'}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Merriweather:wght@400;700&family=Space+Grotesk:wght@400;600&display=swap"
	/>
</svelte:head>

<ProtectedRoute>
	<div
		class={`h-screen ${theme === 'night' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
	>
		<div class="mx-auto flex h-full max-w-4xl flex-1 flex-col px-4 py-6">
			<div
				class={`flex h-full flex-col overflow-hidden rounded-3xl border shadow-xl ${theme === 'night' ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`}
			>
				<header
					class={`flex items-center justify-between border-b px-4 py-3 ${theme === 'night' ? 'border-slate-800' : 'border-slate-200'}`}
				>
					<div class="flex items-center gap-3">
						<button
							class={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-semibold transition ${theme === 'night' ? 'border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-100'}`}
							on:click={goBack}
							aria-label="Back to library"
						>
							<ArrowLeft class="h-5 w-5" />
						</button>
						<div class="text-left">
							<h1 class="text-lg leading-tight font-semibold">
								{documentData?.title ?? 'Untitled document'}
							</h1>
							<p class={`text-sm ${mutedClass}`}>
								{documentData?.metadata?.author ?? documentData?.original_name ?? 'Unknown author'}
							</p>
						</div>
					</div>
					<button
						class={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${theme === 'night' ? 'border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'}`}
						type="button"
						on:click={toggleControls}
						aria-expanded={showControls}
					>
						<Type class="h-5 w-5" />
						<span>Aa</span>
					</button>
				</header>

				<main class="flex flex-1 flex-col min-h-0">
					<section class="flex flex-1 flex-col min-h-0">
						<div
							class={`flex flex-1 flex-col overflow-y-auto px-6 py-6 ${theme === 'night' ? 'bg-slate-900/40' : 'bg-white/60'}`}
							style={`font-family: ${selectedFont.stack}; font-size: ${fontSize}px; line-height: ${lineHeight};`}
							aria-live="polite"
						>
							{#if documentData && displayedBlocks.length}
								<div class="flex flex-col">
									{#each displayedBlocks as block (block.page_num + '-' + block.position)}
										{#if block.type === 'heading'}
											<h2
												class={`mb-4 leading-tight font-semibold ${theme === 'night' ? 'text-slate-50' : 'text-slate-900'}`}
												style={`font-size: ${Math.min(fontSize + 10, 36)}px;`}
											>
												{block.content}
											</h2>
										{:else}
											<p class="mb-4 text-inherit">{block.content}</p>
										{/if}
									{/each}
								</div>
							{:else if documentData}
								<div
									class={`flex flex-1 items-center justify-center text-center text-sm ${mutedClass}`}
								>
									No content on this page.
								</div>
							{:else}
								<div
									class={`flex flex-1 items-center justify-center text-center text-sm ${mutedClass}`}
								>
									Loading book…
								</div>
							{/if}
						</div>
					</section>

					{#if showControls}
						<TextPreference
							{theme}
							{fontSize}
							{fontFamily}
							{mutedClass}
							{fontOptions}
							on:themeChange={(event) => (theme = event.detail as 'day' | 'night')}
							on:fontSizeChange={(event) => (fontSize = Number(event.detail))}
							on:fontFamilyChange={(event) => (fontFamily = event.detail as FontKey)}
						/>
					{/if}

					<footer
						class={`flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${theme === 'night' ? 'border-slate-800' : 'border-slate-200'}`}
					>
						<div class="flex flex-1 flex-col gap-2">
							<div
								class={`h-2 w-full overflow-hidden rounded-full ${theme === 'night' ? 'bg-slate-800' : 'bg-slate-200'}`}
							>
								<span
									class="block h-full rounded-full bg-gradient-to-r from-slate-400 to-slate-500 transition-all"
									style={`width: ${progressPercent}%;`}
								></span>
							</div>
							<p class={`text-sm ${mutedClass}`}>
								<span class="font-semibold text-slate-500">{progressPercent.toFixed(0)}%</span> read
								· page {currentPage} of {totalPages}
							</p>
						</div>
						<div class="flex gap-2">
							<button
								type="button"
								class={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${theme === 'night' ? 'border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'}`}
								on:click={previousPage}
								disabled={currentPage === 1}
							>
								<ChevronLeft class="h-4 w-4" />
								Previous
							</button>
							<button
								type="button"
								class={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${theme === 'night' ? 'border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'}`}
								on:click={nextPage}
								disabled={currentPage === totalPages}
							>
								Next
								<ChevronRight class="h-4 w-4" />
							</button>
						</div>
					</footer>
				</main>
			</div>
		</div>
	</div>
</ProtectedRoute>
