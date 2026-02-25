-- Hedef bildirimindeki Turkce karakter hatalarini duzelt
UPDATE public.notifications
SET
  title = 'Hedeflerini Belirle!',
  message = 'Artık kişisel hedeflerini belirleyebilirsin! İlerleme sayfasından kilo, yağ yüzdesi veya ölçü hedeflerini gir ve gelişimini takip et.'
WHERE title = 'Hedeflerini Belirle!'
  AND message LIKE '%Artik kisisel%';
