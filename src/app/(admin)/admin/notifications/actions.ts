'use server'

import { sendPushNotification } from '@/lib/push'

export async function sendManualPush(userIds: string[], title: string, message: string) {
  await sendPushNotification({ userIds, title, message, url: '/dashboard/notifications' })
}
