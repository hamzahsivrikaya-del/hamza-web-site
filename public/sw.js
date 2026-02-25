const CACHE_NAME = 'hamza-sivrikaya-v3'

const STATIC_ASSETS = [
  '/',
  '/login',
  '/manifest.json',
  '/antrenmanlar',
  '/araclar',
  '/blog',
]

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch - Network first, cache fallback
self.addEventListener('fetch', (event) => {
  // API isteklerini cache'leme
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Başarılı yanıtı cache'e kaydet
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone)
          })
        }
        return response
      })
      .catch(() => {
        // Offline - cache'den sun
        return caches.match(event.request)
      })
  )
})

// Push notification
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title || 'Hamza Sivrikaya', {
      body: data.message || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/dashboard/notifications' },
    })
  )
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Açık tab varsa odaklan
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      // Yoksa yeni pencere aç
      return self.clients.openWindow(url)
    })
  )
})
