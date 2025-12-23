<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import type { Document, TextBlock } from '$lib/api/types';
	import { goto } from '$app/navigation';
	import TextPreference from '$lib/components/TextPreference.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import ArticleHeader from '$lib/components/reader/ArticleHeader.svelte';
	import ArticleContent from '$lib/components/reader/ArticleContent.svelte';
	import BottomPager from '$lib/components/reader/BottomPager.svelte';
	import BackButton from '$lib/components/reader/BackButton.svelte';
	import GameHint from '$lib/components/reader/GameHint.svelte';
	import TypographyWidget from '$lib/components/reader/TypographyWidget.svelte';
	import {
		updateReadingPosition,
		updatePreferences,
		loadPreferences,
		userPreferences,
		readingPositions
	} from '$lib/stores/preferences';
	import { currentUser } from '$lib/stores/auth';
	import { get } from 'svelte/store';

	export let data: { document: Document };

	let contentContainer: HTMLDivElement;
	let preferencesPanel: HTMLDivElement;
	let touchStartX = 0;
	let touchEndX = 0;

	const fontOptions = [
		{
			key: 'roboto',
			label: 'Roboto',
			stack: '"Roboto", system-ui, sans-serif'
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
		},
		{
			key: 'montserrat',
			label: 'Montserrat',
			stack: '"Montserrat", "Helvetica Neue", Arial, sans-serif'
		}
	] as const;

	type FontKey = (typeof fontOptions)[number]['key'];

	// Theme definitions with recommended colors for reduced eye strain
	const themes = {
		day: {
			name: 'Day',
			bg: '#FAFAFA', // Optimal light background
			text: '#222222', // Optimal light text
			bgContainer: '#FFFFFF',
			border: '#E5E7EB',
			muted: '#6B7280'
		},
		night: {
			name: 'Night',
			bg: '#121212', // Optimal dark background (recommended)
			text: '#E6E6E6', // Optimal dark text (recommended)
			bgContainer: '#1E1E1E',
			border: '#2D2D2D',
			muted: '#B3B3B3'
		}
	} as const;

	type ThemeKey = keyof typeof themes;

	// Initialize from store if available, otherwise use defaults
	function initializePreferencesFromStore() {
		const prefs = get(userPreferences);
		if (prefs && prefs.user_id) {
			// Preferences are already loaded in store
			// Map backend theme (light/dark) to frontend theme (day/night)
			let themeValue: 'day' | 'night' = 'night'; // default
			const themeStr = String(prefs.theme);
			if (themeStr === 'light' || themeStr === 'day') {
				themeValue = 'day';
			} else if (themeStr === 'dark' || themeStr === 'night') {
				themeValue = 'night';
			}

			const fontKey = fontOptions.find(
				(f) =>
					f.key === prefs.font_family?.toLowerCase() ||
					f.label.toLowerCase() === prefs.font_family?.toLowerCase()
			)?.key;
			return {
				theme: themeValue as ThemeKey,
				fontSize: prefs.font_size || 17,
				fontFamily: (fontKey || fontOptions[0].key) as FontKey
			};
		}
		// Return defaults
		return {
			theme: 'night' as ThemeKey,
			fontSize: 17,
			fontFamily: fontOptions[0].key as FontKey,
			lineHeight: 1.6
		};
	}

	const initialPrefs = initializePreferencesFromStore();
	let theme: ThemeKey = initialPrefs.theme;
	let fontSize = initialPrefs.fontSize;
	let fontFamily: FontKey = initialPrefs.fontFamily;
	let lineHeight = initialPrefs.lineHeight;
	let showControls = false;
	let preferencesApplied = false;
	let savingPosition = false;
	let loadingPosition = false;
	let preferencesLoaded = false;
	let positionLoaded = false;
	let showBack = false;
	let lastScrollTop = 0;
	let hudTimer: ReturnType<typeof setTimeout> | null = null;
	$: hudBg = theme === 'night' ? 'rgba(30, 30, 30, 0.82)' : 'rgba(255, 255, 255, 0.82)';
	$: hudBorder = theme === 'night' ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.10)';
	$: hudText = currentTheme.text;

	let documentData: Document | null = data?.document ?? null;

	// Normalize document data to handle different payload formats
	$: documentData = data?.document ? normalizeDocument(data.document) : null;
	$: selectedFont = fontOptions.find((font) => font.key === fontFamily) ?? fontOptions[0];
	$: pages = groupContentByPage(documentData?.content ?? []);
	$: totalPages = getPageCount(documentData);

	// Initialize currentPage from store if available, otherwise default to 1
	function initializePositionFromStore() {
		if (!documentData?.id) return 1;
		const positions = get(readingPositions);
		const savedPosition = positions.get(documentData.id);
		if (savedPosition?.page_number && totalPages > 0) {
			return Math.min(savedPosition.page_number, totalPages);
		}
		return 1;
	}

	let currentPage = 1;

	// Initialize position from store when documentData becomes available
	$: if (documentData?.id && !positionLoaded && totalPages > 0) {
		const initialPage = initializePositionFromStore();
		if (initialPage !== 1) {
			currentPage = initialPage;
			positionLoaded = true; // Mark as loaded to prevent re-initialization
		}
	}

	$: currentPage = clamp(currentPage, 1, totalPages);
	$: displayedBlocks = pages[currentPage - 1] ?? [];
	$: currentTheme = themes[theme];
	$: themeStyles = `background: ${currentTheme.bg}; color: ${currentTheme.text}; --bg-container: ${currentTheme.bgContainer}; --border-color: ${currentTheme.border}; --muted-color: ${currentTheme.muted};`;

	// Normalize document - backend returns snake_case
	function normalizeDocument(doc: any): Document {
		// Normalize metadata (backend returns snake_case)
		const metadata = doc.metadata || {};
		const normalizedMetadata = {
			original_title: metadata.original_title || doc.title || '',
			original_author: metadata.original_author || doc.author || '',
			language: metadata.language,
			page_count: metadata.page_count || 0,
			word_count: metadata.word_count || 0,
			file_size: metadata.file_size || 0,
			format: metadata.format || 'pdf',
			source: metadata.source,
			has_password: metadata.has_password || false
		};

		// Normalize content (ensure it's an array of TextBlock)
		let normalizedContent: TextBlock[] = [];
		if (Array.isArray(doc.content)) {
			normalizedContent = doc.content.map((block: any) => ({
				content: block.content || '',
				type: (block.type || 'paragraph') as
					| 'paragraph'
					| 'heading'
					| 'list'
					| 'table'
					| 'quote'
					| 'code',
				level: block.level || 0,
				page_number: block.page_number || 1,
				position: block.position || 0
			}));
		}

		return {
			id: doc.id,
			user_id: doc.user_id,
			title: doc.title || normalizedMetadata.original_title || '',
			author: doc.author || normalizedMetadata.original_author || undefined,
			description: doc.description || undefined,
			content: normalizedContent,
			metadata: normalizedMetadata,
			tag: doc.tag || undefined,
			created_at: doc.created_at || '',
			updated_at: doc.updated_at || ''
		};
	}

	function getPageCount(doc: Document | null): number {
		if (!doc) return 1;

		// Try metadata first (backend returns page_count in snake_case)
		const metadataPageCount = doc.metadata?.page_count;
		if (metadataPageCount && metadataPageCount > 0) {
			return metadataPageCount;
		}

		// Fallback to counting unique pages in content
		if (doc.content && doc.content.length > 0) {
			const uniquePages = new Set(doc.content.map((block) => block.page_number));
			return Math.max(uniquePages.size, 1);
		}

		return 1;
	}

	function groupContentByPage(content: TextBlock[]) {
		const grouped = new Map<number, TextBlock[]>();

		for (const block of content) {
			const pageNum = block.page_number || 1;
			const pageBlocks = grouped.get(pageNum) ?? [];
			pageBlocks.push(block);
			grouped.set(pageNum, pageBlocks);
		}

		return Array.from(grouped.entries())
			.sort(([a], [b]) => a - b)
			.map(([, blocks]) => blocks.sort((a, b) => (a.position || 0) - (b.position || 0)));
	}

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	async function nextPage() {
		if (currentPage < totalPages) {
			// Scroll to top immediately before changing page
			if (contentContainer) {
				contentContainer.scrollTop = 0;
			}
			// Change page immediately after scroll
			currentPage += 1;
			// Save position in background (don't await)
			savePosition();
		}
	}

	async function previousPage() {
		if (currentPage > 1) {
			// Scroll to top immediately before changing page
			if (contentContainer) {
				contentContainer.scrollTop = 0;
			}
			// Change page immediately after scroll
			currentPage -= 1;
			// Save position in background (don't await)
			savePosition();
		}
	}

	function goBack() {
		goto('/');
	}

	async function savePosition() {
		if (!documentData?.id || savingPosition) return;
		savingPosition = true;
		try {
			// Calculate progress based on current page and total pages
			const progress = totalPages > 0 ? Math.min(currentPage / totalPages, 1) : 0;

			await updateReadingPosition(documentData.id, {
				page_number: currentPage,
				progress: progress
			});
		} catch (error) {
			console.error('Failed to save reading position:', error);
		} finally {
			savingPosition = false;
		}
	}

	async function loadSavedPosition() {
		if (!documentData?.id || positionLoaded) return;

		// Check if position is already in store (from previous load)
		const positions = get(readingPositions);
		const savedPosition = positions.get(documentData.id);
		if (savedPosition?.page_number) {
			// Apply position from store immediately to avoid flash
			currentPage = Math.min(savedPosition.page_number, totalPages);
			positionLoaded = true;
			console.log('Applied position from store:', currentPage);
			return;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		// Don't handle if user is typing in an input
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			nextPage();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			previousPage();
		} else if (event.key === 'ArrowUp' && contentContainer) {
			event.preventDefault();
			contentContainer.scrollBy({ top: -100, behavior: 'smooth' });
		} else if (event.key === 'ArrowDown' && contentContainer) {
			event.preventDefault();
			contentContainer.scrollBy({ top: 100, behavior: 'smooth' });
		}
	}

	function handleScrollUp() {
		if (contentContainer) {
			contentContainer.scrollBy({ top: -100, behavior: 'smooth' });
		}
	}

	function handleScrollDown() {
		if (contentContainer) {
			contentContainer.scrollBy({ top: 100, behavior: 'smooth' });
		}
	}

	function handleTouchStart(event: TouchEvent) {
		revealHud();
		touchStartX = event.touches[0].clientX;
	}

	function handleTouchEnd(event: TouchEvent) {
		touchEndX = event.changedTouches[0].clientX;
		handleSwipe();
	}

	function handleSwipe() {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swipe left - next page
				nextPage();
			} else {
				// Swipe right - previous page
				previousPage();
			}
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (!showControls) return;

		// Check if click is outside the preferences panel and the toggle button
		const target = event.target as HTMLElement;
		if (
			preferencesPanel &&
			!preferencesPanel.contains(target) &&
			!target.closest('button[aria-expanded]')
		) {
			showControls = false;
		}
	}

	async function loadSavedPreferences() {
		if (preferencesLoaded) return;

		// Check if preferences are already in store (from previous load)
		const storePrefs = get(userPreferences);
		if (storePrefs && storePrefs.user_id && !preferencesApplied) {
			// Apply preferences from store immediately to avoid flash
			console.log('Applying preferences from store:', storePrefs);
			applyPreferences(storePrefs);
			preferencesApplied = true;
			preferencesLoaded = true;
			return;
		}

		preferencesLoaded = true; // Set early to prevent multiple calls
		try {
			console.log('Loading saved preferences from API...');
			const prefs = await loadPreferences();
			console.log('Loaded preferences from API:', prefs);
			if (!preferencesApplied) {
				applyPreferences(prefs);
				preferencesApplied = true;
			}
		} catch (error) {
			console.error('Failed to load preferences:', error);
			// If preferences don't exist yet, that's okay - use defaults
		}
	}

	function applyPreferences(prefs: any) {
		// Map backend preferences to local state
		// Use explicit assignments to trigger reactivity
		console.log('Applying preferences:', prefs);

		// Always apply font_size if present
		if (prefs.font_size !== undefined && prefs.font_size !== null && prefs.font_size > 0) {
			fontSize = Number(prefs.font_size);
			console.log('✓ Set font size to:', fontSize);
		} else {
			console.log('⚠ Font size not found or invalid:', prefs.font_size);
		}

		// Always apply font_family if present
		if (prefs.font_family) {
			// Map font family string to FontKey
			// Backend stores label (e.g., "Roboto", "Montserrat"), we need to find matching key
			const fontKey = fontOptions.find(
				(f) =>
					f.key === prefs.font_family.toLowerCase() ||
					f.label.toLowerCase() === prefs.font_family.toLowerCase()
			)?.key;
			if (fontKey) {
				fontFamily = fontKey;
				console.log('✓ Set font family to:', fontFamily, 'from backend:', prefs.font_family);
			} else {
				console.warn(
					'⚠ Could not find font key for:',
					prefs.font_family,
					'available keys:',
					fontOptions.map((f) => f.key)
				);
			}
		} else {
			console.log('⚠ Font family not found:', prefs.font_family);
		}

		// Always apply theme if present
		if (prefs.theme) {
			const themeStr = String(prefs.theme);
			if (themeStr === 'light' || themeStr === 'day') {
				theme = 'day';
			} else if (themeStr === 'dark' || themeStr === 'night') {
				theme = 'night';
			}
			console.log('✓ Set theme to:', theme, 'from backend:', prefs.theme);
		} else {
			console.log('⚠ Theme not found:', prefs.theme);
		}

		if (prefs.line_height && prefs.line_height > 0) {
			lineHeight = prefs.line_height;
			console.log('✓ Set line height to:', lineHeight);
		}
	}

	async function savePreferences() {
		if (!$currentUser?.id) return;
		try {
			const selectedFont = fontOptions.find((f) => f.key === fontFamily);
			// Map frontend theme (day/night) to backend theme (light/dark)
			const backendTheme = theme === 'day' ? 'light' : 'dark';
			await updatePreferences({
				font_size: fontSize,
				font_family: selectedFont?.label || 'Roboto',
				theme: backendTheme
			});
		} catch (error) {
			console.error('Failed to save preferences:', error);
		}
	}

	onMount(() => {
		// Load saved preferences first (don't await - let it run in background)
		loadSavedPreferences();
		loadSavedPosition();

		// Add keyboard listeners
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('mousemove', revealHud);

		// Add click outside listener
		document.addEventListener('click', handleClickOutside);

		// Return cleanup function
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('mousemove', revealHud);
			document.removeEventListener('click', handleClickOutside);
		};
	});

	onDestroy(() => {
		savePosition();
		if (hudTimer) clearTimeout(hudTimer);
	});

	function handleReaderScroll() {
		if (!contentContainer) return;
		const st = contentContainer.scrollTop;
		const scrollingUp = st < lastScrollTop;
		lastScrollTop = st;

		// show only after user is "in the article"
		if (st > 120 && scrollingUp) showBack = true;
		if (!scrollingUp && st > 160) showBack = false;
		if (st <= 80) showBack = false;
	}

	function revealHud() {
		if (hudTimer) {
			clearTimeout(hudTimer);
			hudTimer = null;
		}
	}
