import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDate, daysRemaining, getPackageStatusLabel } from '@/lib/utils'

export default async function MemberDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: activePackage },
    { data: pastPackages },
    { data: recentMeasurement },
    { data: blogPosts },
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase
      .from('packages')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('packages')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'active')
      .order('created_at', { ascending: false }),
    supabase
      .from('measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('blog_posts')
      .select('id, title, slug, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3),
  ])

  const remaining = activePackage
    ? activePackage.total_lessons - activePackage.used_lessons
    : 0
  const days = activePackage ? daysRemaining(activePackage.expire_date) : 0

  // Durum etiketi
  let statusLabel = 'Paket Yok'
  let statusVariant: 'success' | 'warning' | 'danger' | 'default' = 'default'
  if (activePackage) {
    if (remaining <= 0) {
      statusLabel = 'Bitti'
      statusVariant = 'danger'
    } else if (remaining <= 2) {
      statusLabel = 'Son 2 Ders'
      statusVariant = 'warning'
    } else if (days <= 7) {
      statusLabel = 'Süre Doluyor'
      statusVariant = 'warning'
    } else {
      statusLabel = 'Aktif'
      statusVariant = 'success'
    }
  }

  return (
    <div className="space-y-6">
      {/* Hoşgeldin kartı */}
      <Card className="border-primary/20 gradient-border animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Hoşgeldin, {profile?.full_name?.split(' ')[0]?.charAt(0).toUpperCase() + (profile?.full_name?.split(' ')[0]?.slice(1) || '')}</h2>
            <p className="text-sm text-text-secondary mt-1">
              Üyelik başlangıcı: {profile?.start_date ? formatDate(profile.start_date) : '-'}
            </p>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>

        {activePackage && (
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-sm text-text-secondary">Kalan Ders</div>
              <div className="text-2xl font-bold">{remaining}</div>
            </div>
            {/* Progress bar */}
            <div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(activePackage.used_lessons / activePackage.total_lessons) * 100}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {activePackage.used_lessons}/{activePackage.total_lessons} ders tamamlandı
              </p>
            </div>
            <p className="text-xs text-text-secondary">
              Bu paketin kullanım süresi <span className="text-text-primary font-medium">{days} gündür</span>.
            </p>
          </div>
        )}
      </Card>

      {/* Geçmiş Paketler */}
      {pastPackages && pastPackages.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Geçmiş Paketler</CardTitle></CardHeader>
          <div className="space-y-3 mt-2">
            {pastPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between p-3 rounded-lg bg-background">
                <div>
                  <span className="font-medium text-sm">{pkg.total_lessons} Ders Paketi</span>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {formatDate(pkg.start_date)} — {formatDate(pkg.expire_date)}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {pkg.used_lessons}/{pkg.total_lessons} ders tamamlandı
                  </p>
                </div>
                <Badge variant={pkg.status === 'completed' ? 'success' : 'danger'}>
                  {getPackageStatusLabel(pkg.status)}
                </Badge>
              </div>
            ))}
          </div>
          <Link href="/dashboard/packages" className="text-sm text-primary mt-3 inline-block hover:underline">
            Tüm paketleri gör →
          </Link>
        </Card>
      )}

      {/* Hızlı linkler */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link href="/dashboard/progress">
          <Card className="hover-lift card-glow text-center cursor-pointer animate-fade-up delay-300">
            <svg className="w-6 h-6 mx-auto text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium">İlerleme</span>
          </Card>
        </Link>
        <Link href="/dashboard/packages">
          <Card className="hover-lift card-glow text-center cursor-pointer animate-fade-up delay-400">
            <svg className="w-6 h-6 mx-auto text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm font-medium">Paketlerim</span>
          </Card>
        </Link>
        <Link href="/dashboard/notifications">
          <Card className="hover-lift card-glow text-center cursor-pointer animate-fade-up delay-500">
            <svg className="w-6 h-6 mx-auto text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-sm font-medium">Bildirimler</span>
          </Card>
        </Link>
        <Link href="/dashboard/haftalik-ozet">
          <Card className="hover-lift card-glow text-center cursor-pointer animate-fade-up delay-600">
            <svg className="w-6 h-6 mx-auto text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium">Haftalık Özet</span>
          </Card>
        </Link>
      </div>

      {/* Son ölçüm */}
      {recentMeasurement && (
        <Card>
          <CardHeader><CardTitle>Son Ölçüm</CardTitle></CardHeader>
          <div className="text-xs text-text-secondary mb-3">{formatDate(recentMeasurement.date)}</div>
          <div className="grid grid-cols-3 gap-3">
            {recentMeasurement.weight && (
              <div className="text-center">
                <div className="text-lg font-bold">{recentMeasurement.weight}</div>
                <div className="text-xs text-text-secondary">kg</div>
              </div>
            )}
            {recentMeasurement.chest && (
              <div className="text-center">
                <div className="text-lg font-bold">{recentMeasurement.chest}</div>
                <div className="text-xs text-text-secondary">Göğüs cm</div>
              </div>
            )}
            {recentMeasurement.waist && (
              <div className="text-center">
                <div className="text-lg font-bold">{recentMeasurement.waist}</div>
                <div className="text-xs text-text-secondary">Bel cm</div>
              </div>
            )}
            {recentMeasurement.arm && (
              <div className="text-center">
                <div className="text-lg font-bold">{recentMeasurement.arm}</div>
                <div className="text-xs text-text-secondary">Kol cm</div>
              </div>
            )}
            {recentMeasurement.leg && (
              <div className="text-center">
                <div className="text-lg font-bold">{recentMeasurement.leg}</div>
                <div className="text-xs text-text-secondary">Bacak cm</div>
              </div>
            )}
          </div>
          <Link href="/dashboard/progress" className="text-sm text-primary mt-3 inline-block hover:underline">
            Tüm ölçümleri gör →
          </Link>
        </Card>
      )}

      {/* Blog yazıları */}
      {blogPosts && blogPosts.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Son Yazılar</CardTitle></CardHeader>
          <div className="space-y-3">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block p-3 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <div className="font-medium text-sm">{post.title}</div>
                <div className="text-xs text-text-secondary mt-1">
                  {post.published_at ? formatDate(post.published_at) : ''}
                </div>
              </Link>
            ))}
          </div>
          <Link href="/blog" className="text-sm text-primary mt-3 inline-block hover:underline">
            Tüm yazıları gör →
          </Link>
        </Card>
      )}
    </div>
  )
}
