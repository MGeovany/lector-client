<script lang="ts">
	import { goto } from '$app/navigation';
	import { registerWithEmail, loginWithGoogle, isAuthenticated, authError } from '$lib/stores/auth';
	import GoogleIcon from '$lib/components/shared/GoogleIcon.svelte';
	import { onMount } from 'svelte';
	import { Eye, EyeClosed } from '@lucide/svelte';

	let loading = false;
	let googleLoading = false;
	let email = '';
	let password = '';
	let confirmPassword = '';
	let name = '';
	let showPassword = false;
	let showConfirmPassword = false;
	let passwordError = '';

	onMount(() => {
		if ($isAuthenticated) {
			goto('/');
		}
	});

	$: {
		if (password && confirmPassword && password !== confirmPassword) {
			passwordError = 'Passwords do not match';
		} else {
			passwordError = '';
		}
	}

	async function handleRegister() {
		if (!email || !password || !confirmPassword || !name) {
			return;
		}

		if (password !== confirmPassword) {
			passwordError = 'Passwords do not match';
			return;
		}

		if (password.length < 6) {
			passwordError = 'Password must be at least 6 characters';
			return;
		}

		loading = true;
		try {
			await registerWithEmail(email, password, name);
			// Show success message or redirect
			goto('/login?message=Check your email to confirm your account');
		} catch (err: any) {
			console.error('Registration failed:', err);
		} finally {
			loading = false;
		}
	}

	async function handleLoginWithGoogle() {
		googleLoading = true;
		try {
			await loginWithGoogle();
			// Redirect will be handled by auth state change
		} catch (err: any) {
			console.error('Google login failed:', err);
		} finally {
			googleLoading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleRegister();
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
						<h2 class="mt-2 text-2xl font-semibold text-slate-900">Create account</h2>
						<p class="mt-1 text-sm text-slate-600">Get started with your reading journey.</p>
					</div>
				</div>

				<div class="space-y-4">
					{#if $authError}
						<div
							class="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700"
						>
							{$authError}
						</div>
					{/if}

					{#if passwordError}
						<div
							class="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700"
						>
							{passwordError}
						</div>
					{/if}

					<!-- Registration Form -->
					<form on:submit|preventDefault={handleRegister} class="space-y-4">
						<div>
							<label for="name" class="mb-1 block text-sm font-medium text-slate-700">
								Full name
							</label>
							<input
								id="name"
								type="text"
								bind:value={name}
								on:keypress={handleKeyPress}
								required
								class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
								placeholder="Enter your full name"
							/>
						</div>

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

						<div>
							<label for="password" class="mb-1 block text-sm font-medium text-slate-700">
								Password
							</label>
							<div class="relative">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									bind:value={password}
									on:keypress={handleKeyPress}
									required
									minlength="6"
									class="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
									placeholder="Create a password"
								/>
								<button
									type="button"
									on:click={() => (showPassword = !showPassword)}
									class="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
								>
									{#if showPassword}
										<Eye class="h-4 w-4" />
									{:else}
										<EyeClosed class="h-4 w-4" />
									{/if}
								</button>
							</div>
							<p class="mt-1 text-xs text-slate-500">Must be at least 6 characters</p>
						</div>

						<div>
							<label for="confirmPassword" class="mb-1 block text-sm font-medium text-slate-700">
								Confirm password
							</label>
							<div class="relative">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									bind:value={confirmPassword}
									on:keypress={handleKeyPress}
									required
									class="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									on:click={() => (showConfirmPassword = !showConfirmPassword)}
									class="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
								>
									{#if showConfirmPassword}
										<Eye class="h-4 w-4" />
									{:else}
										<EyeClosed class="h-4 w-4" />
									{/if}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading ||
								!email ||
								!password ||
								!confirmPassword ||
								!name ||
								passwordError !== ''}
							class="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							{loading ? 'Creating account...' : 'Create account'}
						</button>
					</form>

					<!-- Divider -->
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-slate-200"></div>
						</div>
						<div class="relative flex justify-center text-xs uppercase">
							<span class="bg-white px-2 text-slate-500">Or continue with</span>
						</div>
					</div>

					<!-- Google Login -->
					<div class="space-y-3">
						<button
							type="button"
							on:click={handleLoginWithGoogle}
							disabled={googleLoading}
							class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<GoogleIcon class="h-4 w-4" />
							<span>{googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}</span>
						</button>
					</div>

					<!-- Links -->
					<div class="text-center">
						<p class="text-xs text-slate-500">
							Already have an account?
							<a href="/login" class="font-medium text-slate-900 hover:underline">Sign in</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
