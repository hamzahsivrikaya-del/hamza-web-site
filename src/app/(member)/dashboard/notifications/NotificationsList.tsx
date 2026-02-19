'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { timeAgo, getNotificationTypeLabel } from '@/lib/utils'
import type { Notification } from '@/lib/types'

export default function NotificationsList({ initialNotifications }: { initialNotifications: Notification[] }) {
  // Sayfa açıldığında tüm bildirimleri okundu yap
  useEffect(() => {
    async function markAllRead() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
    }
    markAllRead()
  }, [])

  if (initialNotifications.length === 0) {
    return (
      <Card>
        <p className="text-text-secondary text-center py-8">Bildirim yok</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {initialNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={!notification.is_read ? 'border-primary/20' : ''}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{notification.title}</h3>
                {!notification.is_read && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <Badge>{getNotificationTypeLabel(notification.type)}</Badge>
              <p className="text-xs text-text-secondary mt-1">{timeAgo(notification.sent_at)}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
