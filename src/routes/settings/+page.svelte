<script lang="ts">
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { sidebarOpen } from '$lib/stores/ui';
	import {
		loadPreferences,
		updatePreferences,
		userPreferences,
		preferencesLoading
	} from '$lib/stores/preferences';
	import { onMount } from 'svelte';
	import { ArrowLeft, Moon, Sun, Type, Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	// Local UI state (kept in sync with store)
	let fontSize = 17;
	let fontFamily = 'roboto';
	let theme: 'day' | 'night' = 'night';

	const fontOptions = [
		{ key: 'roboto', label: 'Roboto' },
		{ key: 'merriweather', label: 'Merriweather' },
		{ key: 'georgia', label: 'Georgia' },
		{ key: 'montserrat', label: 'Montserrat' }
	] as const;

	function syncFromPrefs() {
		const prefs = $userPreferences;
		// Map to reader-style values
		if (prefs?.font_size) fontSize = prefs.font_size;

		// prefs.font_family usually stores label; normalize to key if possible
		const keyFromLabel =
			fontOptions.find((f) => f.label.toLowerCase() === (prefs?.font_family ?? '').toLowerCase())
				?.key ?? fontOptions.find((f) => f.key === (prefs?.font_family ?? '').toLowerCase())?.key;
		if (keyFromLabel) fontFamily = keyFromLabel;

		const t = (prefs?.theme ?? '').toLowerCase();
		if (t === 'day' || t === 'night') theme = t;
		if (t === 'light') theme = 'day';
		if (t === 'dark') theme = 'night';
	}

	let saving = false;
	async function save() {
		saving = true;
		try {
			const selected = fontOptions.find((f) => f.key === fontFamily);
			await updatePreferences({
				font_size: fontSize,
				font_family: selected?.label ?? 'Roboto',
				theme: theme === 'day' ? 'light' : 'dark'
			});
		} finally {
			saving = false;
		}
	}

	onMount(async () => {
		await loadPreferences();
		syncFromPrefs();
	});

	$: if ($userPreferences?.user_id) {
		syncFromPrefs();
	}
</script>

<ProtectedRoute>
	<div class="min-h-screen bg-white">
		<Header />
		<Sidebar />

		<main
			class="min-h-screen pt-14 transition-[padding] duration-300 ease-in-out"
			class:md:pl-60={$sidebarOpen}
			class:md:pl-0={!$sidebarOpen}
		>
			<div class="mx-auto max-w-3xl px-6 py-10">
				<div class="flex items-start justify-between gap-6">
					<div>
						<p class="text-xs tracking-[0.18em] text-slate-500 uppercase">Settings</p>
						<h1 class="mt-3 text-4xl font-light tracking-tight text-slate-950">
							Reading preferences
						</h1>
						<p class="mt-3 max-w-prose text-sm text-slate-600">
							Set your default typography and theme for a comfortable reading experience.
						</p>
					</div>

					<div class="flex items-center gap-2">
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-black/5"
							on:click={() => goto('/profile')}
						>
							<ArrowLeft class="h-4 w-4" strokeWidth={1.5} />
							Profile
						</button>
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-60"
							on:click={save}
							disabled={saving || $preferencesLoading}
							aria-busy={saving || $preferencesLoading}
						>
							<Save class="h-4 w-4" strokeWidth={1.5} />
							{saving ? 'Saving…' : 'Save'}
						</button>
					</div>
				</div>

				<div class="mt-10 grid gap-6">
					<!-- Theme -->
					<section class="rounded-2xl border border-black/10 bg-white p-6">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								{#if theme === 'night'}
									<Moon class="h-5 w-5 text-slate-700" strokeWidth={1.5} />
								{:else}
									<Sun class="h-5 w-5 text-slate-700" strokeWidth={1.5} />
								{/if}
								<h2 class="text-lg font-light text-slate-950">Theme</h2>
							</div>
						</div>
						<div class="mt-4 flex gap-2">
							<button
								type="button"
								class={`rounded-full border px-4 py-2 text-sm transition ${
									theme === 'day'
										? 'border-black bg-black text-white'
										: 'border-black/10 bg-white text-slate-900'
								}`}
								on:click={() => (theme = 'day')}
							>
								Day
							</button>
							<button
								type="button"
								class={`rounded-full border px-4 py-2 text-sm transition ${
									theme === 'night'
										? 'border-black bg-black text-white'
										: 'border-black/10 bg-white text-slate-900'
								}`}
								on:click={() => (theme = 'night')}
							>
								Night
							</button>
						</div>
					</section>

					<!-- Typography -->
					<section class="rounded-2xl border border-black/10 bg-white p-6">
						<div class="flex items-center gap-2">
							<Type class="h-5 w-5 text-slate-700" strokeWidth={1.5} />
							<h2 class="text-lg font-light text-slate-950">Typography</h2>
						</div>

						<div class="mt-6 grid gap-6 sm:grid-cols-2">
							<div>
								<p class="text-xs font-medium text-slate-600">Font</p>
								<div class="mt-2 grid grid-cols-2 gap-2">
									{#each fontOptions as f (f.key)}
										<button
											type="button"
											class={`rounded-xl border px-3 py-2 text-left text-sm transition hover:bg-black/5 ${
												fontFamily === f.key ? 'border-black font-semibold' : 'border-black/10'
											}`}
											on:click={() => (fontFamily = f.key)}
										>
											{f.label}
										</button>
									{/each}
								</div>
							</div>

							<div>
								<p class="text-xs font-medium text-slate-600">Size</p>
								<div class="mt-2 rounded-xl border border-black/10 p-4">
									<div class="flex items-center justify-between">
										<span class="text-sm text-slate-700">Font size</span>
										<span class="text-sm font-medium text-slate-900">{fontSize}px</span>
									</div>
									<input
										class="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-black/10"
										type="range"
										min="12"
										max="26"
										step="1"
										bind:value={fontSize}
										aria-label="Font size"
									/>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	</div>
</ProtectedRoute>
