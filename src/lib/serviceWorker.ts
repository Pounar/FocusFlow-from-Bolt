export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)

          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('New content available, please refresh.')
                  } else {
                    console.log('Content cached for offline use.')
                  }
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    })
  }
}

export function requestNotificationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!('Notification' in window)) {
      resolve(false)
      return
    }

    if (Notification.permission === 'granted') {
      resolve(true)
      return
    }

    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        resolve(permission === 'granted')
      })
    } else {
      resolve(false)
    }
  })
}

export async function scheduleNotification(title: string, options?: NotificationOptions): Promise<void> {
  const hasPermission = await requestNotificationPermission()

  if (hasPermission && 'serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready

    if ('showNotification' in registration) {
      await registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/icon-96.png',
        requireInteraction: true,
        ...options,
      })
    }
  }
}
