import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createAdminClient } from '@/lib/supabase/admin'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// Bu endpoint yalnızca sunucu tarafından çağrılır (internal).
// Güvenlik: sadece aynı origin'den istek kabul et.
export async function POST(request: Request) {
  const authHeader = request.headers.get('x-internal-token')
  if (authHeader !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { userIds, title, message, url } = await request.json()

  if (!userIds?.length || !title || !message) {
    return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: subs } = await admin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .in('user_id', userIds)

  if (!subs?.length) {
    return NextResponse.json({ sent: 0 })
  }

  const payload = JSON.stringify({ title, message, url: url || '/dashboard/notifications' })

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  return NextResponse.json({ sent, total: subs.length })
}
