import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import WorkoutDayCard from '@/components/shared/WorkoutDayCard'
import { getMonday, formatWeekRange, getTodayDayIndex } from '@/lib/utils'
import type { Workout } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Haftalık Antrenman Programı | Hamza Sivrikaya',
  description: 'Her hafta güncellenen ücretsiz antrenman programı. Pazartesi-Cumartesi antrenman, Pazar aktif dinlenme.',
  openGraph: {
    title: 'Haftalık Antrenman Programı | Hamza Sivrikaya',
    description: 'Her hafta güncellenen ücretsiz antrenman programı.',
  },
}

export default async function AntrenmanlarPage() {
  const supabase = await createClient()
  const monday = getMonday()

  const { data: workouts } = await supabase
    .from('workouts')
    .select('*, exercises:workout_exercises(*)')
    .eq('type', 'public')
    .eq('week_start', monday)
    .order('day_index')

  const todayIndex = getTodayDayIndex()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 text-center">
          <Link href="/" className="inline-block font-display text-lg tracking-wider text-primary mb-4 hover:opacity-80 transition-opacity">
            HAMZA SİVRİKAYA
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl tracking-wider mb-2">
            HAFTALIK <span className="text-primary">ANTRENMAN</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
              <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
              <span className="text-xs font-medium text-primary">Her Hafta Güncellenir</span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-text-secondary mt-3">
            {formatWeekRange(monday)}
          </p>
        </div>
      </div>

      {/* Günler */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 7 }, (_, i) => {
            const workout = (workouts as Workout[] | null)?.find(w => w.day_index === i)
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
        <div className="mt-8 text-center">
          <Link href="/" className="text-primary hover:underline text-sm font-medium">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
