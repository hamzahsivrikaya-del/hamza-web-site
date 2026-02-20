'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import NotificationBell from './NotificationBell'

interface NavbarProps {
  showNotifications?: boolean
}

export default function Navbar({ showNotifications = true }: NavbarProps) {
  const router = useRouter()
  const [userName, setUserName] = useState('')

  async function fetchName() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('users').select('full_name').eq('id', user.id).single()
    if (data) setUserName(data.full_name)
  }

  useEffect(() => {
    fetchName()
    // Settings sayfasından profil güncellenince tetiklenir
    window.addEventListener('profile-updated', fetchName)
    return () => window.removeEventListener('profile-updated', fetchName)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-md flex-shrink-0">
            <span className="text-white text-xs font-black leading-none">HS</span>
          </div>
          <span className="text-sm font-black text-primary uppercase tracking-widest hidden sm:block">
            hamzasivrikaya.com
          </span>
        </Link>

        {/* Sağ: Kullanıcı bilgileri */}
        <div className="flex items-center gap-4">
          {showNotifications && <NotificationBell />}
          <span className="text-sm font-bold text-text-primary uppercase hidden sm:block">{userName}</span>
          <Link
            href="/dashboard/program"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
          >
            Programım
          </Link>
          <Link
            href="/dashboard/haftalik-ozet"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
          >
            Haftalık Özet
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Ayarlar
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Çıkış
          </button>
        </div>
      </div>
    </header>
  )
}
