import { createClient } from '@/lib/supabase/server'
import MembersList from './MembersList'

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: members } = await supabase
    .from('users')
    .select(`
      *,
      packages(id, total_lessons, used_lessons, status, start_date, expire_date)
    `)
    .eq('role', 'member')
    .is('parent_id', null)
    .order('created_at', { ascending: false })

  return <MembersList initialMembers={members || []} />
}
