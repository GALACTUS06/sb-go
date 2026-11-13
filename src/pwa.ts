import { registerSW } from 'virtual:pwa-register'

let reloading = false

registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return
    // Pull updates often while the tab is open (PWA caches stick hard on phone/PC).
    window.setInterval(() => {
      void registration.update()
    }, 60_000)
  },
  onNeedRefresh() {
    if (reloading) return
    reloading = true
    window.location.reload()
  },
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    window.location.reload()
  })
}
