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

			<h2 class="mt-10 text-2xl font-light text-slate-900">Subscriptions, Billing, and Payments</h2>
			<p class="text-slate-800">
				Lector may offer subscriptions (e.g., monthly or yearly) and may also offer one-time purchases.
				Prices, availability, and features may vary by region and platform.
			</p>
			<ul class="list-disc space-y-2 pl-6 text-slate-800">
				<li>
					<strong>Auto-renewing subscriptions</strong>: If you purchase an auto-renewing subscription through Apple,
					it will renew automatically unless canceled at least 24 hours before the end of the current period.
				</li>
				<li>
					<strong>Manage / cancel</strong>: You can manage or cancel subscriptions in your Apple ID account settings.
				</li>
				<li>
					<strong>Price changes</strong>: We may change subscription pricing in the future. If a price changes, Apple may
					request your consent where required, and the updated price will apply for the next billing period after any
					applicable notice/consent flow.
				</li>
				<li>
					<strong>Refunds</strong>: Purchases made through Apple are subject to Apple’s refund policies.
				</li>
			</ul>

			<h2 class="mt-10 text-2xl font-light text-slate-900">One-time Purchases (Founder)</h2>
			<p class="text-slate-800">
				If offered, a Founder plan is a one-time purchase. However, we reserve the right to modify plans and offerings
				in the future, including introducing new subscription tiers or changing how plans are priced or packaged.
				Any changes will be communicated through updated terms and/or product disclosures.
			</p>

			<h2 class="mt-10 text-2xl font-light text-slate-900">Apple Standard EULA</h2>
			<p class="text-slate-800">
				If you access Lector via Apple platforms, you also agree to Apple’s Standard End User License Agreement (EULA):
				<a
					href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
					class="underline-offset-4 hover:underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					Apple Standard EULA
				</a>.
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

