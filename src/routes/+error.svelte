<script lang="ts">
  export let error: { message?: string; status?: number };
  export let status: number;

  const title = status === 404 ? 'Page not found' : 'Internal Error';
  const description =
    status === 404
      ? 'The page you are looking for does not exist or has moved.'
      : 'Something went wrong while loading this page.';
</script>

<svelte:head>
  <title>{status} — {title}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-6">
  <div class="max-w-md text-center">
    <p class="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Lector</p>
    <div class="mt-6 inline-flex items-baseline gap-3">
      <span class="text-4xl font-semibold text-slate-900">{status}</span>
      <span class="text-sm font-medium text-slate-500">{title}</span>
    </div>
    <p class="mt-4 text-sm text-slate-500">{description}</p>
    {#if error?.message && status !== 404}
      <p class="mt-2 text-xs text-slate-400">{error.message}</p>
    {/if}
    <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a
        href="/"
        class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Go to library
      </a>
      <a
        href="/landing"
        class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Go to landing
      </a>
    </div>
  </div>
</div>


