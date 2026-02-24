import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDate, daysRemaining, getPackageStatusLabel } from '@/lib/utils'
import type { MemberMeal, Package, Measurement } from '@/lib/types'

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
    { data: firstLesson },
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
    supabase
      .from('lessons')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  // Bağlı üyeler (çocuklar)
  const { data: dependents } = await supabase
    .from('users')
    .select('id, full_name, gender')
    .eq('parent_id', user.id)

  const dependentData = await Promise.all(
    (dependents || []).map(async (dep) => {
      const [{ data: pkg }, { data: measurement }] = await Promise.all([
        supabase.from('packages').select('*').eq('user_id', dep.id).eq('status', 'active')
          .order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('measurements').select('*').eq('user_id', dep.id)
          .order('date', { ascending: false }).limit(1).maybeSingle(),
      ])
      return { ...dep, activePackage: pkg as Package | null, recentMeasurement: measurement as Measurement | null }
    })
  )

  // Üyeye atanmış öğünler
  const todayDate = new Date().toISOString().split('T')[0]
  const { data: memberMeals } = await supabase
    .from('member_meals')
    .select('*')
    .eq('user_id', user.id)
    .order('order_num')

  // Bugünün beslenme kayıtları
  const { data: todayMeals } = await supabase
    .from('meal_logs')
    .select('meal_id, status')
    .eq('user_id', user.id)
    .eq('date', todayDate)

  const remaining = activePackage
    ? activePackage.total_lessons - activePackage.used_lessons
    : 0
  const days = activePackage ? daysRemaining(activePackage.expire_date) : 0

  // Durum etiketi — oran bazlı gradyan
  let statusLabel = 'Paket Yok'
  let statusVariant: 'success' | 'warning' | 'danger' | 'default' = 'default'
  if (activePackage) {
    const ratio = remaining / activePackage.total_lessons
    if (remaining <= 0) {
      statusLabel = 'Bitti'
      statusVariant = 'danger'
    } else if (ratio <= 0.25) {
      statusLabel = `Son ${remaining} Ders`
      statusVariant = 'danger'
    } else if (ratio <= 0.5) {
      statusLabel = 'Azalıyor'
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
              Üyelik başlangıcı: {firstLesson?.date ? formatDate(firstLesson.date) : profile?.start_date ? formatDate(profile.start_date) : '-'}
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

      {/* Bugünün Beslenmesi */}
      <Link href="/dashboard/beslenme" className="block">
        <Card className="hover-lift card-glow gradient-border border-primary/20 animate-fade-up delay-100">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2v9a3 3 0 003 3v7a1 1 0 002 0v-7a3 3 0 003-3V2h-2v9a1 1 0 01-1 1h-2a1 1 0 01-1-1V2H7zM17 2v20a1 1 0 002 0v-8h1a2 2 0 002-2V5a3 3 0 00-3-3h-2z" />
            </svg>
            <h3 className="font-semibold text-text-primary">Beslenme Raporu</h3>
          </div>
          {memberMeals && memberMeals.length > 0 ? (
            <>
              <div className="flex gap-2">
                {(memberMeals as MemberMeal[]).map((meal) => {
                  const log = todayMeals?.find((m: { meal_id: string; status: string }) => m.meal_id === meal.id)
                  return (
                    <div key={meal.id} className={`flex-1 text-center py-2 rounded-lg text-xs font-medium ${
                      !log ? 'bg-border text-text-secondary' :
                      log.status === 'compliant' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {meal.name}
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-text-secondary mt-2">
                {todayMeals?.filter((m: { status: string }) => m.status === 'compliant').length || 0}/{todayMeals?.length || 0} öğün uyumlu
              </p>
            </>
          ) : (
            <p className="text-sm text-text-secondary">Henüz öğün planı atanmadı</p>
          )}
        </Card>
      </Link>

      {/* Hızlı linkler */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/dashboard/program">
          <Card className="hover-lift card-glow text-center cursor-pointer animate-fade-up delay-200">
            <svg className="w-6 h-6 mx-auto text-primary mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
            <span className="text-sm font-medium">Programım</span>
          </Card>
        </Link>
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
        <Link href="/dashboard/haftalik-ozet">
          <Card className="hover-lift card-glow text-center cursor-pointer animate-fade-up delay-500">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
            {recentMeasurement.body_fat_pct && (
              <div className="text-center">
                <div className="text-lg font-bold">{recentMeasurement.body_fat_pct}</div>
                <div className="text-xs text-text-secondary">Yağ %</div>
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
      {/* Bağlı Üyeler (Çocuklar) */}
      {dependentData.length > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-medium">Bağlı Kişiler</p>
          {dependentData.map((dep) => {
            const depRemaining = dep.activePackage
              ? dep.activePackage.total_lessons - dep.activePackage.used_lessons
              : 0
            const depRatio = dep.activePackage ? depRemaining / dep.activePackage.total_lessons : 0
            const depPct = dep.activePackage
              ? Math.round((dep.activePackage.used_lessons / dep.activePackage.total_lessons) * 100)
              : 0
            let depStatusLabel = 'Paket Yok'
            let depStatusVariant: 'success' | 'warning' | 'danger' | 'default' = 'default'
            if (dep.activePackage) {
              if (depRemaining <= 0) { depStatusLabel = 'Bitti'; depStatusVariant = 'danger' }
              else if (depRatio <= 0.25) { depStatusLabel = `Son ${depRemaining} Ders`; depStatusVariant = 'danger' }
              else if (depRatio <= 0.5) { depStatusLabel = 'Azalıyor'; depStatusVariant = 'warning' }
              else { depStatusLabel = 'Aktif'; depStatusVariant = 'success' }
            }
            const initials = dep.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

            return (
              <Card key={dep.id} className="overflow-hidden animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary tracking-tight">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-[15px] truncate">{dep.full_name}</h3>
                    <p className="text-xs text-text-secondary">Bağlı Üye</p>
                  </div>
                  <Badge variant={depStatusVariant}>{depStatusLabel}</Badge>
                </div>

                {dep.activePackage && (
                  <div className="bg-background rounded-xl p-3.5 mb-3">
                    {depRemaining <= 2 && depRemaining > 0 && (
                      <div className="flex items-center gap-2 p-2.5 mb-3 rounded-lg bg-red-50 border border-red-200">
                        <svg className="w-4 h-4 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-xs text-danger font-medium">
                          {depRemaining === 1 ? `${dep.full_name} için son ders! Yeni paket gerekiyor.` : `${dep.full_name} için son ${depRemaining} ders kaldı.`}
                        </p>
                      </div>
                    )}
                    {depRemaining <= 0 && dep.activePackage && (
                      <div className="flex items-center gap-2 p-2.5 mb-3 rounded-lg bg-red-50 border border-red-200">
                        <svg className="w-4 h-4 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <p className="text-xs text-danger font-medium">{dep.full_name} paketi bitti. Yeni paket alınmalı.</p>
                      </div>
                    )}
                    <div className="flex items-end justify-between mb-2.5">
                      <div>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest">Kalan Ders</p>
                        <p className="text-2xl font-bold text-text-primary -mt-0.5">{depRemaining}</p>
                      </div>
                      <p className="text-xs text-text-secondary">
                        {dep.activePackage.used_lessons}/{dep.activePackage.total_lessons} tamamlandı
                      </p>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${depPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {dep.recentMeasurement && (
                  <div className="flex gap-3 mb-3">
                    {dep.recentMeasurement.weight && (
                      <div className="flex-1 bg-background rounded-lg p-2.5 text-center">
                        <p className="text-base font-bold text-text-primary">{dep.recentMeasurement.weight}</p>
                        <p className="text-[10px] text-text-secondary">kg</p>
                      </div>
                    )}
                    {dep.recentMeasurement.body_fat_pct && (
                      <div className="flex-1 bg-background rounded-lg p-2.5 text-center">
                        <p className="text-base font-bold text-orange-500">{dep.recentMeasurement.body_fat_pct}%</p>
                        <p className="text-[10px] text-text-secondary">yağ</p>
                      </div>
                    )}
                  </div>
                )}

                <Link
                  href={`/dashboard/cocuk/${dep.id}`}
                  className="flex items-center justify-between p-2.5 -mx-1 rounded-lg hover:bg-surface-hover transition-colors group"
                >
                  <span className="text-sm text-primary font-medium">Detayları gör</span>
                  <svg className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
