<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginWithGoogle, isAuthenticated } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let loading = false;
	let error = '';

	onMount(() => {
		if ($isAuthenticated) {
			goto('/dashboard');
		}
	});

	async function handleLoginWithGoogle() {
		error = '';
		loading = true;
		loginWithGoogle()
			.catch((err: any) => {
				error =
					err?.message || err?.error_description || 'Google sign in failed. Please try again.';
			})
			.finally(() => {
				loading = false;
			});
	}
</script>

<div class="min-h-screen bg-slate-50">
	<div class="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
		<div class="w-full">
			<div
				class="rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm shadow-slate-100 sm:px-8 sm:py-8"
			>
				<div class="mb-6 flex items-center justify-between gap-4">
					<div class="text-left">
						<p class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">Lector</p>
						<h2 class="mt-2 text-2xl font-semibold text-slate-900">Welcome back</h2>
						<p class="mt-1 text-sm text-slate-600">Sign in with your Google account.</p>
					</div>
				</div>

				<div class="space-y-4">
					{#if error}
						<div
							class="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700"
						>
							{error}
						</div>
					{/if}

					<div class="space-y-3">
						<button
							type="button"
							on:click={handleLoginWithGoogle}
							disabled={loading}
							class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:-translate-y-[1px] hover:border-slate-900 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:translate-y-0 disabled:opacity-60"
						>
							<span>{loading ? 'Redirecting to Google…' : 'Continue with Google'}</span>
						</button>
						<p class="text-center text-xs text-slate-500">
							We use your Google account only to identify you in Lector.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
