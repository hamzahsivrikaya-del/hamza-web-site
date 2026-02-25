import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  // Middleware zaten getUser() ile token doğruladı — session'dan oku (network call yok)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', session.user.id)
    .single()

  return <AdminLayoutClient userName={profile?.full_name || 'Admin'}>{children}</AdminLayoutClient>
}