</script>

<svelte:head>
	<title>{documentData?.title ? `Lector | ${documentData.title}` : 'Lector'}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Montserrat:wght@400;600&family=Merriweather:wght@400;700&display=swap"
	/>
	<style>
		/* Orange text selection */
		::selection {
			background-color: rgba(251, 146, 60, 0.3);
			color: inherit;
		}
		::-moz-selection {
			background-color: rgba(251, 146, 60, 0.3);
			color: inherit;
		}
	</style>
</svelte:head>

<ProtectedRoute>
	<div class="fixed inset-0 h-screen overflow-hidden" style={themeStyles}>
		<!-- Back button (appears when scrolling up) -->
		<BackButton show={showBack} onBack={goBack} {currentTheme} />

		<!-- Theme toggle (floating) -->
		<div class="fixed top-4 right-4 z-40">
			<ThemeToggle
				value={theme}
				{currentTheme}
				on:change={(e) => {
					theme = e.detail;
					savePreferences();
				}}
			/>
		</div>

		<!-- Typography Widget -->
		<TypographyWidget
			{fontSize}
			{fontFamily}
			{fontOptions}
			{currentTheme}
			onFontSizeChange={(size) => {
				fontSize = size;
				savePreferences();
			}}
			onFontFamilyChange={(family) => {
				fontFamily = family as FontKey;
				savePreferences();
			}}
		/>

		<!-- Bottom pager (always available) -->
		<BottomPager
			{currentPage}
			{totalPages}
			onPrevious={previousPage}
			onNext={nextPage}
			{hudBg}
			{hudBorder}
			{hudText}
		/>

		<!-- Game Hint -->
		<GameHint
			{hudBg}
			{hudBorder}
			{hudText}
			onScrollUp={handleScrollUp}
			onScrollDown={handleScrollDown}
		/>

		<!-- Clean article reader -->
		<div
			bind:this={contentContainer}
			class="h-full overflow-y-auto px-4 py-10 sm:px-6"
			on:scroll={handleReaderScroll}
			on:touchstart={handleTouchStart}
			on:touchend={handleTouchEnd}
			style={`font-family: ${selectedFont.stack}; font-size: ${fontSize}px; line-height: ${lineHeight}; background-color: ${currentTheme.bg}; color: ${currentTheme.text};`}
		>
			<div class="mx-auto w-full max-w-3xl">
				<ArticleHeader document={documentData} {currentTheme} onBack={goBack} />

				<ArticleContent
					blocks={displayedBlocks}
					loading={loadingPosition && !documentData}
					{currentTheme}
				/>
			</div>
		</div>

		<!-- Keep typography panel accessible via existing handler if needed (hidden by default) -->
		{#if showControls}
			<div class="fixed inset-x-0 bottom-0 z-50" bind:this={preferencesPanel}>
				<TextPreference
					{theme}
					{fontSize}
					{fontFamily}
					{fontOptions}
					{themes}
					on:themeChange={(event) => {
						theme = event.detail as ThemeKey;
						savePreferences();
					}}
					on:fontSizeChange={(event) => {
						fontSize = Number(event.detail);
						savePreferences();
					}}
					on:fontFamilyChange={(event) => {
						fontFamily = event.detail as FontKey;
						savePreferences();
					}}
				/>
			</div>
		{/if}
	</div>
</ProtectedRoute>
