import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#111010' }}>

      {/* Arka plan spor ekipmanı grafiti */}
      {/* Barbell — sağ alt köşe */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', right: -60, bottom: 80, opacity: 0.04, pointerEvents: 'none' }}
        width="700" height="260" viewBox="0 0 700 260"
      >
        <ellipse cx="62" cy="130" rx="58" ry="96" fill="#F5F0E8" />
        <ellipse cx="104" cy="130" rx="42" ry="78" fill="#F5F0E8" />
        <rect x="136" y="107" width="62" height="46" rx="8" fill="#F5F0E8" />
        <rect x="198" y="119" width="304" height="22" rx="8" fill="#F5F0E8" />
        <rect x="502" y="107" width="62" height="46" rx="8" fill="#F5F0E8" />
        <ellipse cx="596" cy="130" rx="42" ry="78" fill="#F5F0E8" />
        <ellipse cx="638" cy="130" rx="58" ry="96" fill="#F5F0E8" />
      </svg>

      {/* Dumbbell — sol orta */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', left: -40, top: '38%', opacity: 0.035, pointerEvents: 'none' }}
        width="420" height="150" viewBox="0 0 420 150"
      >
        <ellipse cx="42" cy="75" rx="38" ry="62" fill="#F5F0E8" />
        <ellipse cx="70" cy="75" rx="26" ry="48" fill="#F5F0E8" />
        <rect x="88" y="62" width="40" height="28" rx="5" fill="#F5F0E8" />
        <rect x="128" y="68" width="164" height="16" rx="5" fill="#F5F0E8" />
        <rect x="292" y="62" width="40" height="28" rx="5" fill="#F5F0E8" />
        <ellipse cx="350" cy="75" rx="26" ry="48" fill="#F5F0E8" />
        <ellipse cx="378" cy="75" rx="38" ry="62" fill="#F5F0E8" />
      </svg>

      {/* Kettlebell — sağ üst */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', right: 60, top: 120, opacity: 0.03, pointerEvents: 'none' }}
        width="160" height="200" viewBox="0 0 160 200"
      >
        <path d="M80 10 C50 10 30 30 28 55 C10 60 5 80 5 95 C5 145 38 185 80 185 C122 185 155 145 155 95 C155 80 150 60 132 55 C130 30 110 10 80 10 Z" fill="#F5F0E8" />
        <rect x="60" y="2" width="40" height="16" rx="8" fill="none" stroke="#F5F0E8" strokeWidth="10" />
      </svg>

      <Navbar />
      <main className="p-4 md:p-6 max-w-5xl mx-auto relative">
        {children}
      </main>
    </div>
  )
}
