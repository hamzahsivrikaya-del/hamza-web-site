import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/push'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Vercel Cron veya admin tetiklemesi için token doğrula
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const admin = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  // Aktif üyeleri al
  const { data: members, error: memberError } = await admin
    .from('users')
    .select('id')
    .eq('role', 'member')
    .eq('is_active', true)

  if (memberError || !members?.length) {
    return NextResponse.json({ ok: true, sent: 0 })
  }

  // Bugün kayıt girenleri bul
  const { data: todayLogs } = await admin
    .from('meal_logs')
    .select('user_id')
    .eq('date', today)

  const loggedUserIds = new Set(todayLogs?.map((l: { user_id: string }) => l.user_id) || [])
  const reminderUserIds = members
    .filter((m: { id: string }) => !loggedUserIds.has(m.id))
    .map((m: { id: string }) => m.id)

  if (!reminderUserIds.length) {
    return NextResponse.json({ ok: true, sent: 0 })
  }

  // Push bildirim gönder
  await sendPushNotification({
    userIds: reminderUserIds,
    title: 'Beslenme Kaydı',
    message: 'Bugünün beslenme bilgilerini henüz girmedin. Hemen kaydet!',
    url: '/dashboard/beslenme',
  })

  // DB'ye bildirim kaydet
  const notifications = reminderUserIds.map((uid: string) => ({
    user_id: uid,
    type: 'nutrition_reminder' as const,
    title: 'Beslenme Kaydı',
    message: 'Bugünün beslenme bilgilerini henüz girmedin.',
  }))

  await admin.from('notifications').insert(notifications)

  return NextResponse.json({ ok: true, sent: reminderUserIds.length })
}
