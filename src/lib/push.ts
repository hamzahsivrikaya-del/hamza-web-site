/**
 * Belirtilen kullanıcılara push bildirimi gönder.
 * Sadece server-side (Server Actions / API routes) içinde kullan.
 */
export async function sendPushNotification({
  userIds,
  title,
  message,
  url,
}: {
  userIds: string[]
  title: string
  message: string
  url?: string
}) {
  if (!userIds.length) return

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  await fetch(`${baseUrl}/api/push/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-token': process.env.SUPABASE_SERVICE_ROLE_KEY!,
    },
    body: JSON.stringify({ userIds, title, message, url }),
  }).catch(() => {
    // Push başarısız olsa bile ana akışı bozmayalım
  })
}
