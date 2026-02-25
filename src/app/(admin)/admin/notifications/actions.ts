'use server'

import { sendPushNotification } from '@/lib/push'

export async function sendManualPush(userIds: string[], title: string, message: string, url?: string) {
  await sendPushNotification({ userIds, title, message, url: url || '/dashboard/notifications' })
}
