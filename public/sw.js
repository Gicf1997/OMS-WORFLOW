// Service Worker para la PWA del Sistema de Gestión de Pedidos

const CACHE_NAME = "oms-cache-v1"
const urlsToCache = ["/", "/favicon.ico", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"]

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache abierto")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Estrategia de caché: Network first, falling back to cache
self.addEventListener("fetch", (event) => {
  // No intentar cachear las solicitudes a Google Apps Script
  if (event.request.url.includes("script.google.com")) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, clonarla y almacenarla en caché
        if (event.request.method === "GET" && response && response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Si la red falla, intentar servir desde caché
        return caches.match(event.request)
      }),
  )
})

// Gestión de notificaciones push
self.addEventListener("push", (event) => {
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-icon.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "1",
    },
    actions: [
      {
        action: "explore",
        title: "Ver detalles",
        icon: "/icons/checkmark.png",
      },
      {
        action: "close",
        title: "Cerrar",
        icon: "/icons/xmark.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Gestión de clics en notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    clients.openWindow("/")
  }
})
