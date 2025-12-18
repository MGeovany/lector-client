<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Moon, Sun } from '@lucide/svelte';

	type FontOption = {
		key: string;
		label: string;
		stack: string;
	};

	type Theme = 'day' | 'night';

	const dispatch = createEventDispatcher<{
		themeChange: Theme;
		fontSizeChange: number;
		fontFamilyChange: FontOption['key'];
	}>();

	export let theme: Theme = 'day';
	export let fontSize = 18;
	export let fontFamily: FontOption['key'] = 'merriweather';
export let mutedClass = 'text-slate-500';
export let fontOptions: ReadonlyArray<FontOption> = [];
// Slider fill percentage to drive the iOS-like gradient
$: sliderPercent = Math.min(100, Math.max(0, ((fontSize - 15) / 11) * 100));

	function setTheme(next: Theme) {
		if (theme !== next) {
			theme = next;
			dispatch('themeChange', next);
		}
	}

	function setFontFamily(next: FontOption['key']) {
		if (fontFamily !== next) {
			fontFamily = next;
			dispatch('fontFamilyChange', next);
		}
	}

	function handleSizeInput(event: Event) {
		const next = Number((event.currentTarget as HTMLInputElement)?.value ?? fontSize);
		fontSize = next;
		dispatch('fontSizeChange', next);
	}
</script>

<section
	data-theme={theme}
	class={`border-t px-5 py-5 transition ${theme === 'night' ? 'border-slate-800 bg-slate-900 text-slate-50' : 'border-slate-200 bg-slate-50 text-slate-900'}`}
>
	<div class="space-y-5">
		<div>
			<p class={`text-xs font-semibold tracking-[0.18em] uppercase ${mutedClass}`}>Size</p>
			<div class="mt-2 flex items-center gap-3">
				<span class={`text-sm font-semibold ${mutedClass}`}>Aa</span>
				<input
					type="range"
					min="15"
					max="26"
					step="1"
					value={fontSize}
					on:input={handleSizeInput}
					class="slider-ios"
					style={`--slider-percent:${sliderPercent}%;`}
					aria-label="Adjust font size"
				/>
				<span class="text-base font-semibold text-slate-700">Aa</span>
			</div>
		</div>

		<div>
			<p class={`text-xs font-semibold tracking-[0.18em] uppercase ${mutedClass}`}>Theme</p>
			<div class="mt-2 grid grid-cols-2 gap-3">
				<button
					type="button"
					class={`motion-pill flex items-center justify-center gap-2 rounded-full border px-3 py-3 text-sm font-semibold ${
						theme === 'day'
							? 'border-sky-300 bg-sky-100 text-slate-900 shadow-[0_12px_26px_rgba(56,189,248,0.25)]'
							: 'border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800'
					}`}
					on:click={() => setTheme('day')}
					aria-pressed={theme === 'day'}
					data-active={theme === 'day'}
				>
					<Sun class="h-4 w-4" /> Day
				</button>
				<button
					type="button"
					class={`motion-pill flex items-center justify-center gap-2 rounded-full border px-3 py-3 text-sm font-semibold ${
						theme === 'night'
							? 'border-sky-300 bg-sky-100 text-slate-900 shadow-[0_12px_26px_rgba(56,189,248,0.25)]'
							: 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
					}`}
					on:click={() => setTheme('night')}
					aria-pressed={theme === 'night'}
					data-active={theme === 'night'}
				>
					<Moon class="h-4 w-4" /> Night
				</button>
			</div>
		</div>

		<div>
			<p class={`text-xs font-semibold tracking-[0.18em] uppercase ${mutedClass}`}>Fonts</p>
			<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each fontOptions as font}
						<button
							type="button"
							class={`motion-pill rounded-full border px-3 py-3 text-sm font-semibold ${
								fontFamily === font.key
									? theme === 'night'
										? 'border-sky-300 bg-sky-100 text-slate-900 shadow-[0_12px_26px_rgba(56,189,248,0.25)]'
										: 'border-slate-200 bg-slate-100 text-slate-900 shadow-[0_12px_26px_rgba(0,0,0,0.08)]'
									: theme === 'night'
										? 'border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800'
										: 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
							}`}
							style={`font-family: ${font.stack};`}
							on:click={() => setFontFamily(font.key)}
							aria-pressed={fontFamily === font.key}
							data-active={fontFamily === font.key}
						>
							{font.label}
						</button>
					{/each}
			</div>
		</div>
	</div>
</section>

<style>
	section[data-theme='day'] .slider-ios {
		--slider-track: #e5e7eb;
		--slider-fill: #38bdf8;
		--slider-thumb: #ffffff;
		--slider-shadow: 0 8px 18px rgba(56, 189, 248, 0.24);
	}

	section[data-theme='night'] .slider-ios {
		--slider-track: #0f172a;
		--slider-fill: #38bdf8;
		--slider-thumb: #0b1220;
		--slider-shadow: 0 8px 18px rgba(56, 189, 248, 0.28);
	}

	.slider-ios {
		appearance: none;
		width: 100%;
		height: 14px;
		border-radius: 999px;
		background: linear-gradient(
			to right,
			var(--slider-fill) 0%,
			var(--slider-fill) var(--slider-percent, 50%),
			var(--slider-track) var(--slider-percent, 50%),
			var(--slider-track) 100%
		);
		outline: none;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12);
		transition: background 160ms ease;
	}

	.slider-ios:focus-visible {
		box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.35);
	}

	.slider-ios::-webkit-slider-thumb {
		appearance: none;
		height: 22px;
		width: 22px;
		border-radius: 50%;
		background: var(--slider-thumb);
		border: 2px solid rgba(255, 255, 255, 0.28);
		box-shadow: var(--slider-shadow);
		transition: transform 140ms ease, box-shadow 160ms ease;
	}

	.slider-ios:hover::-webkit-slider-thumb {
		transform: scale(1.04);
		box-shadow: 0 10px 24px rgba(56, 189, 248, 0.32);
	}

	.slider-ios:active::-webkit-slider-thumb {
		transform: scale(0.96);
	}

	.slider-ios::-moz-range-track {
		height: 14px;
		border-radius: 999px;
		background: transparent;
	}

	.slider-ios::-moz-range-progress {
		height: 14px;
		border-radius: 999px 0 0 999px;
		background: var(--slider-fill);
	}

	.slider-ios::-moz-range-thumb {
		height: 22px;
		width: 22px;
		border-radius: 50%;
		background: var(--slider-thumb);
		border: 2px solid rgba(255, 255, 255, 0.28);
		box-shadow: var(--slider-shadow);
		transition: transform 140ms ease, box-shadow 160ms ease;
	}

	.slider-ios:hover::-moz-range-thumb {
		transform: scale(1.04);
		box-shadow: 0 10px 24px rgba(56, 189, 248, 0.32);
	}

	.slider-ios:active::-moz-range-thumb {
		transform: scale(0.96);
	}

	.motion-pill {
		transition:
			transform 180ms cubic-bezier(0.2, 0.8, 0.25, 1),
			box-shadow 200ms ease,
			filter 200ms ease;
	}

	.motion-pill:hover {
		transform: translateY(-1px) scale(1.01);
	}

	.motion-pill:active {
		transform: translateY(0) scale(0.98);
	}

	.motion-pill[data-active='true'] {
		transform: translateY(-2px);
	}

	@media (prefers-reduced-motion: reduce) {
		.motion-pill {
			transition: none;
		}

		.motion-pill:hover,
		.motion-pill:active,
		.motion-pill[data-active='true'] {
			transform: none;
		}
	}
</style>
