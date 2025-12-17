<script lang="ts">
	import { LayoutPanelLeft, LibraryBig, SlidersHorizontal, DoorOpen } from '@lucide/svelte';
	import { logout } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	async function handleLogout() {
		await logout();
		goto('/login');
	}
</script>

<aside
	class="peer/sidebar group/sidebar fixed inset-y-0 left-0 z-10 flex w-16 flex-col border-r border-slate-200 bg-white/80 backdrop-blur transition-[width] duration-200 hover:w-64 supports-[backdrop-filter]:bg-white/60"
>
	<div class="flex items-center gap-3 px-4 py-4">
		<div
			class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900"
		>
			L
		</div>
		<div class="min-w-0 opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
			<p class="text-sm leading-5 font-semibold text-slate-900">Lector</p>
			<p class="text-xs text-slate-500">Dashboard</p>
		</div>
	</div>

	<nav class="mt-2 flex flex-1 flex-col gap-1 px-2">
		<a
			href="/dashboard"
			class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
			aria-current="page"
		>
			<LayoutPanelLeft class="h-5 w-5 shrink-0" />
			<span
				class="min-w-0 opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100"
				>Overview</span
			>
		</a>

		<a
			href="#library"
			class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
		>
			<LibraryBig class="h-5 w-5 shrink-0" />
			<span
				class="min-w-0 opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100"
				>Library</span
			>
		</a>

		<a
			href="#settings"
			class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
		>
			<SlidersHorizontal class="h-5 w-5 shrink-0" />
			<span
				class="min-w-0 opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100"
				>Settings</span
			>
		</a>
	</nav>

	<div class="px-2 pb-4">
		<button
			on:click={handleLogout}
			class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
		>
			<DoorOpen class="h-5 w-5 shrink-0" />
			<span
				class="min-w-0 opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100"
				>Sign out</span
			>
		</button>
	</div>
</aside>
