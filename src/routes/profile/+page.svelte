<script lang="ts">
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { currentUser, logout } from '$lib/stores/auth';
	import { sidebarOpen } from '$lib/stores/ui';
	import { goto } from '$app/navigation';
	import { User, Mail, Settings, LogOut } from '@lucide/svelte';

	$: name =
		$currentUser?.user_metadata?.name ||
		$currentUser?.user_metadata?.full_name ||
		$currentUser?.email ||
		'User';
	$: email = $currentUser?.email || '';
	$: avatar =
		$currentUser?.user_metadata?.picture ||
		$currentUser?.user_metadata?.avatar_url ||
		$currentUser?.user_metadata?.image ||
		'';
	$: initial = (name || 'U').slice(0, 1).toUpperCase();
	$: memberSince = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

	async function handleLogout() {
		await logout();
	}
</script>

<ProtectedRoute>
	<div class="min-h-screen bg-white">
		<Header />
		<Sidebar />

		<main
			class="min-h-screen pt-14 transition-[padding] duration-300 ease-in-out"
			class:md:pl-60={$sidebarOpen}
			class:md:pl-0={!$sidebarOpen}
		>
			<div class="mx-auto max-w-3xl px-6 py-10">
				<div class="flex items-start justify-between gap-6">
					<div>
						<p class="text-xs tracking-[0.18em] uppercase text-slate-500">Profile</p>
						<h1 class="mt-3 text-4xl font-light tracking-tight text-slate-950">Your account</h1>
						<p class="mt-3 max-w-prose text-sm text-slate-600">
							Manage your profile details and account preferences.
						</p>
					</div>

					<button
						type="button"
						class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-black/5"
						on:click={() => goto('/settings')}
					>
						<Settings class="h-4 w-4" strokeWidth={1.5} />
						Settings
					</button>
				</div>

				<div class="mt-10 rounded-2xl border border-black/10 bg-white p-6">
					<div class="flex items-center gap-4">
						{#if avatar}
							<img
								src={avatar}
								alt={name}
								class="h-14 w-14 rounded-full object-cover"
								referrerpolicy="no-referrer"
							/>
						{:else}
							<div class="grid h-14 w-14 place-items-center rounded-full bg-black text-white">
								<span class="text-base font-light">{initial}</span>
							</div>
						{/if}

						<div class="min-w-0 flex-1">
							<p class="truncate text-lg font-light text-slate-950">{name}</p>
							<div class="mt-1 flex items-center gap-2 text-sm text-slate-600">
								<Mail class="h-4 w-4" strokeWidth={1.5} />
								<span class="truncate">{email || '—'}</span>
							</div>
							<p class="mt-2 text-xs text-slate-500">Member since {memberSince}</p>
						</div>
					</div>
				</div>

				<div class="mt-6 grid gap-3 sm:grid-cols-2">
					<a
						href="/about"
						class="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 text-sm text-slate-700 transition hover:bg-black/5 hover:text-slate-900"
					>
						<User class="h-4 w-4" strokeWidth={1.5} />
						About Lector
					</a>
					<a
						href="/support"
						class="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 text-sm text-slate-700 transition hover:bg-black/5 hover:text-slate-900"
					>
						<Mail class="h-4 w-4" strokeWidth={1.5} />
						Support
					</a>
				</div>

				<div class="mt-10 border-t border-black/10 pt-6">
					<button
						type="button"
						class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-black/5"
						on:click={handleLogout}
					>
						<LogOut class="h-4 w-4" strokeWidth={1.5} />
						Sign out
					</button>
				</div>
			</div>
		</main>
	</div>
</ProtectedRoute>


