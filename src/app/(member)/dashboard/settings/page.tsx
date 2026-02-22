'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { updateProfile } from './actions'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type Tab = 'profil' | 'sifre' | 'fotograf'

export default function MemberSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profil')
  const router = useRouter()

  // Profil state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [profilLoading, setProfilLoading] = useState(false)
  const [profilMessage, setProfilMessage] = useState('')
  const [profilError, setProfilError] = useState('')

  // Şifre state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sifreLoading, setSifreLoading] = useState(false)
  const [sifreMessage, setSifreMessage] = useState('')
  const [sifreError, setSifreError] = useState('')

  // Fotoğraf state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState('')
  const [avatarError, setAvatarError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('users').select('full_name, phone, avatar_url').eq('id', user.id).single()
      if (data) {
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
        setAvatarUrl(data.avatar_url || null)
      }
    }
    loadProfile()
  }, [])

  async function handleProfilSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProfilError('')
    setProfilMessage('')
    if (!fullName.trim()) { setProfilError('İsim boş olamaz'); return }
    setProfilLoading(true)
    try {
      await updateProfile(fullName, phone)
      setProfilMessage('Profil bilgileri güncellendi')
      window.dispatchEvent(new CustomEvent('profile-updated'))
    } catch { setProfilError('Güncelleme başarısız') }
    setProfilLoading(false)
  }

  async function handleSifreSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSifreError('')
    setSifreMessage('')
    if (newPassword !== confirmPassword) { setSifreError('Şifreler eşleşmiyor'); return }
    if (newPassword.length < 6) { setSifreError('Şifre en az 6 karakter olmalı'); return }
    setSifreLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) setSifreError(error.message)
      else {
        setSifreMessage('Şifre başarıyla güncellendi')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch { setSifreError('Bir hata oluştu') }
    setSifreLoading(false)
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setAvatarError('Dosya 2MB\'dan küçük olmalı'); return }
    setAvatarError('')
    setAvatarMessage('')
    setAvatarLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const ext = file.name.split('.').pop()
      const path = `${user!.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (uploadError) { setAvatarError('Yükleme başarısız'); setAvatarLoading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user!.id)
      setAvatarUrl(publicUrl)
      setAvatarMessage('Fotoğraf güncellendi')
    } catch { setAvatarError('Bir hata oluştu') }
    setAvatarLoading(false)
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'profil', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { key: 'sifre', label: 'Şifre', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { key: 'fotograf', label: 'Fotoğraf', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ]

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Ayarlar</h1>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profil Sekmesi */}
      {activeTab === 'profil' && (
        <Card>
          <CardHeader><CardTitle>Profil Bilgileri</CardTitle></CardHeader>
          <form onSubmit={handleProfilSubmit} className="space-y-4 mt-4">
            <Input
              label="Ad Soyad"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Telefon"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xx xxx xx xx"
            />
            {profilError && <p className="text-sm text-danger">{profilError}</p>}
            {profilMessage && <p className="text-sm text-green-500">{profilMessage}</p>}
            <Button type="submit" loading={profilLoading}>Kaydet</Button>
          </form>
        </Card>
      )}

      {/* Şifre Sekmesi */}
      {activeTab === 'sifre' && (
        <Card>
          <CardHeader><CardTitle>Şifre Değiştir</CardTitle></CardHeader>
          <form onSubmit={handleSifreSubmit} className="space-y-4 mt-4">
            <Input
              label="Yeni Şifre"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Yeni Şifre (Tekrar)"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {sifreError && <p className="text-sm text-danger">{sifreError}</p>}
            {sifreMessage && <p className="text-sm text-green-500">{sifreMessage}</p>}
            <Button type="submit" loading={sifreLoading}>Şifreyi Güncelle</Button>
          </form>
        </Card>
      )}

      {/* Fotoğraf Sekmesi */}
      {activeTab === 'fotograf' && (
        <Card>
          <CardHeader><CardTitle>Profil Fotoğrafı</CardTitle></CardHeader>
          <div className="mt-4 space-y-5">
            {/* Mevcut fotoğraf */}
            <div className="flex justify-center">
              <div className="relative w-28 h-28 rounded-full bg-surface border-2 border-border overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Profil" fill className="object-cover" sizes="112px" />
                ) : (
                  <svg className="w-12 h-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div className="text-center space-y-3">
              <Button
                type="button"
                loading={avatarLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}
              </Button>
              <p className="text-xs text-text-secondary">JPG, PNG veya WebP — max 2MB</p>
            </div>

            {avatarError && <p className="text-sm text-danger text-center">{avatarError}</p>}
            {avatarMessage && <p className="text-sm text-green-500 text-center">{avatarMessage}</p>}
          </div>
        </Card>
      )}
    </div>
  )
}
