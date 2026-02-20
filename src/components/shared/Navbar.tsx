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
        <Link href="/" className="group flex items-center gap-2 px-2.5 py-1.5 -ml-2.5 rounded-lg hover:bg-surface-hover transition-colors" title="Ana Sayfa">
          <svg className="w-[18px] h-[18px] text-text-secondary group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-sm font-semibold text-text-secondary group-hover:text-primary transition-colors hidden sm:block">
            Ana Sayfa
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
