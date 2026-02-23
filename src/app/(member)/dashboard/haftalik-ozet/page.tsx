import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import WeeklyReportList from './WeeklyReportList'

export default async function HaftalikOzetPage() {
  // Kimlik doğrulama
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // RLS'yi aşmak için admin client ile veri çek (kimlik zaten doğrulandı)
  const admin = createAdminClient()
  const { data: reports } = await admin
    .from('weekly_reports')
    .select('*')
    .eq('user_id', user.id)
    .order('week_start', { ascending: false })
    .limit(12)

  return <WeeklyReportList reports={reports || []} />
}
