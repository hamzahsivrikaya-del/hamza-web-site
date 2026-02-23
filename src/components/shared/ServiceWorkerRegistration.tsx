'use client'

import { useEffect } from 'react'

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

async function saveSubscription(subscription: PushSubscription) {
  const { endpoint, keys } = subscription.toJSON() as {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }

  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, keys }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `HTTP ${res.status}`)
  }
}

export async function subscribeToPush(registration: ServiceWorkerRegistration) {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!vapidPublicKey) return

  // Var olan subscription'ı kontrol et, varsa DB'ye kaydet (tekrar kayıt zararsız, upsert)
  const existing = await registration.pushManager.getSubscription()
  if (existing) {
    await saveSubscription(existing)
    return
  }

  // Yeni subscription oluştur
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as ArrayBuffer,
  })

  await saveSubscription(subscription)
}

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').then(async (registration) => {
      // İzin zaten verilmişse subscribe et
      if ('Notification' in window && Notification.permission === 'granted') {
        await subscribeToPush(registration)
      }
    }).catch(() => {})
  }, [])

  return null
}
