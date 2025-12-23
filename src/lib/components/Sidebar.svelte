<script lang="ts">
	import {
		SquareLibrary,
		BookOpenText,
		Highlighter,
		Settings,
		DoorOpen,
		User
	} from '@lucide/svelte';
	import { logout } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { sidebarOpen } from '$lib/stores/ui';

	async function handleLogout() {
		await logout();
		goto('/login');
	}

	type NavItem = { href: string; label: string; icon: any };

	const nav: NavItem[] = [
		{ href: '/', label: 'Library', icon: SquareLibrary },
		// { href: '/#reader', label: 'Reader', icon: BookOpenText },
		// { href: '/#highlights', label: 'Highlights', icon: Highlighter },
		{ href: '/profile', label: 'Profile', icon: User },
		{ href: '/settings', label: 'Settings', icon: Settings }
	];

	$: pathname = $page.url.pathname;
</script>

<aside
	class="peer/sidebar fixed top-14 bottom-0 left-0 z-20 flex w-60 flex-col border-r border-black/10 bg-white transition-transform duration-300 ease-in-out"
	class:translate-x-0={$sidebarOpen}
	class:-translate-x-full={!$sidebarOpen}
>
	<nav class="flex flex-1 flex-col gap-1 px-3 pt-4">
		{#each nav as item (item.label)}
			<a
				href={item.href}
				class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-black/5"
				class:text-slate-900={pathname === item.href}
				class:text-slate-700={pathname !== item.href}
				aria-current={pathname === item.href ? 'page' : undefined}
			>
				<svelte:component this={item.icon} class="h-5 w-5 shrink-0" strokeWidth={1.5} />
				<span class="min-w-0 font-extralight">{item.label}</span>
			</a>
		{/each}
	</nav>

	<div class="px-3 pb-4">
		<button
			on:click={handleLogout}
			class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-black/5 hover:text-slate-900"
		>
			<DoorOpen class="h-5 w-5 shrink-0" strokeWidth={1.5} />
			<span class="min-w-0 font-extralight">Sign out</span>
		</button>
	</div>
</aside>
