/**
 * Son tamamlanan haftanın (Pazartesi-Pazar) başlangıç ve bitiş tarihini döndürür.
 * Pazar: o haftayı döndürür. Pazartesi-Cumartesi: önceki haftayı döndürür.
 */
export function getWeekRange(date: Date): { weekStart: string; weekEnd: string } {
  const d = new Date(date)
  const day = d.getDay() // 0=Pazar, 1=Pazartesi, ...

  // En son Pazar'ı bul (bugün Pazar ise bugün)
  const diffToSunday = day === 0 ? 0 : -day
  const sunday = new Date(d)
  sunday.setDate(d.getDate() + diffToSunday)
  sunday.setHours(0, 0, 0, 0)

  // O haftanın Pazartesi'si (6 gün geri)
  const monday = new Date(sunday)
  monday.setDate(sunday.getDate() - 6)

  return {
    weekStart: monday.toISOString().split('T')[0],
    weekEnd: sunday.toISOString().split('T')[0],
  }
}

/**
 * Performansa göre motivasyonel mesaj üretir.
 */
export function generateMessage(lessonsCount: number, consecutiveWeeks: number, nutritionCompliance?: number | null): string {
  let msg: string

  // Streak öncelikli mesajlar
  if (consecutiveWeeks >= 8 && lessonsCount >= 2)
    msg = `${consecutiveWeeks} haftadır sporunuzu aksatmadınız! İnanılmaz bir disiplin sergiliyorsunuz. 🏆`
  else if (consecutiveWeeks >= 4 && lessonsCount >= 2)
    msg = `${consecutiveWeeks} haftadır düzenli antrenman yapıyorsunuz! Bu alışkanlık hayatınızı değiştiriyor. ⭐`
  // Haftalık performans
  else if (lessonsCount === 0)
    msg = 'Bu hafta mola verdik. Dinlenmek de antrenman! Gelecek hafta sizi bekliyoruz. 💪'
  else if (lessonsCount === 1)
    msg = 'Bu hafta 1 ders yaptınız. Harika bir başlangıç! Her adım hedefe yaklaştırır. 🌟'
  else if (lessonsCount === 2)
    msg = 'Bu hafta 2 ders yaptınız. Çok iyi gidiyorsunuz! Düzenlilik en büyük anahtarınız. 🔥'
  else if (lessonsCount === 3)
    msg = `Bu hafta 3 ders yaptınız! Harika bir performans. Böyle devam edin! 💪🔥`
  else
    msg = `Bu hafta ${lessonsCount} ders yaptınız! Mükemmel bir hafta geçirdiniz. Siz bir şampiyonsunuz! 🏆`

  if (nutritionCompliance !== null && nutritionCompliance !== undefined) {
    if (nutritionCompliance >= 80) {
      msg += ` Beslenme uyumunuz %${nutritionCompliance} — harika!`
    } else if (nutritionCompliance >= 50) {
      msg += ` Beslenme uyumunuz %${nutritionCompliance} — daha iyi olabilir.`
    } else if (nutritionCompliance > 0) {
      msg += ` Beslenme uyumunuz %${nutritionCompliance} — bu hafta beslenmemize dikkat edelim.`
    }
  }

  return msg
}
