import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import WorkoutDayCard from '@/components/shared/WorkoutDayCard'
import { getMonday, formatWeekRange, getTodayDayIndex } from '@/lib/utils'
import type { Workout } from '@/lib/types'

export default async function ProgramPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) redirect('/login')
  const user = session.user

  const monday = getMonday()
  const todayIndex = getTodayDayIndex()

  const { data: workouts } = await supabase
    .from('workouts')
    .select('*, exercises:workout_exercises(*)')
    .eq('type', 'member')
    .eq('user_id', user.id)
    .eq('week_start', monday)
    .order('day_index')

  const hasProgram = workouts && workouts.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Programım</h1>
          <p className="text-sm text-text-secondary">{formatWeekRange(monday)}</p>
        </div>
      </div>

      {hasProgram ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 7 }, (_, i) => {
            const workout = (workouts as Workout[]).find(w => w.day_index === i)
            return (
              <WorkoutDayCard
                key={i}
                dayIndex={i}
                workout={workout}
                isToday={i === todayIndex}
                colSpan={i === 6}
              />
            )
          })}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-text-secondary/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
            <h3 className="font-semibold text-text-primary mb-1">Henüz program atanmadı</h3>
            <p className="text-sm text-text-secondary">
              Antrenörünüz programınızı hazırladığında burada görünecek.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
