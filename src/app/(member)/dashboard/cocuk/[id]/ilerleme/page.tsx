import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProgressChart from '@/app/(member)/dashboard/progress/ProgressChartLazy'

export default async function ChildProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: childId } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) redirect('/login')
  const user = session.user

  // Çocuğun bu veliye ait olduğunu doğrula
  const { data: child } = await supabase
    .from('users')
    .select('id, full_name, gender, parent_id')
    .eq('id', childId)
    .single()

  if (!child || child.parent_id !== user.id) redirect('/dashboard')

  const { data: measurements } = await supabase
    .from('measurements')
    .select('*')
    .eq('user_id', childId)
    .order('date', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/cocuk/${childId}`} className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">{child.full_name} - İlerleme</h1>
      </div>
      {measurements && measurements.length > 0 ? (
        <ProgressChart measurements={measurements} gender={child.gender} goals={[]} />
      ) : (
        <div className="rounded-xl border border-border p-16 text-center bg-surface">
          <p className="text-text-secondary">Henüz ölçüm kaydı yok</p>
        </div>
      )}
    </div>
  )
}
