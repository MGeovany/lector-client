<script lang="ts">
	import { goto } from '$app/navigation';
	import { BookOpen, Moon, Sun, Type, ArrowRight } from '@lucide/svelte';
</script>

<div class="h-screen bg-white">
	<!-- Navigation -->
	<nav class="border-b border-slate-100">
		<div class="mx-auto max-w-6xl px-6 py-4">
			<div class="flex items-center justify-between">
				<div class="text-xl font-semibold tracking-wide text-slate-900 uppercase">Lector</div>
				<div class="flex items-center gap-4">
					<a
						href="/"
						class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
					>
						Dashboard
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section
		class="mx-auto h-full max-w-4xl flex-1 items-center justify-center px-6 py-20 text-center sm:py-32"
	>
		<h1 class="mb-6 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
			Simple reader<br />
			for simple <span class="font-black">readers</span>
		</h1>
		<p class="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
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
	</section>

	<!-- Features Section -->
	<section class="border-t border-slate-100 bg-slate-50">
		<div class="mx-auto max-w-6xl px-6 py-20 sm:py-32">
			<div class="text-center">
				<h2 class="mb-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
					Everything you need to read comfortably
				</h2>
				<p class="mx-auto max-w-2xl text-lg text-slate-600">
					Designed with your eyes in mind. Read longer, read better.
				</p>
			</div>

			<!-- 	<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<div class="rounded-xl border border-slate-200 bg-white p-6">
					<div class="mb-4 inline-flex rounded-lg bg-slate-100 p-3">
						<Moon class="h-6 w-6 text-slate-900" />
					</div>
					<h3 class="mb-2 text-lg font-semibold text-slate-900">Dark & Light Themes</h3>
					<p class="text-sm text-slate-600">
						Switch between carefully designed themes optimized for reduced eye strain and
						comfortable reading.
					</p>
				</div>

				<div class="rounded-xl border border-slate-200 bg-white p-6">
					<div class="mb-4 inline-flex rounded-lg bg-slate-100 p-3">
						<Type class="h-6 w-6 text-slate-900" />
					</div>
					<h3 class="mb-2 text-lg font-semibold text-slate-900">Customizable Fonts</h3>
					<p class="text-sm text-slate-600">
						Choose from carefully selected fonts and adjust size, line height, and spacing to your
						preference.
					</p>
				</div>

				<div class="rounded-xl border border-slate-200 bg-white p-6">
					<div class="mb-4 inline-flex rounded-lg bg-slate-100 p-3">
						<BookOpen class="h-6 w-6 text-slate-900" />
					</div>
					<h3 class="mb-2 text-lg font-semibold text-slate-900">Reading Position</h3>
					<p class="text-sm text-slate-600">
						Your reading progress is automatically saved. Pick up exactly where you left off.
					</p>
				</div>
			</div> -->
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-slate-100 bg-white">
		<div class="mx-auto max-w-6xl px-6 py-8">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p class="text-sm text-slate-500">Lector · Simple reader for simple readers</p>
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
