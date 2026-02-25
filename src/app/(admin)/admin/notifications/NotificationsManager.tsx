'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { timeAgo, getNotificationTypeLabel } from '@/lib/utils'
import type { Notification } from '@/lib/types'
import { sendManualPush } from './actions'

type NotifWithUser = Notification & { users: { full_name: string } }

interface Props {
  initialNotifications: NotifWithUser[]
  members: { id: string; full_name: string }[]
}

export default function NotificationsManager({ initialNotifications, members }: Props) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showSendModal, setShowSendModal] = useState(false)
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [clearingRead, setClearingRead] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({ user_id: '', title: '', message: '', url: '' })

  const readCount = notifications.filter((n) => n.is_read).length

  async function handleDelete(id: string) {
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('notifications').delete().eq('id', id)
    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }
    setDeleting(null)
  }

  async function handleClearRead() {
    if (!confirm(`${readCount} okunmuş bildirim silinecek. Emin misiniz?`)) return
    setClearingRead(true)
    const supabase = createClient()
    const readIds = notifications.filter((n) => n.is_read).map((n) => n.id)
    const { error } = await supabase.from('notifications').delete().in('id', readIds)
    if (!error) {
      setNotifications((prev) => prev.filter((n) => !n.is_read))
    }
    setClearingRead(false)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')

    const supabase = createClient()

    if (form.user_id === 'all') {
      const inserts = members.map((m) => ({
        user_id: m.id,
        type: 'manual' as const,
        title: form.title,
        message: form.message,
      }))
      const { error: insertError } = await supabase.from('notifications').insert(inserts)
      if (insertError) { setError(insertError.message); setSending(false); return }
      await sendManualPush(members.map((m) => m.id), form.title, form.message, form.url || undefined)
    } else {
      const { error: insertError } = await supabase.from('notifications').insert({
        user_id: form.user_id,
        type: 'manual',
        title: form.title,
        message: form.message,
      })
      if (insertError) { setError(insertError.message); setSending(false); return }
      await sendManualPush([form.user_id], form.title, form.message, form.url || undefined)
    }

    setShowSendModal(false)
    setForm({ user_id: '', title: '', message: '', url: '' })
    setSending(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
    router.refresh()
  }

  const memberOptions = [
    { value: '', label: 'Üye seçin...' },
    { value: 'all', label: 'Tüm Üyeler' },
    ...members.map((m) => ({ value: m.id, label: m.full_name })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bildirimler</h1>
        <Button onClick={() => setShowSendModal(true)}>Bildirim Gönder</Button>
      </div>

      {success && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-3 text-sm text-success">
          Bildirim gönderildi!
        </div>
      )}

      {/* Bildirim logu */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bildirim Geçmişi</CardTitle>
            {readCount > 0 && (
              <button
                onClick={handleClearRead}
                disabled={clearingRead}
                className="text-xs text-text-secondary hover:text-danger transition-colors cursor-pointer disabled:opacity-50"
              >
                {clearingRead ? 'Siliniyor...' : `${readCount} okunmuşu sil`}
              </button>
            )}
          </div>
        </CardHeader>

        {notifications.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-4">Bildirim yok</p>
        ) : (
          <div className="space-y-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{notif.title}</span>
                    <Badge variant={notif.is_read ? 'default' : 'primary'}>
                      {notif.is_read ? 'Okundu' : 'Okunmadı'}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {notif.users?.full_name} • {getNotificationTypeLabel(notif.type)} • {timeAgo(notif.sent_at)}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">{notif.message}</p>
                </div>

                {/* Sil butonu */}
                <button
                  onClick={() => handleDelete(notif.id)}
                  disabled={deleting === notif.id}
                  title="Sil"
                  className="flex-shrink-0 p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all cursor-pointer disabled:opacity-40 mt-0.5"
                >
                  {deleting === notif.id ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Bildirim gönder modal */}
      <Modal open={showSendModal} onClose={() => setShowSendModal(false)} title="Bildirim Gönder">
        <form onSubmit={handleSend} className="space-y-4">
          <Select
            label="Kime"
            options={memberOptions}
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            required
          />
          <Input
            label="Başlık"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="Bildirim başlığı"
          />
          <Textarea
            label="Mesaj"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            placeholder="Bildirim mesajı..."
          />
          <Input
            label="Yönlendirme URL (opsiyonel)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="/dashboard/progress"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => setShowSendModal(false)}>İptal</Button>
            <Button type="submit" loading={sending}>Gönder</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
