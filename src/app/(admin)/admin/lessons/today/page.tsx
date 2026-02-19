import { createClient } from '@/lib/supabase/server'
import TodayAttendance from './TodayAttendance'

export const dynamic = 'force-dynamic'

export default async function TodayPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  // Aktif paketler + üye adı
  const { data: packages } = await supabase
    .from('packages')
    .select('id, user_id, total_lessons, used_lessons, users(full_name)')
    .eq('status', 'active')

  // Bugün yapılan dersler (ID dahil)
  const { data: todayLessons } = await supabase
    .from('lessons')
    .select('id, package_id')
    .eq('date', today)

  const doneLessonsMap = new Map((todayLessons || []).map((l) => [l.package_id, l.id]))

  const attendees = (packages || [])
    .map((pkg) => ({
      packageId: pkg.id,
      userId: pkg.user_id,
      userName:
        (pkg.users as unknown as { full_name: string })?.full_name || '?',
      totalLessons: pkg.total_lessons,
      usedLessons: pkg.used_lessons,
      doneToday: doneLessonsMap.has(pkg.id),
      lessonId: doneLessonsMap.get(pkg.id) ?? null,
    }))
    .sort((a, b) => {
      // Yapılmayanlar üste
      if (a.doneToday !== b.doneToday) return a.doneToday ? 1 : -1
      return a.userName.localeCompare(b.userName, 'tr')
    })

  return <TodayAttendance attendees={attendees} today={today} />
}
