<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Moon, Sun } from '@lucide/svelte';

	type ThemeKey = 'day' | 'night';
	export let value: ThemeKey = 'night';
	export let currentTheme: {
		bg: string;
		text: string;
		border: string;
		bgContainer: string;
	} | null = null;

	const dispatch = createEventDispatcher<{ change: ThemeKey }>();

	function toggle() {
		const next: ThemeKey = value === 'night' ? 'day' : 'night';
		dispatch('change', next);
	}

	// Use theme colors if provided, otherwise use defaults
	$: buttonBg = currentTheme ? `${currentTheme.bgContainer}CC` : 'rgba(255, 255, 255, 0.8)';
	$: buttonBorder = currentTheme ? currentTheme.border : 'rgba(0, 0, 0, 0.1)';
	$: buttonText = currentTheme ? currentTheme.text : '#1e293b';
	$: toggleBg = currentTheme
		? value === 'night'
			? 'rgba(255, 255, 255, 0.2)'
			: 'rgba(0, 0, 0, 0.05)'
		: 'rgba(0, 0, 0, 0.05)';
	$: toggleCircle = currentTheme ? currentTheme.bgContainer : '#ffffff';
	$: iconColor = currentTheme ? currentTheme.text : '#64748b';
</script>

<button
	type="button"
	on:click={toggle}
	class="group inline-flex items-center gap-2 rounded-full border px-2.5 py-2 shadow-sm backdrop-blur transition hover:opacity-90"
	style={`border-color: ${buttonBorder}; background: ${buttonBg}; color: ${buttonText};`}
	aria-label="Toggle theme"
>
	<div class="relative h-7 w-14 rounded-full p-1" style={`background: ${toggleBg};`}>
		<div
			class="absolute top-1 left-1 h-5 w-5 rounded-full shadow transition-all duration-300 ease-out"
			style={`transform: translateX(${value === 'night' ? 28 : 0}px); background: ${toggleCircle};`}
		></div>
		<div class="relative z-10 flex h-5 items-center justify-between px-0.5">
			<Sun class="h-4 w-4" style={`color: ${iconColor};`} strokeWidth={1.5} />
			<Moon class="h-4 w-4" style={`color: ${iconColor};`} strokeWidth={1.5} />
		</div>
	</div>
</button>
