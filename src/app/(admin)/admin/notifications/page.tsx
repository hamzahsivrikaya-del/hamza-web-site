import { createClient } from '@/lib/supabase/server'
import NotificationsManager from './NotificationsManager'

export default async function AdminNotificationsPage() {
  const supabase = await createClient()

  const [
    { data: notifications },
    { data: members },
  ] = await Promise.all([
    supabase
      .from('notifications')
      .select('*, users(full_name)')
      .order('sent_at', { ascending: false })
      .limit(50),
    supabase
      .from('users')
      .select('id, full_name')
      .eq('role', 'member')
      .eq('is_active', true)
      .order('full_name'),
  ])

  return (
    <NotificationsManager
      initialNotifications={notifications || []}
      members={members || []}
    />
  )
}
