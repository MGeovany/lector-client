<script lang="ts">
	import { ArrowLeft, Mail } from '@lucide/svelte';
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
	<main class="mx-auto max-w-4xl px-6 py-12">
		<h1 class="mb-8 text-4xl font-light tracking-tight text-slate-950 sm:text-5xl">Contact Us</h1>

		<div class="prose max-w-none prose-slate">
			<p class="text-lg leading-relaxed text-slate-800">
				We'd love to hear from you. Whether you have a question, feedback, or need support, we're
				here to help.
			</p>

			<div class="mt-10 rounded-2xl border border-black/10 bg-white/50 p-8">
				<div class="flex items-start gap-4">
					<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
						<Mail class="h-6 w-6 text-slate-700" strokeWidth={1.5} />
					</div>
					<div>
						<h2 class="text-xl font-light text-slate-900">Email</h2>
						<p class="mt-2 text-slate-700">
							Send us an email at{' '}
							<a
								href="mailto:marlon.castro@thefndrs.com"
								class="font-medium underline-offset-4 hover:underline"
							>
								marlon.castro@thefndrs.com
							</a>
						</p>
						<p class="mt-4 text-sm text-slate-600">We typically respond within 24-48 hours.</p>
					</div>
				</div>
			</div>

			<div class="mt-8">
				<h2 class="text-2xl font-light text-slate-900">What can we help with?</h2>
				<ul class="mt-4 space-y-3 text-slate-800">
					<li>• Questions about Lector</li>
					<li>• Feature requests</li>
					<li>• Bug reports</li>
					<li>• Privacy or security concerns</li>
					<li>• Partnership inquiries</li>
				</ul>
			</div>
		</div>
	</main>
</div>
