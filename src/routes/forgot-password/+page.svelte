<script lang="ts">
	import { resetPassword, authError } from '$lib/stores/auth';

	let email = '';
	let loading = false;
	let success = false;

	async function handleResetPassword() {
		if (!email) return;

		loading = true;
		try {
			await resetPassword(email);
			success = true;
		} catch (err: any) {
			console.error('Password reset failed:', err);
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleResetPassword();
		}
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
						<h2 class="mt-2 text-2xl font-semibold text-slate-900">Reset password</h2>
						<p class="mt-1 text-sm text-slate-600">
							{success
								? 'Check your email for reset instructions.'
								: 'Enter your email to reset your password.'}
						</p>
					</div>
				</div>

				<div class="space-y-4">
					{#if $authError && !success}
						<div
							class="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700"
						>
							{$authError}
						</div>
					{/if}

					{#if success}
						<div
							class="rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-700"
						>
							Password reset email sent! Check your inbox and follow the instructions to reset your
							password.
						</div>

						<div class="text-center">
							<a href="/login" class="text-sm font-medium text-slate-900 hover:underline">
								Back to sign in
							</a>
						</div>
					{:else}
						<!-- Reset Form -->
						<form on:submit|preventDefault={handleResetPassword} class="space-y-4">
							<div>
								<label for="email" class="mb-1 block text-sm font-medium text-slate-700">
									Email address
								</label>
								<input
									id="email"
									type="email"
									bind:value={email}
									on:keypress={handleKeyPress}
									required
									class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
									placeholder="Enter your email"
								/>
							</div>

							<button
								type="submit"
								disabled={loading || !email}
								class="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							>
								{loading ? 'Sending...' : 'Send reset email'}
							</button>
						</form>

						<!-- Links -->
						<div class="space-y-2 text-center">
							<p class="text-xs text-slate-500">
								Remember your password?
								<a href="/login" class="font-medium text-slate-900 hover:underline">Sign in</a>
							</p>
							<p class="text-xs text-slate-500">
								Don't have an account?
								<a href="/register" class="font-medium text-slate-900 hover:underline">Sign up</a>
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
