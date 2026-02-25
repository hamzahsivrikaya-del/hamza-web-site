import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/push'
import { safeCompare } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const expected = `Bearer ${process.env.CRON_SECRET}`
  if (!safeCompare(authHeader, expected)) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  // Saat kontrolü: sadece 06:00-10:00 UTC (TR 09:00-13:00) arasında gönder
  const nowUTC = new Date().getUTCHours()
  if (nowUTC < 6 || nowUTC >= 10) {
    return NextResponse.json({ ok: true, sent: 0, skipped: 'outside-time-window' })
  }

  const admin = createAdminClient()

  // Tüm aktif üyeleri al (bağlı üyeler hariç — onlar giriş yapmaz)
  const { data: members, error: memberError } = await admin
    .from('users')
    .select('id')
    .eq('role', 'member')
    .eq('is_active', true)
    .is('parent_id', null)

  if (memberError || !members?.length) {
    return NextResponse.json({ ok: true, sent: 0 })
  }

  const userIds = members.map((m: { id: string }) => m.id)

  // Push bildirim gönder
  await sendPushNotification({
    userIds,
    title: 'Günaydın!',
    message: 'Bugün seni harika bir gün bekliyor. Beslenmeni eklemeyi unutma!',
    url: '/dashboard/beslenme',
  })

  // DB'ye bildirim kaydet
  const notifications = userIds.map((uid: string) => ({
    user_id: uid,
    type: 'nutrition_reminder' as const,
    title: 'Günaydın!',
    message: 'Bugün seni harika bir gün bekliyor. Beslenmeni eklemeyi unutma!',
  }))

  await admin.from('notifications').insert(notifications)

  return NextResponse.json({ ok: true, sent: userIds.length })
}
