<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { fly, fade } from 'svelte/transition';

	export let show: boolean;
	export let onBack: () => void;
	export let currentTheme: { bg: string; text: string; border: string; bgContainer: string };
</script>

{#if show}
	<div
		class="fixed top-4 left-4 z-40"
		in:fly={{ y: -8, duration: 180 }}
		out:fade={{ duration: 120 }}
	>
		<button
			type="button"
			class="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-light shadow-sm backdrop-blur transition hover:opacity-90"
			style={`border-color: ${currentTheme.border}; background: ${currentTheme.bgContainer}CC; color: ${currentTheme.text};`}
			on:click={onBack}
			aria-label="Back"
		>
			<ArrowLeft class="h-4 w-4" strokeWidth={1.75} />
			Back
		</button>
	</div>
{/if}
