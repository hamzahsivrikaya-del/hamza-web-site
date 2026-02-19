import { createClient } from '@/lib/supabase/server'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Paralel sorgular
  const [
    { count: activeMembers },
    { data: weeklyLessons },
    { data: lowLessonMembers },
    { data: inactiveMembers },
    { data: todayLessons },
  ] = await Promise.all([
    // Aktif üye sayısı
    supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'member')
      .eq('is_active', true),

    // Bu haftaki dersler
    supabase
      .from('lessons')
      .select('id')
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),

    // Son 2 dersi kalan üyeler
    supabase
      .from('packages')
      .select('user_id, total_lessons, used_lessons, users(full_name)')
      .eq('status', 'active')
      .filter('total_lessons - used_lessons', 'lte', 2),

    // 4+ gün gelmeyen aktif üyeler (aktif üyeler arasından son dersi 4+ gün önce olanlar)
    supabase
      .from('users')
      .select('id, full_name')
      .eq('role', 'member')
      .eq('is_active', true),

    // Bugünkü dersler
    supabase
      .from('lessons')
      .select('id, users(full_name), date')
      .eq('date', new Date().toISOString().split('T')[0]),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* İstatistik Kartları */}
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

      {/* Hızlı Aksiyonlar */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/lessons/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ders Ekle
        </Link>
        <Link
          href="/admin/members?action=new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border text-text-primary rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Yeni Üye
        </Link>
        <Link
          href="/admin/measurements/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border text-text-primary rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Ölçüm Gir
        </Link>
      </div>

      {/* Uyarılar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Son 2 ders kalan */}
        <Card>
          <CardHeader>
            <CardTitle>Son 2 Ders Kalan</CardTitle>
          </CardHeader>
          {lowLessonMembers && lowLessonMembers.length > 0 ? (
            <ul className="space-y-2">
              {lowLessonMembers.map((pkg: Record<string, unknown>) => (
                <li key={pkg.user_id as string} className="flex items-center justify-between">
                  <Link href={`/admin/members/${pkg.user_id}`} className="text-sm hover:text-primary transition-colors">
                    {(pkg.users as Record<string, string>)?.full_name}
                  </Link>
                  <Badge variant="warning">
                    {(pkg.total_lessons as number) - (pkg.used_lessons as number)} ders kaldı
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-secondary">Uyarı yok</p>
          )}
        </Card>

        {/* Bugün gelen üyeler */}
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
    </div>
  )
}
