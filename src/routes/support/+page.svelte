<script lang="ts">
	import { ArrowLeft, Mail, HelpCircle, MessageCircle, FileText } from '@lucide/svelte';
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-cream">
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
		<h1 class="mb-4 text-5xl font-light tracking-tight text-slate-950 sm:text-6xl">Support</h1>
		<p class="mb-12 text-lg text-slate-700">We're here to help</p>

		<div class="space-y-8">
			<!-- Contact Card -->
			<div class="rounded-2xl border border-black/10 bg-white/50 p-8">
				<div class="flex items-start gap-4">
					<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100">
						<Mail class="h-6 w-6 text-slate-700" strokeWidth={1.5} />
					</div>
					<div class="flex-1">
						<h2 class="mb-2 text-xl font-light text-slate-900">Get in touch</h2>
						<p class="mb-4 text-slate-700">
							Have a question or need help? Send us an email and we'll get back to you as
							soon as possible.
						</p>
						<a
							href="/contact"
							class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
						>
							Go to contact page
						</a>
					</div>
				</div>
			</div>

			<!-- FAQ Section -->
			<div class="mt-12">
				<h2 class="mb-6 text-2xl font-light text-slate-900">Frequently asked questions</h2>
				<div class="space-y-4">
					<div class="rounded-xl border border-black/10 bg-white/50 p-6">
						<div class="flex items-start gap-3">
							<HelpCircle class="mt-0.5 h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.5} />
							<div>
								<h3 class="mb-2 text-lg font-light text-slate-900">How do I upload a PDF?</h3>
								<p class="text-sm text-slate-700">
									Click the upload button in the header (or use the upload option in your
									library). Select your PDF file and it will be added to your library
									automatically.
								</p>
							</div>
						</div>
					</div>

					<div class="rounded-xl border border-black/10 bg-white/50 p-6">
						<div class="flex items-start gap-3">
							<HelpCircle class="mt-0.5 h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.5} />
							<div>
								<h3 class="mb-2 text-lg font-light text-slate-900">What file formats are supported?</h3>
								<p class="text-sm text-slate-700">
									Currently, Lector supports PDF files. We're working on adding support for
									more formats in the future.
								</p>
							</div>
						</div>
					</div>

					<div class="rounded-xl border border-black/10 bg-white/50 p-6">
						<div class="flex items-start gap-3">
							<HelpCircle class="mt-0.5 h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.5} />
							<div>
								<h3 class="mb-2 text-lg font-light text-slate-900">How much storage do I have?</h3>
								<p class="text-sm text-slate-700">
									Each account comes with 15MB of storage. If you need more space, feel free
									to reach out and we can discuss options.
								</p>
							</div>
						</div>
					</div>

					<div class="rounded-xl border border-black/10 bg-white/50 p-6">
						<div class="flex items-start gap-3">
							<HelpCircle class="mt-0.5 h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.5} />
							<div>
								<h3 class="mb-2 text-lg font-light text-slate-900">Can I share my documents?</h3>
								<p class="text-sm text-slate-700">
									Sharing features are coming soon! We're building a community where readers
									can share and discover PDFs together.
								</p>
							</div>
						</div>
					</div>

					<div class="rounded-xl border border-black/10 bg-white/50 p-6">
						<div class="flex items-start gap-3">
							<HelpCircle class="mt-0.5 h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.5} />
							<div>
								<h3 class="mb-2 text-lg font-light text-slate-900">How do I change my reading preferences?</h3>
								<p class="text-sm text-slate-700">
									Click the typography icon (Aa) in the top right while reading. You can
									adjust font, size, and theme. Your preferences are saved automatically.
								</p>
							</div>
						</div>
					</div>

					<div class="rounded-xl border border-black/10 bg-white/50 p-6">
						<div class="flex items-start gap-3">
							<HelpCircle class="mt-0.5 h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.5} />
							<div>
								<h3 class="mb-2 text-lg font-light text-slate-900">My reading position isn't saving</h3>
								<p class="text-sm text-slate-700">
									Reading positions are saved automatically when you navigate between pages.
									If you're experiencing issues, try refreshing the page or contact us for
									help.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Additional Resources -->
			<div class="mt-12 border-t border-black/10 pt-12">
				<h2 class="mb-6 text-2xl font-light text-slate-900">Additional resources</h2>
				<div class="grid gap-4 sm:grid-cols-2">
					<a
						href="/how-it-works"
						class="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 p-4 transition hover:bg-white"
					>
						<FileText class="h-5 w-5 text-slate-700" strokeWidth={1.5} />
						<span class="text-sm font-medium text-slate-900">How it works</span>
					</a>
					<a
						href="/story"
						class="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 p-4 transition hover:bg-white"
					>
						<MessageCircle class="h-5 w-5 text-slate-700" strokeWidth={1.5} />
						<span class="text-sm font-medium text-slate-900">The story</span>
					</a>
				</div>
			</div>
		</div>
	</main>
</div>

