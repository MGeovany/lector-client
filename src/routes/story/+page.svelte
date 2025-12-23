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
	<main class="mx-auto max-w-3xl px-6 py-16">
		<h1 class="mb-4 text-5xl font-light tracking-tight text-slate-950 sm:text-6xl">The Story</h1>
		<p class="mb-12 text-sm text-slate-600">Why Lector exists</p>

		<div class="prose prose-slate max-w-none">
			<p class="text-lg leading-relaxed text-slate-800">
				It started with a simple problem: finding books in Honduras isn't easy.
			</p>

			<p class="mt-6 leading-relaxed text-slate-800">
				Ordering from Amazon takes weeks, sometimes months. Local bookstores have limited
				selections, and if you want something specific, you need to place an order weeks in
				advance. For someone who loves to read, this creates a real barrier.
			</p>

			<p class="mt-6 leading-relaxed text-slate-800">
				So, like many others here, I turned to PDFs. They're immediate, accessible, and free.
				But they come with their own frustrations. PDFs scattered across folders, lost in
				downloads, mixed with work documents. Opening one means wrestling with clunky PDF
				viewers that weren't designed for reading—they're built for documents, not stories.
			</p>

			<p class="mt-6 leading-relaxed text-slate-800">
				I wanted something better. A space that felt intentional. A place to organize my
				library, yes, but more importantly, a place to actually <em>read</em>. To focus. To
				lose yourself in the words without fighting the interface.
			</p>

			<p class="mt-6 leading-relaxed text-slate-800">
				That's how Lector was born. It's not just a PDF reader—it's a reading environment.
				Every design decision is made to help you concentrate. Customizable fonts, comfortable
				themes, reading position tracking. The interface fades away so the words can take
				center stage.
			</p>

			<p class="mt-6 leading-relaxed text-slate-800">
				Looking ahead, I see Lector becoming more than just a personal reading space. I imagine
				a community where readers can share PDFs with each other—recommendations, discoveries,
				conversations around the texts we love. Because reading, at its best, is a shared
				experience, even when we're reading alone.
			</p>

			<p class="mt-10 text-lg leading-relaxed text-slate-800">
				For now, Lector is a quiet space for focused reading. But it's built with the future in
				mind—a future where access to books isn't limited by geography, and where the tools we
				use respect the act of reading itself.
			</p>
		</div>

		<div class="mt-16 border-t border-black/10 pt-12">
			<p class="text-sm text-slate-600">
				Want to learn more? <a href="/about" class="underline-offset-4 hover:underline">Read about Lector</a> or{' '}
				<a href="/contact" class="underline-offset-4 hover:underline">get in touch</a>.
			</p>
		</div>
	</main>
</div>

