<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { LogOut, Settings, HelpCircle, User, Star } from '@lucide/svelte';
	import { logout } from '$lib/stores/auth';
	import { showToast } from '$lib/stores/toast';
	import { goto } from '$app/navigation';

	export let name = 'User';
	export let email = '';
	export let avatar = '';

	let showMenu = false;
	let menuRef: HTMLDivElement | null = null;
	let buttonRef: HTMLButtonElement | null = null;

	$: initial = (name || 'U').slice(0, 1).toUpperCase();
	$: maskedEmail = email
		? `${email.slice(0, 2)}${'·'.repeat(Math.min(10, email.length - 6))}${email.slice(-10)}`
		: '';
	$: memberSince = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

	function toggleMenu(event: MouseEvent) {
		event.stopPropagation();
		showMenu = !showMenu;
	}

	function closeMenu() {
		showMenu = false;
	}

	onMount(() => {
		const handleClick = (event: MouseEvent) => {
			if (!showMenu) return;

			const target = event.target as Node;
			// Don't close if clicking inside the menu or the button
			if (menuRef?.contains(target) || buttonRef?.contains(target) || target === buttonRef) {
				return;
			}
			closeMenu();
		};

		// Use a small delay to ensure button click handler runs first
		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
		};
	});

	async function handleLogout() {
		try {
			await logout();
			closeMenu();
			showToast('Logged out', 'success');
		} catch (error) {
			console.error('Logout failed', error);
			showToast('Failed to log out', 'error');
		}
	}

	function handleViewProfile() {
		closeMenu();
		goto('/profile');
	}

	function handleSettings() {
		closeMenu();
		goto('/settings');
	}
</script>

<div class="relative font-light" bind:this={menuRef}>
	<button
		bind:this={buttonRef}
		type="button"
		class="relative grid h-9 w-9 place-items-center rounded-full transition-all duration-200 hover:ring-2 hover:ring-black/10 {showMenu
			? 'ring-2 ring-black/20'
			: ''}"
		on:click|stopPropagation={toggleMenu}
		aria-haspopup="menu"
		aria-expanded={showMenu}
		aria-label="Open profile menu"
	>
		{#if avatar}
			<img
				src={avatar}
				alt={name}
				class="h-9 w-9 rounded-full object-cover"
				referrerpolicy="no-referrer"
			/>
		{:else}
			<div
				class="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-extralight text-white"
			>
				{initial}
			</div>
		{/if}
	</button>

	{#if showMenu}
		<div
			transition:fly={{ y: -8, duration: 200, opacity: 0 }}
			class="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-black/10 bg-white shadow-2xl"
		>
			<!-- User Info Section -->
			<div class="flex items-center gap-3 border-b border-black/10 px-4 py-4">
				<div class="relative">
					{#if avatar}
						<img
							src={avatar}
							alt={name}
							class="h-12 w-12 rounded-full object-cover"
							referrerpolicy="no-referrer"
						/>
					{:else}
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-extralight text-white"
						>
							{initial}
						</div>
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium text-slate-900">{name}</p>
					<button
						type="button"
						class="mt-1 text-sm text-slate-600 hover:text-slate-900 hover:underline"
						on:click={handleViewProfile}
					>
						View profile
					</button>
				</div>
			</div>

			<!-- Navigation Section -->
			<div class="border-b border-black/10 py-2">
				<button
					type="button"
					class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-black/5"
					on:click={handleSettings}
				>
					<Settings class="h-4 w-4" strokeWidth={1.5} />
					Settings
				</button>
				<div class="px-4 py-2.5">
					<div class="flex items-center gap-3">
						<Star class="h-4 w-4 text-slate-600" strokeWidth={1.5} />
						<div class="flex-1">
							<p class="text-sm text-slate-700">Membership</p>
							<p class="mt-0.5 text-xs text-slate-500">Member since {memberSince}</p>
						</div>
					</div>
				</div>
				<button
					type="button"
					class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-black/5"
				>
					<HelpCircle class="h-4 w-4" strokeWidth={1.5} />
					Help
				</button>
			</div>

			<!-- Account Section -->
			<div class="border-b border-black/10 py-2">
				<button
					type="button"
					class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-black/5"
					on:click={handleLogout}
				>
					<LogOut class="h-4 w-4" strokeWidth={1.5} />
					Sign out
				</button>
				{#if email}
					<div class="px-4 py-2">
						<p class="text-xs text-slate-500">{maskedEmail}</p>
					</div>
				{/if}
			</div>

			<!-- Footer Links -->
			<div class="px-4 py-3 text-xs font-light">
				<div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
					<a href="/about" class="hover:text-slate-900 hover:underline">About</a>
					<a href="/privacy" class="hover:text-slate-900 hover:underline">Privacy</a>
					<a href="/terms" class="hover:text-slate-900 hover:underline">Terms</a>
				</div>
				<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
					<a href="/contact" class="hover:text-slate-900 hover:underline">Contact</a>
					<a href="/contact" class="hover:text-slate-900 hover:underline">Support</a>
				</div>
			</div>
		</div>
	{/if}
</div>
