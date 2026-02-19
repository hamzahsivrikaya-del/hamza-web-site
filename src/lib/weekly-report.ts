/**
 * Bu haftanın (Pazartesi-Pazar) başlangıç ve bitiş tarihini döndürür.
 * Pazar günü çalıştığında, tamamlanan haftayı döndürür.
 */
export function getWeekRange(date: Date): { weekStart: string; weekEnd: string } {
  const d = new Date(date)
  const day = d.getDay() // 0=Pazar, 1=Pazartesi, ...
  // Pazartesi'ye git
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    weekStart: monday.toISOString().split('T')[0],
    weekEnd: sunday.toISOString().split('T')[0],
  }
}

/**
 * Performansa göre motivasyonel mesaj üretir.
 */
export function generateMessage(lessonsCount: number, consecutiveWeeks: number): string {
  // Streak öncelikli mesajlar
  if (consecutiveWeeks >= 8 && lessonsCount >= 2)
    return `${consecutiveWeeks} haftadır sporunuzu aksatmadınız! İnanılmaz bir disiplin sergiliyorsunuz. 🏆`
  if (consecutiveWeeks >= 4 && lessonsCount >= 2)
    return `${consecutiveWeeks} haftadır düzenli antrenman yapıyorsunuz! Bu alışkanlık hayatınızı değiştiriyor. ⭐`

  // Haftalık performans
  if (lessonsCount === 0)
    return 'Bu hafta mola verdik. Dinlenmek de antrenman! Gelecek hafta sizi bekliyoruz. 💪'
  if (lessonsCount === 1)
    return 'Bu hafta 1 ders yaptınız. Harika bir başlangıç! Her adım hedefe yaklaştırır. 🌟'
  if (lessonsCount === 2)
    return 'Bu hafta 2 ders yaptınız. Çok iyi gidiyorsunuz! Düzenlilik en büyük anahtarınız. 🔥'
  if (lessonsCount === 3)
    return `Bu hafta 3 ders yaptınız! Harika bir performans. Böyle devam edin! 💪🔥`
  return `Bu hafta ${lessonsCount} ders yaptınız! Mükemmel bir hafta geçirdiniz. Siz bir şampiyonsunuz! 🏆`
}
