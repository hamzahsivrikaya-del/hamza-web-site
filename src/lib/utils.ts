// Tailwind class birleştirme
export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ')
}

// Tarih formatlama (Türkçe)
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
  })
}

// Paket bitiş tarihi hesaplama
// Her 10 ders = 40 gün
export function calculateExpireDate(startDate: string, totalLessons: number): string {
  const start = new Date(startDate)
  const days = (totalLessons / 10) * 40
  start.setDate(start.getDate() + days)
  return start.toISOString().split('T')[0]
}

// Kalan gün hesaplama
export function daysRemaining(expireDate: string): number {
  const now = new Date()
  const expire = new Date(expireDate)
  const diff = expire.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// Paket durumu etiketi
export function getPackageStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Aktif',
    completed: 'Tamamlandı',
    expired: 'Süresi Doldu',
  }
  return labels[status] || status
}

// Bildirim tipi etiketi
export function getNotificationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    low_lessons: 'Ders Uyarısı',
    weekly_report: 'Haftalık Rapor',
    inactive: 'Devamsızlık',
    manual: 'Bildirim',
  }
  return labels[type] || type
}

// Zaman farkı (Türkçe)
export function timeAgo(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Az önce'
  if (minutes < 60) return `${minutes} dk önce`
  if (hours < 24) return `${hours} saat önce`
  if (days < 7) return `${days} gün önce`
  return formatDate(date)
}
