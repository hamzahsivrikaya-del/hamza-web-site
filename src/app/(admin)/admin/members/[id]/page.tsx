import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import MemberDetail from './MemberDetail'

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: member },
    { data: packages },
    { data: measurements },
    { data: lessons },
    { data: mealLogs },
    { data: memberMeals },
  ] = await Promise.all([
    supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('packages')
      .select('*, lessons(id, date, notes)')
      .eq('user_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('measurements')
      .select('*')
      .eq('user_id', id)
      .order('date', { ascending: false }),
    supabase
      .from('lessons')
      .select('*, packages(total_lessons)')
      .eq('user_id', id)
      .order('date', { ascending: false }),
    supabase
      .from('meal_logs')
      .select('*, member_meal:member_meals(id, name)')
      .eq('user_id', id)
      .order('date', { ascending: false })
      .limit(120),
    supabase
      .from('member_meals')
      .select('*')
      .eq('user_id', id)
      .order('order_num'),
  ])

  if (!member) notFound()

  return (
    <MemberDetail
      member={member}
      packages={packages || []}
      measurements={measurements || []}
      lessons={lessons || []}
      mealLogs={mealLogs || []}
      memberMeals={memberMeals || []}
    />
  )
}
