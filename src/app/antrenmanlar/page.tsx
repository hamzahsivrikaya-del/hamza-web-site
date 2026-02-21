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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Atmosferik arka plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] via-[#0d0808] to-[#0a0505]" />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/12 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-orange-500/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
        {/* Floating spor figürleri */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Büyük dumbbell - sol üst */}
          <svg className="absolute top-[5%] left-[3%] w-32 h-32 text-primary opacity-[0.06] rotate-[-20deg] animate-float" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
          {/* Koşucu - sağ üst */}
          <svg className="absolute top-[12%] right-[8%] w-24 h-24 text-primary opacity-[0.07] rotate-[10deg] animate-float-slow" style={{ animationDelay: '1s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
          </svg>
          {/* Kettlebell - orta sol */}
          <svg className="absolute top-[35%] left-[6%] w-20 h-20 text-primary opacity-[0.05] rotate-[15deg] animate-float-drift" style={{ animationDelay: '3s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a4 4 0 00-3 6.65V11H8a3 3 0 00-3 3v4a3 3 0 003 3h8a3 3 0 003-3v-4a3 3 0 00-3-3h-1V8.65A4 4 0 0012 2zm0 2a2 2 0 110 4 2 2 0 010-4z"/>
          </svg>
          {/* Küçük dumbbell - sağ orta */}
          <svg className="absolute top-[45%] right-[4%] w-16 h-16 text-primary opacity-[0.08] rotate-[40deg] animate-float" style={{ animationDelay: '2s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
          {/* Kalp - sol alt */}
          <svg className="absolute top-[60%] left-[10%] w-14 h-14 text-primary opacity-[0.06] rotate-[-10deg] animate-float-slow" style={{ animationDelay: '4s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {/* Yıldırım - sağ alt */}
          <svg className="absolute top-[72%] right-[12%] w-18 h-18 text-orange-500 opacity-[0.07] -rotate-[15deg] animate-float-drift" style={{ animationDelay: '5s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
          </svg>
          {/* Büyük dumbbell - alt orta */}
          <svg className="absolute top-[85%] left-[25%] w-28 h-28 text-primary opacity-[0.04] rotate-[55deg] animate-float-slow" style={{ animationDelay: '2.5s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
          {/* Timer - sol alt köşe */}
          <svg className="absolute top-[90%] right-[5%] w-12 h-12 text-primary opacity-[0.06] rotate-[5deg] animate-float" style={{ animationDelay: '6s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="relative border-b border-border bg-background/40 backdrop-blur-sm">
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
      <div className="relative max-w-3xl mx-auto px-4 py-6 sm:py-10">
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
