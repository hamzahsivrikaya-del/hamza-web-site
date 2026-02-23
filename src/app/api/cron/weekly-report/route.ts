import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getWeekRange, generateMessage } from '@/lib/weekly-report'
import { sendPushNotification } from '@/lib/push'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Vercel Cron veya admin tetiklemesi için token doğrula
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { weekStart, weekEnd } = getWeekRange(new Date())

  // Aktif üyeleri al
  const { data: members, error: memberError } = await admin
    .from('users')
    .select('id')
    .eq('role', 'member')
    .eq('is_active', true)

  if (memberError || !members?.length) {
    return NextResponse.json({ ok: true, generated: 0, total: 0 })
  }

  const results = await Promise.allSettled(
    members.map((member) => generateReport(admin, member.id, weekStart, weekEnd))
  )

  // Push bildirim gönder
  const userIds = members.map((m) => m.id)
  await sendPushNotification({
    userIds,
    title: 'Haftalık Raporun Hazır!',
    message: 'Bu haftaki performansını görmek için tıkla 💪',
    url: '/dashboard/haftalik-ozet',
  })

  const succeeded = results.filter((r) => r.status === 'fulfilled').length
  return NextResponse.json({ ok: true, generated: succeeded, total: members.length })
}

async function generateReport(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  weekStart: string,
  weekEnd: string
) {
  // Bu haftaki dersler
  const { count: lessonsCount } = await admin
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('date', weekStart)
    .lte('date', weekEnd)

  const count = lessonsCount ?? 0
  const totalHours = parseFloat((count * 1).toFixed(1))

  // Streak hesapla
  const consecutiveWeeks = await calculateStreak(admin, userId, weekStart)

  const message = generateMessage(count, consecutiveWeeks)

  // Upsert — aynı hafta için tekrar çalışırsa günceller
  await admin.from('weekly_reports').upsert(
    {
      user_id: userId,
      week_start: weekStart,
      week_end: weekEnd,
      lessons_count: count,
      total_hours: totalHours,
      consecutive_weeks: consecutiveWeeks,
      message,
    },
    { onConflict: 'user_id,week_start' }
  )
}

async function calculateStreak(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  currentWeekStart: string
): Promise<number> {
  let streak = 0
  const checkDate = new Date(currentWeekStart)

  for (let i = 0; i < 52; i++) {
    const wStart = checkDate.toISOString().split('T')[0]
    const wEnd = new Date(checkDate)
    wEnd.setDate(checkDate.getDate() + 6)
    const wEndStr = wEnd.toISOString().split('T')[0]

    const { count } = await admin
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('date', wStart)
      .lte('date', wEndStr)

    if ((count ?? 0) > 0) {
      streak++
      checkDate.setDate(checkDate.getDate() - 7) // Önceki haftaya git
    } else {
      break // Seri bozuldu
    }
  }

  return streak
}
