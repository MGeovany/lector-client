<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Community Guidelines & Usage Rules - Lector</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Header -->
	<header class="border-b border-black/10">
		<div class="mx-auto max-w-4xl px-6 py-4">
			<button
				type="button"
				class="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
				on:click={() => goto('/')}
			>
				<ArrowLeft class="h-4 w-4" strokeWidth={1.5} />
				Back
			</button>
		</div>
	</header>

	<!-- Content -->
	<main class="mx-auto max-w-4xl px-6 py-12">
		<h1 class="mb-2 text-4xl font-bold tracking-tight text-slate-900">Community Guidelines & Usage Rules</h1>
		<p class="mb-12 text-slate-600">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

		<div class="prose prose-slate max-w-none space-y-8">
			<!-- What You Can Upload -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">What You Can Upload</h2>
				<p class="mb-4 text-slate-700">
					Lector allows you to upload PDF documents to your personal library for reading and organization. You may upload:
				</p>
				<ul class="ml-6 list-disc space-y-2 text-slate-700">
					<li>Personal documents, books, articles, and research materials</li>
					<li>Educational content for your own use</li>
					<li>Legal documents and contracts (for personal reference)</li>
					<li>Any PDF file that you have the legal right to store and access</li>
				</ul>
				<p class="mt-4 text-slate-700">
					<strong>Important:</strong> You are responsible for ensuring that you have the legal right to upload and store any document you add to your library. Do not upload content that violates copyright, contains illegal material, or infringes on the rights of others.
				</p>
			</section>

			<!-- Privacy & Anonymity -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Privacy & Data Protection</h2>
				<p class="mb-4 text-slate-700">
					Your privacy is important to us. All documents and data you upload to Lector are:
				</p>
				<ul class="ml-6 list-disc space-y-2 text-slate-700">
					<li><strong>Anonymous:</strong> Your documents are stored in an isolated, user-specific environment. We do not have access to view, read, or analyze the content of your documents.</li>
					<li><strong>Encrypted:</strong> All data is encrypted both in transit and at rest using industry-standard encryption protocols. Your documents are protected from unauthorized access.</li>
					<li><strong>Private:</strong> Your library is accessible only to you through your authenticated account. No other users or administrators can view your documents.</li>
				</ul>
				<p class="mt-4 text-slate-700">
					We use Supabase as our backend infrastructure provider. Your data is stored securely in Supabase's infrastructure, which adheres to strict security and privacy standards. However, you acknowledge that your data is subject to Supabase's terms of service and privacy policy.
				</p>
			</section>

			<!-- Content Moderation & Removal -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Content Moderation & Removal</h2>
				<p class="mb-4 text-slate-700">
					While we do not actively monitor the content of your documents, we reserve the right to:
				</p>
				<ul class="ml-6 list-disc space-y-2 text-slate-700">
					<li><strong>Remove content:</strong> We may delete documents or user accounts if we receive credible reports of illegal activity, copyright infringement, or violations of these guidelines.</li>
					<li><strong>Suspend accounts:</strong> Accounts that repeatedly violate these rules or engage in abusive behavior may be suspended or terminated.</li>
					<li><strong>Comply with legal obligations:</strong> We may be required to remove content or provide information to authorities in response to valid legal requests, court orders, or to comply with applicable laws.</li>
				</ul>
				<p class="mt-4 text-slate-700">
					If your content is removed, we will make reasonable efforts to notify you, unless prohibited by law or court order. You may appeal content removal decisions by contacting us through our support channels.
				</p>
			</section>

			<!-- Prohibited Content -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Prohibited Content</h2>
				<p class="mb-4 text-slate-700">You may not upload, store, or share content that:</p>
				<ul class="ml-6 list-disc space-y-2 text-slate-700">
					<li>Violates copyright, trademark, or intellectual property rights</li>
					<li>Contains illegal material, including but not limited to child exploitation, terrorism, or hate speech</li>
					<li>Infringes on the privacy or rights of others</li>
					<li>Contains malware, viruses, or other harmful code</li>
					<li>Is used to harass, threaten, or harm others</li>
					<li>Violates any applicable local, state, national, or international law</li>
				</ul>
			</section>

			<!-- Storage Limits -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Storage & Usage Limits</h2>
				<p class="mb-4 text-slate-700">
					Lector provides limited storage space per user (currently 15MB). You are responsible for managing your storage quota. We reserve the right to:
				</p>
				<ul class="ml-6 list-disc space-y-2 text-slate-700">
					<li>Enforce storage limits and prevent uploads that would exceed your quota</li>
					<li>Modify storage limits with reasonable notice</li>
					<li>Remove old or inactive content to free up space (with prior notification when possible)</li>
				</ul>
			</section>

			<!-- Account Termination -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Account Termination</h2>
				<p class="mb-4 text-slate-700">
					We may terminate or suspend your account and delete your data if:
				</p>
				<ul class="ml-6 list-disc space-y-2 text-slate-700">
					<li>You violate these Community Guidelines or our Terms of Service</li>
					<li>You engage in illegal activity or abuse of the service</li>
					<li>Your account remains inactive for an extended period (with prior notification)</li>
					<li>We are required to do so by law or court order</li>
				</ul>
				<p class="mt-4 text-slate-700">
					Upon account termination, all your documents and data will be permanently deleted from our systems. We recommend exporting or backing up your important documents before account termination.
				</p>
			</section>

			<!-- Reporting Violations -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Reporting Violations</h2>
				<p class="mb-4 text-slate-700">
					If you believe someone is violating these guidelines or using Lector for illegal purposes, please contact us at <a href="/contact" class="text-slate-900 underline">our contact page</a>. We take all reports seriously and will investigate promptly.
				</p>
			</section>

			<!-- Changes to Guidelines -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Changes to These Guidelines</h2>
				<p class="mb-4 text-slate-700">
					We may update these Community Guidelines from time to time. We will notify users of significant changes by updating the "Last updated" date at the top of this page. Continued use of Lector after changes constitutes acceptance of the updated guidelines.
				</p>
			</section>

			<!-- Contact -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold text-slate-900">Questions or Concerns</h2>
				<p class="mb-4 text-slate-700">
					If you have questions about these guidelines or need to report a violation, please <a href="/contact" class="text-slate-900 underline">contact us</a>. We're here to help ensure Lector remains a safe and useful platform for everyone.
				</p>
			</section>
		</div>
	</main>

	<!-- Footer -->
	<footer class="mt-16 border-t border-black/10">
		<div class="mx-auto max-w-4xl px-6 py-6">
			<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600">
				<a class="hover:text-slate-900 hover:underline" href="/about">About</a>
				<a class="hover:text-slate-900 hover:underline" href="/privacy">Privacy</a>
				<a class="hover:text-slate-900 hover:underline" href="/terms">Terms</a>
				<a class="hover:text-slate-900 hover:underline" href="/conduct">Community Guidelines</a>
				<a class="hover:text-slate-900 hover:underline" href="/contact">Contact</a>
			</div>
		</div>
	</footer>
</div>

