<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
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
	<main class="mx-auto max-w-4xl px-6 py-12">
		<h1 class="mb-8 text-4xl font-light tracking-tight text-slate-950 sm:text-5xl">About Lector</h1>

		<div class="prose prose-slate max-w-none">
			<p class="text-lg leading-relaxed text-slate-800">
				Lector is a focused reading experience designed to help you engage with long-form content
				without distractions. We believe that reading should feel natural, comfortable, and
				enjoyable.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Our Mission</h2>
			<p class="text-slate-800">
				In a world full of distractions, Lector provides a clean, minimal space for reading. We
				built this tool to help you focus on what matters most: the words on the page.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Features</h2>
			<ul class="list-disc space-y-2 pl-6 text-slate-800">
				<li>Customizable typography and themes</li>
				<li>Reading position tracking</li>
				<li>Clean, distraction-free interface</li>
				<li>Optimized for long reading sessions</li>
			</ul>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Built with Care</h2>
			<p class="text-slate-800">
				Lector is crafted with attention to detail, focusing on the reading experience above all
				else. Every design decision is made with your comfort in mind.
			</p>
		</div>
	</main>
</div>

