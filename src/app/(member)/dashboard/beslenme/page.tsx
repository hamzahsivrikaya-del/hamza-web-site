import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BeslenmeClient from './BeslenmeClient'

export const metadata = { title: 'Beslenme Takibi' }

export default async function BeslenmePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) redirect('/login')
  const user = session.user

  const todayStr = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Üyeye atanmış öğünler
  const { data: memberMeals } = await supabase
    .from('member_meals')
    .select('*')
    .eq('user_id', user.id)
    .order('order_num')

  // Son 30 günlük beslenme kayıtları
  const { data: mealLogs } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('date', { ascending: false })

  return (
    <BeslenmeClient
      userId={user.id}
      memberMeals={memberMeals || []}
      initialLogs={mealLogs || []}
      today={todayStr}
    />
  )
}
