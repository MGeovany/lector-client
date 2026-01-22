<script lang="ts">
	import AppleIcon from '$lib/components/shared/AppleIcon.svelte';

	const year = new Date().getFullYear();
	const iosRequirement = 'Requires iOS 15.0 or later';
</script>

<svelte:head>
	<title>Download Lector</title>
	<meta
		name="description"
		content="Download Lector for iPhone and Mac. A simple, elegant reader built for focused reading."
	/>
</svelte:head>

<div class="bg-cream flex min-h-screen flex-col overflow-hidden text-slate-900">
	<!-- Navigation -->
	<nav class="shrink-0 border-b border-black/15">
		<div class="mx-auto max-w-6xl px-6 py-3">
			<div class="flex items-center justify-between gap-6">
				<a href="/landing" class="font-brand text-2xl font-bold tracking-tight">Lector</a>

				<div class="flex items-center gap-3 sm:gap-4">
					<div class="hidden items-center gap-5 text-sm text-slate-900/90 md:flex">
						<a class="underline-offset-4 hover:underline" href="/how-it-works">How it works</a>
						<a class="underline-offset-4 hover:underline" href="/support">Support</a>
					</div>

					<a
						href="/login"
						class="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
					>
						Open web app
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero -->
	<section class="relative flex flex-1 items-center overflow-hidden border-b border-black/15">
		<!-- Subtle background -->
		<div class="pointer-events-none absolute inset-0">
			<div
				class="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-black/5 blur-3xl"
				aria-hidden="true"
			></div>
			<div
				class="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-black/5 blur-3xl"
				aria-hidden="true"
			></div>
		</div>

		<div
			class="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-2"
		>
			<div class="max-w-2xl">
				<div class="mb-4 flex items-center gap-3">
					<img
						src="/lector-icon-app.png"
						alt="Lector app icon"
						class="h-20 w-20 rounded-lg border border-black/10 bg-white object-cover shadow-sm"
						loading="lazy"
					/>
					<div class="text-left">
						<p class="text-sm text-slate-900">Lector: Clean reading for simple readers</p>
						<p class="text-xs text-slate-700/70">iPhone • iPad</p>
					</div>
				</div>
				<h1
					class="text-[2.6rem] leading-none tracking-tight text-slate-950 sm:text-[3.2rem]"
					style="font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;"
				>
					Get the Lector app.
				</h1>

				<p
					class="text-md mt-5 max-w-prose leading-relaxed font-light text-slate-800/50 sm:text-2xl"
					style="font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;"
				>
					Read everything, everywhere. Save your favorite documents. And read them offline.
				</p>

				<div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
					<!-- App Store badge -->
					<div class="flex flex-col items-center justify-center gap-4 py-2 lg:items-start">
						<a
							href=""
							aria-label="Download on the App Store"
							aria-disabled="true"
							title="Coming soon"
							on:click|preventDefault
							class="group inline-flex h-16 w-[238px] items-center gap-4 rounded-2xl border border-white/20 bg-[linear-gradient(180deg,#2a2a2a_0%,#000_100%)] px-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] ring-1 ring-black/10 transition select-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:outline-none"
						>
							<AppleIcon class="h-9 w-9 text-white" />

							<span class="flex min-w-0 flex-col leading-none">
								<span class="text-[13px] font-medium tracking-tight text-white/90"
									>Download on the</span
								>
								<span class="mt-1 text-[28px] font-semibold tracking-tight">App Store</span>
							</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="shrink-0 border-t border-black/10">
		<div class="mx-auto max-w-6xl px-6 py-3">
			<div
				class="flex flex-col items-center justify-between gap-2 text-xs text-slate-900/60 sm:flex-row"
			>
				<p>© {year} Lector</p>
				<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
					<a class="underline-offset-4 hover:text-slate-900 hover:underline" href="/privacy"
						>Privacy</a
					>
					<a class="underline-offset-4 hover:text-slate-900 hover:underline" href="/terms">Terms</a>
					<a class="underline-offset-4 hover:text-slate-900 hover:underline" href="/contact"
						>Contact</a
					>
				</div>
			</div>
		</div>
	</footer>
</div>
