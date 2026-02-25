import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import PushPermissionBanner from '@/components/shared/PushPermissionBanner'

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  // Middleware zaten getUser() ile token doğruladı — burada session'dan oku (network call yok)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAFAFA]">
      <Navbar userName={profile?.full_name || ''} />
      <main className="p-4 md:p-6 max-w-5xl mx-auto relative">
        <PushPermissionBanner />
        {children}
      </main>
    </div>
  )
}
