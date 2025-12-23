<script lang="ts">
	import { ArrowLeft, SquareLibrary, BookOpen, Settings, Moon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
</script>

<div class="bg-cream min-h-screen">
	<!-- Navigation -->
	<nav class="border-b border-black/15">
		<div class="mx-auto max-w-4xl px-6 py-4">
			<button
				type="button"
				on:click={() => goto('/landing')}
				class="inline-flex items-center gap-2 text-sm text-slate-900/70 transition hover:text-slate-900"
			>
				<ArrowLeft class="h-4 w-4" strokeWidth={1.5} />
				Back
			</button>
		</div>
	</nav>

	<!-- Content -->
	<main class="mx-auto max-w-4xl px-6 py-16">
		<h1 class="mb-4 text-5xl font-light tracking-tight text-slate-950 sm:text-6xl">How it works</h1>
		<p class="mb-12 text-lg text-slate-700">A simple, focused reading experience</p>

		<div class="space-y-16">
			<!-- Step 1 -->
			<div class="flex gap-6">
				<div class="flex h-12 w-12 shrink-0 items-center justify-center">
					<SquareLibrary class="h-6 w-6 text-slate-700" strokeWidth={1.5} />
				</div>
				<div class="flex-1">
					<h2 class="mb-3 text-2xl font-light text-slate-900">1. Upload your PDFs</h2>
					<p class="leading-relaxed text-slate-800">
						Add your PDF documents to your library. Simply click the upload button and select your
						files. Lector supports standard PDF formats and will extract the text for a smooth
						reading experience.
					</p>
				</div>
			</div>

			<!-- Step 2 -->
			<div class="flex gap-6">
				<div class="rounded-ful flex h-12 w-12 shrink-0 items-center justify-center">
					<BookOpen class="h-6 w-6 text-slate-700" strokeWidth={1.5} />
				</div>
				<div class="flex-1">
					<h2 class="mb-3 text-2xl font-light text-slate-900">2. Organize your library</h2>
					<p class="leading-relaxed text-slate-800">
						Your documents are automatically organized in your library. You can filter between read
						and unread books, making it easy to pick up where you left off or discover something
						new.
					</p>
				</div>
			</div>

			<!-- Step 3 -->
			<div class="flex gap-6">
				<div class="rounded-ful flex h-12 w-12 shrink-0 items-center justify-center">
					<Settings class="h-6 w-6 text-slate-700" strokeWidth={1.5} />
				</div>
				<div class="flex-1">
					<h2 class="mb-3 text-2xl font-light text-slate-900">3. Customize your reading</h2>
					<p class="leading-relaxed text-slate-800">
						Adjust everything to your preference. Choose from different fonts, adjust the size and
						line height, and switch between day and night themes. Your preferences are saved
						automatically.
					</p>
				</div>
			</div>

			<!-- Step 4 -->
			<div class="flex gap-6">
				<div class="flex h-12 w-12 shrink-0 items-center justify-center">
					<Moon class="h-6 w-6 text-slate-700" strokeWidth={1.5} />
				</div>
				<div class="flex-1">
					<h2 class="mb-3 text-2xl font-light text-slate-900">4. Focus and read</h2>
					<p class="leading-relaxed text-slate-800">
						Dive into your reading with a clean, distraction-free interface. Lector remembers where
						you left off, so you can always continue from the right page. Navigate with arrow keys,
						mouse, or touch gestures.
					</p>
				</div>
			</div>
		</div>

		<!-- Features Section -->
		<div class="mt-20 border-t border-black/10 pt-16">
			<h2 class="mb-8 text-3xl font-light text-slate-900">Key features</h2>
			<div class="grid gap-6 sm:grid-cols-2">
				<div class="rounded-xl border border-black/10 bg-white/50 p-6">
					<h3 class="mb-2 text-lg font-light text-slate-900">Reading position tracking</h3>
					<p class="text-sm text-slate-700">
						Never lose your place. Lector automatically saves where you are in each document.
					</p>
				</div>
				<div class="rounded-xl border border-black/10 bg-white/50 p-6">
					<h3 class="mb-2 text-lg font-light text-slate-900">Customizable typography</h3>
					<p class="text-sm text-slate-700">
						Choose from multiple fonts and adjust size and spacing to match your reading comfort.
					</p>
				</div>
				<div class="rounded-xl border border-black/10 bg-white/50 p-6">
					<h3 class="mb-2 text-lg font-light text-slate-900">Day and night themes</h3>
					<p class="text-sm text-slate-700">
						Switch between light and dark modes to read comfortably at any time of day.
					</p>
				</div>
				<div class="rounded-xl border border-black/10 bg-white/50 p-6">
					<h3 class="mb-2 text-lg font-light text-slate-900">Keyboard navigation</h3>
					<p class="text-sm text-slate-700">
						Use arrow keys to navigate pages quickly. The interface stays out of your way.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-16 border-t border-black/10 pt-12">
			<p class="text-sm text-slate-600">
				Ready to start? <a href="/register" class="underline-offset-4 hover:underline"
					>Create an account</a
				>
				or{' '}
				<a href="/contact" class="underline-offset-4 hover:underline">contact us</a> if you have questions.
			</p>
		</div>
	</main>
</div>
