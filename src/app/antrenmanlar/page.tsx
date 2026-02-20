import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LandingNavbar from '@/components/shared/LandingNavbar'
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
    <div className="min-h-screen">
      <LandingNavbar />

      {/* Header */}
      <section className="relative pt-28 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a0000] via-[#120808] to-[#0a0505]" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
            <span className="text-xs font-medium text-primary">Her Hafta Güncellenir</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider mb-4">
            HAFTALIK <span className="text-primary">ANTRENMAN</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            {formatWeekRange(monday)}
          </p>
        </div>
      </section>

      {/* Günler */}
      <section className="max-w-4xl mx-auto px-4 py-12">
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

        {/* Ana sayfa linki */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-primary hover:underline text-sm font-medium"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-primary/15">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-secondary">
            © 2026 Hamza Sivrikaya
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Ana Sayfa</Link>
            <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
