'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Callback'ten sonra session cookie'de gelir
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    // Hash-based flow için (fallback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      // Tüm aktif sessionları kapat — eski şifre artık geçersiz
      await supabase.auth.signOut({ scope: 'global' })
      setTimeout(() => router.push('/login'), 3000)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FAFAFA]" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="font-display text-5xl tracking-wider text-primary">YENİ ŞİFRE</h1>
        </div>

        <div className="animate-fade-up delay-200">
          {success ? (
            <div className="bg-surface/80 backdrop-blur-md rounded-2xl border border-border p-8 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Şifre Güncellendi</h3>
              <p className="text-sm text-text-secondary">
                Yeni şifreniz kaydedildi. Giriş sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          ) : !ready ? (
            <div className="bg-surface/80 backdrop-blur-md rounded-2xl border border-border p-8 text-center">
              <p className="text-sm text-text-secondary">Oturum doğrulanıyor...</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-surface/80 backdrop-blur-md rounded-2xl border border-border p-8 space-y-5 card-glow"
            >
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold">Yeni Şifre Belirleyin</h3>
                <p className="text-sm text-text-secondary mt-1">En az 6 karakter olmalı</p>
              </div>

              <Input
                label="Yeni Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Input
                label="Yeni Şifre (Tekrar)"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {error && (
                <p className="text-sm text-danger text-center animate-fade-in">{error}</p>
              )}

              <Button type="submit" loading={loading} className="w-full press-effect">
                Şifreyi Güncelle
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
