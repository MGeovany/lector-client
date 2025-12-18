<script lang="ts">
	import { goto } from '$app/navigation';
	import { BookOpen, Moon, Sun, Type, ArrowRight } from '@lucide/svelte';
	import { isAuthenticated, authLoading } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	function handleDashboardClick() {
		if ($isAuthenticated) {
			goto('/');
		} else {
			goto('/login');
		}
	}
</script>

<div class="flex h-screen flex-col bg-white">
	<!-- Navigation -->
	<nav class="flex-shrink-0 border-b border-slate-100">
		<div class="mx-auto max-w-6xl px-6 py-4">
			<div class="flex items-center justify-between">
				<div class="text-xl font-semibold tracking-wide text-slate-900 uppercase">Lector</div>
				<div class="flex items-center gap-4">
					<button
						type="button"
						on:click={handleDashboardClick}
						class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
					>
						Library
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section
		class="mx-auto flex min-h-0 flex-1 items-center justify-center px-6 py-8 text-center sm:py-12"
	>
		<div class="max-w-4xl">
			<h1
				class="mb-4 text-4xl font-semibold tracking-tight text-slate-900 sm:mb-6 sm:text-5xl lg:text-6xl"
			>
				Simple reader<br />
				for simple <span class="font-black">readers</span>
			</h1>
			<p class="mx-auto mb-8 max-w-2xl text-base text-slate-600 sm:mb-10 sm:text-lg lg:text-xl">
				Lector transforms your PDFs into a comfortable reading experience. Customize themes, fonts,
				and preferences to read exactly how you want.
			</p>
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="/register"
					class="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-base font-medium text-white transition hover:bg-black/80"
				>
					Get started
					<ArrowRight class="h-4 w-4" />
				</a>
				<a
					href="/login"
					class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-900 transition hover:bg-slate-50"
				>
					Sign in
				</a>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="flex-shrink-0 border-t border-slate-100 bg-white">
		<div class="mx-auto max-w-6xl px-6 py-4 sm:py-6">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p class="text-sm text-slate-500">Lector</p>
				<div class="flex items-center gap-4 text-sm text-slate-500">
					<a href="mailto:marlon.castro@thefndrs.com" class="transition hover:text-slate-900">
						Contact
					</a>
					<a
						href="https://github.com/MGeovany/lector-server"
						target="_blank"
						rel="noopener noreferrer"
						class="transition hover:text-slate-900"
					>
						GitHub
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
