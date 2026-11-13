/** Wipe service workers + Cache Storage, then reload so Pages serves the latest build. */
export async function hardRefreshApp(): Promise<void> {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map((r) => r.unregister()))
    }
    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
  } finally {
    const url = new URL(window.location.href)
    url.searchParams.set('nocache', String(Date.now()))
    window.location.replace(url.toString())
  }
}
