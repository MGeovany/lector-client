<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowRight } from '@lucide/svelte';
	import { isAuthenticated, authLoading } from '$lib/stores/auth';

	function handleDashboardClick() {
		if ($isAuthenticated) {
			goto('/');
		} else {
			goto('/register');
		}
	}
</script>

<div class="bg-cream flex h-screen flex-col overflow-hidden text-slate-900">
	<!-- Navigation (Medium-like) -->
	<nav class="shrink-0 border-b border-black/15">
		<div class="mx-auto max-w-6xl px-6 py-3">
			<div class="flex items-center justify-between gap-6">
				<a href="/landing" class="font-brand text-2xl font-bold tracking-tight">Lector</a>

				<div class="flex items-center gap-3 sm:gap-4">
					<div class="hidden items-center gap-5 text-sm text-slate-900/90 md:flex">
						<a class="underline-offset-4 hover:underline" href="/story">the story</a>
						<a class="underline-offset-4 hover:underline" href="/how-it-works">How it works</a>
						<a class="underline-offset-4 hover:underline" href="/support">Support</a>
					</div>

					<button
						type="button"
						on:click={handleDashboardClick}
						class="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
					>
						Get started
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero -->
	<section class="flex flex-1 items-center overflow-hidden border-b border-black/15">
		<div class="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 lg:grid-cols-1">
			<div class="max-w-5xl">
				<p class="mb-3 text-xs font-semibold tracking-[0.18em] text-slate-900/70 uppercase">
					Lector • focused reading
				</p>

				<h1
					class="text-[2.8rem] leading-[0.95] tracking-tight text-slate-950 sm:text-[3.8rem] lg:text-9xl"
					style="font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;"
				>
					Where reading feels right
				</h1>

				<p class="mt-5 max-w-prose text-sm leading-relaxed text-slate-800/80 sm:text-lg">
					Turn long texts into something you actually want to sit with.
				</p>

				<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
					<a
						href="/login"
						class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black/85 sm:w-auto"
					>
						Start reading
						<ArrowRight class="h-4 w-4" />
					</a>
				</div>

				{#if $authLoading}
					<p class="mt-3 text-xs text-slate-700/70">Loading session…</p>
				{/if}
			</div>

			<!-- Hero Image -->
			<!-- 	<div class="hidden lg:block">
				<div
					class="bg-cream relative aspect-4/3 w-full overflow-hidden rounded-[28px] border border-black/15"
				>
					<img
						src="/hero.webp"
						alt="Lector reading experience"
						class="h-full w-full object-cover"
					/>
					<div
						class="bg-cream absolute right-5 bottom-5 left-5 rounded-2xl border border-black/10 p-4"
					>
						<p class="text-sm font-medium text-slate-900/85">Your library, your way</p>
						<p class="mt-1 text-xs text-slate-900/60">Theme, size, spacing, and focus.</p>
					</div>
				</div>
			</div> -->
		</div>
	</section>

	<!-- Footer (simple, Medium-ish) -->
	<footer class="shrink-0 border-t border-black/10">
		<div class="mx-auto max-w-6xl px-6 py-3">
			<div
				class="flex flex-col items-center justify-between gap-2 text-xs text-slate-900/60 sm:flex-row"
			>
				<p>© {new Date().getFullYear()} Lector</p>
				<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
					<a class="underline-offset-4 hover:text-slate-900 hover:underline" href="/about">About</a>
					<a class="underline-offset-4 hover:text-slate-900 hover:underline" href="/privacy"
						>Privacy</a
					>
					<a class="underline-offset-4 hover:text-slate-900 hover:underline" href="/terms">Terms</a>
					<a class="underline-offset-4 hover:text-slate-900 hover:underline" href="/conduct"
						>Community Guidelines</a
					>
					<a class="underline-offset-4 hover:text-slate-900 hover:underline" href="/contact">
						Contact
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
