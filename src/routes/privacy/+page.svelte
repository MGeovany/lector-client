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
		<h1 class="mb-8 text-4xl font-light tracking-tight text-slate-950 sm:text-5xl">Privacy Policy</h1>

		<div class="prose prose-slate max-w-none">
			<p class="text-sm text-slate-600">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Information We Collect</h2>
			<p class="text-slate-800">
				Lector collects minimal information necessary to provide you with a personalized reading
				experience:
			</p>
			<ul class="list-disc space-y-2 pl-6 text-slate-800">
				<li>Account information (email, name) for authentication</li>
				<li>Reading preferences (font size, theme, line height)</li>
				<li>Reading positions to help you continue where you left off</li>
				<li>Documents you upload for reading</li>
			</ul>

			<h2 class="mt-10 text-2xl font-light text-slate-900">How We Use Your Information</h2>
			<p class="text-slate-800">
				Your information is used solely to:
			</p>
			<ul class="list-disc space-y-2 pl-6 text-slate-800">
				<li>Provide and improve the reading service</li>
				<li>Remember your preferences across sessions</li>
				<li>Save your reading progress</li>
			</ul>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Data Security</h2>
			<p class="text-slate-800">
				We take data security seriously. All data is encrypted in transit and at rest. Your
				documents and reading data are stored securely and are only accessible to you.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Payments</h2>
			<p class="text-slate-800">
				If you purchase a subscription or a one-time plan through Apple, payment information is processed by Apple.
				We do not receive your full payment card details. We may receive non-sensitive purchase and entitlement
				information (e.g., subscription status) to provide access to paid features.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Sharing and Service Providers</h2>
			<p class="text-slate-800">
				We may use service providers to operate Lector (e.g., hosting, storage, analytics, and customer support).
				They process data on our behalf and are required to protect it.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Data Retention</h2>
			<p class="text-slate-800">
				We retain account and document data for as long as your account is active or as needed to provide the service.
				You can request account deletion, and we will delete or anonymize personal data subject to legal and operational
				requirements.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Your Rights</h2>
			<p class="text-slate-800">
				You have the right to:
			</p>
			<ul class="list-disc space-y-2 pl-6 text-slate-800">
				<li>Access your personal data</li>
				<li>Delete your account and all associated data</li>
				<li>Export your reading data</li>
			</ul>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Contact Us</h2>
			<p class="text-slate-800">
				If you have questions about this privacy policy, please contact us at{' '}
				<a href="/contact" class="underline-offset-4 hover:underline">our contact page</a>.
			</p>
		</div>
	</main>
</div>

