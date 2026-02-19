'use server'

import { sendPushNotification } from '@/lib/push'

export async function sendLowLessonPush(userId: string, remaining: number) {
  const title = remaining === 1 ? 'Son Dersiniz!' : 'Son 2 Dersiniz Kaldı'
  const message =
    remaining === 1
      ? 'Paketinizde yalnızca 1 ders kaldı. Hemen yeni paket alarak kesintisiz devam edin.'
      : 'Paketinizde yalnızca 2 ders kaldı. Yeni paket almak için antrenörünüzle iletişime geçebilirsiniz.'

  await sendPushNotification({
    userIds: [userId],
    title,
    message,
    url: '/dashboard/notifications',
  })
}
