import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

function AlertsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-surface rounded-2xl border border-border p-5 space-y-3">
          <div className="h-5 bg-border rounded w-36" />
          {[...Array(3)].map((_, j) => (
            <div key={j} className="flex items-center justify-between">
              <div className="h-4 bg-border rounded w-32" />
              <div className="h-5 bg-border rounded-full w-20" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Kritik: istatistik kartları — hemen render
  const [
    { count: activeMembers },
    { data: weeklyLessons },
    { data: todayLessons },
  ] = await Promise.all([
    supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'member')
      .eq('is_active', true),
    supabase
      .from('lessons')
      .select('id')
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    supabase
      .from('lessons')
      .select('id, users(full_name), date')
      .eq('date', new Date().toISOString().split('T')[0]),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* İstatistik Kartları — hemen render */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="text-text-secondary text-sm">Aktif Üyeler</div>
          <div className="text-3xl font-bold mt-1">{activeMembers || 0}</div>
        </Card>
        <Card>
          <div className="text-text-secondary text-sm">Bu Hafta Ders</div>
          <div className="text-3xl font-bold mt-1">{weeklyLessons?.length || 0}</div>
        </Card>
        <Card>
          <div className="text-text-secondary text-sm">Bugün Ders</div>
          <div className="text-3xl font-bold mt-1">{todayLessons?.length || 0}</div>
        </Card>
      </div>

      {/* Hızlı Aksiyonlar — hemen render */}
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        <Link
          href="/admin/lessons/new"
          className="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-3 sm:py-2.5 bg-primary text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-hover active:bg-primary-hover transition-colors"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Ders Ekle</span>
        </Link>
        <Link
          href="/admin/members?action=new"
          className="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-3 sm:py-2.5 bg-surface border border-border text-text-primary rounded-lg text-xs sm:text-sm font-medium hover:bg-surface-hover active:bg-surface-hover transition-colors"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Yeni Üye</span>
        </Link>
        <Link
          href="/admin/measurements/new"
          className="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-3 sm:py-2.5 bg-surface border border-border text-text-primary rounded-lg text-xs sm:text-sm font-medium hover:bg-surface-hover active:bg-surface-hover transition-colors"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Ölçüm Gir</span>
        </Link>
      </div>

      {/* Uyarılar — ertelenmiş */}
      <Suspense fallback={<AlertsSkeleton />}>
        <DeferredAlerts todayLessons={todayLessons} />
      </Suspense>
    </div>
  )
}

async function DeferredAlerts({ todayLessons }: { todayLessons: Record<string, unknown>[] | null }) {
  const supabase = await createClient()

  const { data: lowLessonMembers_raw } = await supabase
    .from('packages')
    .select('user_id, total_lessons, used_lessons, status, users(full_name)')
    .in('status', ['active', 'completed'])

  const renewedUserIds = new Set(
    (lowLessonMembers_raw || [])
      .filter(pkg => pkg.status === 'active')
      .map(pkg => pkg.user_id)
  )

  const alertMembers = (lowLessonMembers_raw || [])
    .filter((pkg) => {
      if (pkg.status === 'completed' && renewedUserIds.has(pkg.user_id)) return false
      return pkg.status === 'completed' || (pkg.total_lessons - pkg.used_lessons) <= 2
    })
    .sort((a, b) => {
      const remA = a.status === 'completed' ? -1 : (a.total_lessons - a.used_lessons)
      const remB = b.status === 'completed' ? -1 : (b.total_lessons - b.used_lessons)
      return remA - remB
    })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paket Uyarıları</CardTitle>
        </CardHeader>
        {alertMembers.length > 0 ? (
          <ul className="space-y-1">
            {alertMembers.map((pkg) => {
              const remaining = pkg.total_lessons - pkg.used_lessons
              const isCompleted = pkg.status === 'completed'
              return (
                <li key={pkg.user_id}>
                  <Link href={`/admin/members/${pkg.user_id}`} className="flex items-center justify-between py-2 px-1 -mx-1 rounded-lg hover:bg-surface-hover active:bg-surface-hover transition-colors">
                    <span className="text-sm text-text-primary">
                      {((pkg.users as unknown) as { full_name: string })?.full_name}
                    </span>
                    <Badge variant={isCompleted || remaining <= 1 ? 'danger' : 'warning'}>
                      {isCompleted ? 'Paket Bitti' : remaining === 1 ? 'Son 1 Ders' : 'Son 2 Ders'}
                    </Badge>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-text-secondary">Uyarı yok</p>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bugün Gelen Üyeler</CardTitle>
        </CardHeader>
        {todayLessons && todayLessons.length > 0 ? (
          <ul className="space-y-2">
            {todayLessons.map((lesson: Record<string, unknown>) => (
              <li key={lesson.id as string} className="text-sm">
                {(lesson.users as Record<string, string>)?.full_name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-secondary">Bugün henüz ders yok</p>
        )}
      </Card>
    </div>
  )
}
