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
		<h1 class="mb-8 text-4xl font-light tracking-tight text-slate-950 sm:text-5xl">Terms of Service</h1>

		<div class="prose prose-slate max-w-none">
			<p class="text-sm text-slate-600">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Acceptance of Terms</h2>
			<p class="text-slate-800">
				By using Lector, you agree to be bound by these Terms of Service. If you do not agree to
				these terms, please do not use our service.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Use of Service</h2>
			<p class="text-slate-800">You agree to use Lector only for lawful purposes and in accordance with these terms.</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">User Accounts</h2>
			<p class="text-slate-800">
				You are responsible for maintaining the confidentiality of your account credentials. You
				agree to notify us immediately of any unauthorized use of your account.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Content and Documents</h2>
			<p class="text-slate-800">
				You retain all rights to documents you upload to Lector. You are solely responsible for
				the content you upload and ensure you have the right to use such content.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Storage Limits</h2>
			<p class="text-slate-800">
				Lector provides limited storage space. You agree not to exceed the storage limits and
				understand that we may remove content that exceeds these limits.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Service Availability</h2>
			<p class="text-slate-800">
				We strive to provide reliable service but do not guarantee uninterrupted access. We
				reserve the right to modify or discontinue the service at any time.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Limitation of Liability</h2>
			<p class="text-slate-800">
				Lector is provided "as is" without warranties of any kind. We are not liable for any
				damages arising from your use of the service.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Changes to Terms</h2>
			<p class="text-slate-800">
				We reserve the right to modify these terms at any time. Continued use of the service
				after changes constitutes acceptance of the new terms.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Contact</h2>
			<p class="text-slate-800">
				For questions about these terms, please{' '}
				<a href="/contact" class="underline-offset-4 hover:underline">contact us</a>.
			</p>
		</div>
	</main>
</div>

