import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDate, daysRemaining, getPackageStatusLabel } from '@/lib/utils'
import ProgressChart from '@/app/(member)/dashboard/progress/ProgressChartLazy'

export default async function ChildDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: childId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('users')
    .select('id, full_name, gender, parent_id, start_date')
    .eq('id', childId)
    .single()

  if (!child || child.parent_id !== user.id) redirect('/dashboard')

  const [
    { data: packages },
    { data: measurements },
    { data: firstLesson },
  ] = await Promise.all([
    supabase
      .from('packages')
      .select('*, lessons(id, date, notes)')
      .eq('user_id', childId)
      .order('created_at', { ascending: false }),
    supabase
      .from('measurements')
      .select('*')
      .eq('user_id', childId)
      .order('date', { ascending: true }),
    supabase
      .from('lessons')
      .select('date')
      .eq('user_id', childId)
      .order('date', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const activePackage = packages?.find((p) => p.status === 'active')
  const pastPackages = packages?.filter((p) => p.status !== 'active') || []
  const lastMeasurement = measurements && measurements.length > 0 ? measurements[measurements.length - 1] : null

  const remaining = activePackage
    ? activePackage.total_lessons - activePackage.used_lessons
    : 0
  const days = activePackage ? daysRemaining(activePackage.expire_date) : 0

  let statusLabel = 'Paket Yok'
  let statusVariant: 'success' | 'warning' | 'danger' | 'default' = 'default'
  if (activePackage) {
    const ratio = remaining / activePackage.total_lessons
    if (remaining <= 0) { statusLabel = 'Bitti'; statusVariant = 'danger' }
    else if (ratio <= 0.25) { statusLabel = `Son ${remaining} Ders`; statusVariant = 'danger' }
    else if (ratio <= 0.5) { statusLabel = 'Azalıyor'; statusVariant = 'warning' }
    else { statusLabel = 'Aktif'; statusVariant = 'success' }
  }

  const firstName = child.full_name.split(' ')[0]
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  return (
    <div className="space-y-6">
      {/* Geri butonu */}
      <Link href="/dashboard" className="inline-flex items-center gap-1 p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm">Geri</span>
      </Link>

      {/* Hoşgeldin kartı */}
      <Card className="border-primary/20 gradient-border animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{displayName}</h2>
            <p className="text-sm text-text-secondary mt-1">
              Üyelik başlangıcı: {firstLesson?.date ? formatDate(firstLesson.date) : child.start_date ? formatDate(child.start_date) : '-'}
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

      {/* Aktif Paket — Ders Tarihleri */}
      {activePackage?.lessons && activePackage.lessons.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Ders Tarihleri</CardTitle></CardHeader>
          <div className="space-y-1 mt-2">
            {activePackage.lessons
              .sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((lesson: { id: string; date: string; notes: string | null }, i: number) => (
                <div key={lesson.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-text-secondary">#{activePackage.lessons!.length - i}</span>
                  <span>{formatDate(lesson.date)}</span>
                  {lesson.notes && <span className="text-text-secondary text-xs">{lesson.notes}</span>}
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Geçmiş Paketler */}
      {pastPackages.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Geçmiş Paketler</CardTitle></CardHeader>
          <div className="space-y-3 mt-2">
            {pastPackages.map((pkg) => (
              <div key={pkg.id} className="p-3 rounded-lg bg-background">
                <div className="flex items-center justify-between">
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
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Son Ölçüm */}
      {lastMeasurement && (
        <Card>
          <CardHeader><CardTitle>Son Ölçüm</CardTitle></CardHeader>
          <div className="text-xs text-text-secondary mb-3">{formatDate(lastMeasurement.date)}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lastMeasurement.weight && (
              <div className="text-center">
                <div className="text-lg font-bold">{lastMeasurement.weight}</div>
                <div className="text-xs text-text-secondary">kg</div>
              </div>
            )}
            {lastMeasurement.chest && (
              <div className="text-center">
                <div className="text-lg font-bold">{lastMeasurement.chest}</div>
                <div className="text-xs text-text-secondary">Göğüs cm</div>
              </div>
            )}
            {lastMeasurement.waist && (
              <div className="text-center">
                <div className="text-lg font-bold">{lastMeasurement.waist}</div>
                <div className="text-xs text-text-secondary">Bel cm</div>
              </div>
            )}
            {lastMeasurement.arm && (
              <div className="text-center">
                <div className="text-lg font-bold">{lastMeasurement.arm}</div>
                <div className="text-xs text-text-secondary">Kol cm</div>
              </div>
            )}
            {lastMeasurement.leg && (
              <div className="text-center">
                <div className="text-lg font-bold">{lastMeasurement.leg}</div>
                <div className="text-xs text-text-secondary">Bacak cm</div>
              </div>
            )}
            {lastMeasurement.body_fat_pct && (
              <div className="text-center">
                <div className="text-lg font-bold">{lastMeasurement.body_fat_pct}</div>
                <div className="text-xs text-text-secondary">Yağ %</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* İlerleme Grafiği */}
      <Card>
        <CardHeader><CardTitle>Fiziksel İlerleme</CardTitle></CardHeader>
        {measurements && measurements.length > 0 ? (
          <ProgressChart measurements={measurements} gender={child.gender} goals={[]} />
        ) : (
          <p className="text-text-secondary text-center py-8">Henüz ölçüm kaydı yok</p>
        )}
      </Card>
    </div>
  )
}
