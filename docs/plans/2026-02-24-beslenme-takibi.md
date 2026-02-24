# Beslenme Takibi (Nutrition Tracking) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **For Claude:** REQUIRED SUB-SKILL: Use frontend-design skill for all UI components.

**Goal:** Üyelerin günlük öğün bazlı beslenme check-in'i yapabilmesi, fotoğraf yükleyebilmesi ve admin'in tüm üyelerin beslenme uyumunu takip edebilmesi.

**Architecture:** Yeni `meal_logs` tablosu + `meal_photos` storage bucket. Üye panelinde `/dashboard/beslenme` sayfası (günlük öğün kartları). Admin panelinde üye detayına "Beslenme" tab'ı eklenir. Haftalık rapora beslenme uyum yüzdesi entegre edilir.

**Tech Stack:** Next.js 14 App Router, Supabase (PostgreSQL + Storage + RLS), Tailwind CSS, web-push

---

## Task 1: Veritabanı Migration — meal_logs tablosu + meal_photos bucket

**Files:**
- Create: `supabase/migrations/021_meal_logs.sql`

**Step 1: Migration dosyasını yaz**

```sql
-- Beslenme takip tablosu
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type   TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  status      TEXT NOT NULL CHECK (status IN ('compliant', 'non_compliant')),
  photo_url   TEXT,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, meal_type)
);

-- Indexler
CREATE INDEX idx_meal_logs_user_id ON public.meal_logs(user_id);
CREATE INDEX idx_meal_logs_date ON public.meal_logs(date);
CREATE INDEX idx_meal_logs_user_date ON public.meal_logs(user_id, date);

-- RLS
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

-- Üye kendi kayıtlarını görebilir ve ekleyebilir
CREATE POLICY "meal_logs_member_select" ON public.meal_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "meal_logs_member_insert" ON public.meal_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meal_logs_member_update" ON public.meal_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "meal_logs_member_delete" ON public.meal_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Admin tüm kayıtları görebilir
CREATE POLICY "meal_logs_admin_all" ON public.meal_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role (cron, API) erişimi
CREATE POLICY "meal_logs_service_role" ON public.meal_logs
  FOR SELECT USING (auth.role() = 'service_role');

-- Fotoğraf storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('meal_photos', 'meal_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Üye kendi klasörüne yükleyebilir
CREATE POLICY "meal_photo_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'meal_photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "meal_photo_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'meal_photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "meal_photo_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'meal_photos');
```

**Step 2: Migration'ı Supabase'e uygula**

```bash
cd /Users/hamzasivrikaya/Projects/hamza-web-site
npx supabase db push
```

Eğer remote Supabase kullanılıyorsa Supabase Dashboard → SQL Editor'dan çalıştır.

**Step 3: Commit**

```bash
git add supabase/migrations/021_meal_logs.sql
git commit -m "feat: add meal_logs table and meal_photos storage bucket"
```

---

## Task 2: TypeScript Tipleri

**Files:**
- Modify: `src/lib/types.ts`

**Step 1: MealLog tipini ekle**

`src/lib/types.ts` dosyasının sonuna ekle:

```ts
// Beslenme takibi
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type MealStatus = 'compliant' | 'non_compliant'

export interface MealLog {
  id: string
  user_id: string
  date: string
  meal_type: MealType
  status: MealStatus
  photo_url: string | null
  note: string | null
  created_at: string
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Kahvaltı',
  lunch: 'Öğle Yemeği',
  dinner: 'Akşam Yemeği',
  snack: 'Ara Öğün',
}

export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}
```

**Step 2: NotificationType'a beslenme ekle**

`src/lib/types.ts` dosyasında NotificationType'ı güncelle:

```ts
export type NotificationType = 'low_lessons' | 'weekly_report' | 'inactive' | 'manual' | 'nutrition_reminder'
```

**Step 3: utils.ts'de notification label ekle**

`src/lib/utils.ts` dosyasında `getNotificationTypeLabel` fonksiyonuna ekle:

```ts
nutrition_reminder: 'Beslenme Hatırlatma',
```

**Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/utils.ts
git commit -m "feat: add MealLog types and nutrition notification type"
```

---

## Task 3: Üye Paneli — Beslenme Sayfası

> **REQUIRED:** Bu task'ta frontend-design skill kullanılacak.

**Files:**
- Create: `src/app/(member)/dashboard/beslenme/page.tsx` (server component — veri çekme)
- Create: `src/app/(member)/dashboard/beslenme/BeslenmeClient.tsx` (client component — UI + interaksiyon)

**Step 1: Server component — veri çekme**

`src/app/(member)/dashboard/beslenme/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BeslenmeClient from './BeslenmeClient'

export const metadata = { title: 'Beslenme Takibi' }

export default async function BeslenmePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Son 30 günlük beslenme kayıtları
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: mealLogs } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('date', { ascending: false })
    .order('meal_type', { ascending: true })

  return <BeslenmeClient userId={user.id} initialLogs={mealLogs || []} />
}
```

**Step 2: Client component — UI**

`src/app/(member)/dashboard/beslenme/BeslenmeClient.tsx`:

Bu dosya frontend-design skill ile tasarlanacak. Temel yapı:

- **Bugünün öğünleri** — 4 kart (kahvaltı, öğle, akşam, ara öğün)
  - Her kart: öğün ikonu + adı, uydum/uymadım toggle, fotoğraf yükle butonu, not alanı
  - Kayıtlı öğünler yeşil/kırmızı border ile gösterilir
  - Fotoğraf varsa küçük thumbnail gösterir
- **Haftalık uyum özeti** — bu haftanın uyum yüzdesi (compliant / toplam)
- **Geçmiş günler** — son 30 günün özet listesi (tarih + uyum oranı)

**Fotoğraf yükleme pattern'i** (avatar upload ile aynı):
```tsx
const handlePhotoUpload = async (file: File, mealType: MealType) => {
  if (file.size > 2 * 1024 * 1024) { /* 2MB limit */ return }
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${userId}/${date}_${mealType}.${ext}`
  const { error } = await supabase.storage
    .from('meal_photos')
    .upload(path, file, { upsert: true })
  if (!error) {
    const { data: { publicUrl } } = supabase.storage
      .from('meal_photos')
      .getPublicUrl(path)
    return publicUrl
  }
}
```

**Öğün kaydetme/güncelleme:**
```tsx
const handleMealSave = async (mealType: MealType, status: MealStatus, photoUrl?: string, note?: string) => {
  const supabase = createClient()
  const { error } = await supabase
    .from('meal_logs')
    .upsert({
      user_id: userId,
      date: selectedDate,
      meal_type: mealType,
      status,
      photo_url: photoUrl || null,
      note: note || null,
    }, { onConflict: 'user_id,date,meal_type' })
  if (!error) router.refresh()
}
```

**Step 3: Commit**

```bash
git add src/app/\(member\)/dashboard/beslenme/
git commit -m "feat: add nutrition tracking page for members"
```

---

## Task 4: Üye Dashboard'a Beslenme Özeti + Navigasyon

**Files:**
- Modify: `src/app/(member)/dashboard/page.tsx` — beslenme özet kartı ekle
- Modify: `src/components/shared/Navbar.tsx` — beslenme linki ekle

**Step 1: Dashboard'a bugünün beslenme özeti kartı**

Dashboard page.tsx'de mevcut veri çekme bölümüne ekle:

```tsx
// Bugünün beslenme kayıtları
const today = new Date().toISOString().split('T')[0]
const { data: todayMeals } = await supabase
  .from('meal_logs')
  .select('meal_type, status')
  .eq('user_id', user.id)
  .eq('date', today)
```

Dashboard JSX'e yeni kart ekle (quick links bölümüne):

```tsx
{/* Beslenme Özeti */}
<Link href="/dashboard/beslenme" className="block bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition">
  <h3 className="font-semibold text-gray-800 mb-3">🥗 Bugünün Beslenmesi</h3>
  <div className="flex gap-2">
    {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
      const log = todayMeals?.find(m => m.meal_type === type)
      return (
        <div key={type} className={`flex-1 text-center py-2 rounded-lg text-xs font-medium ${
          !log ? 'bg-gray-100 text-gray-400' :
          log.status === 'compliant' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {MEAL_TYPE_LABELS[type as MealType]?.slice(0, 3)}
        </div>
      )
    })}
  </div>
  <p className="text-xs text-gray-500 mt-2">
    {todayMeals?.filter(m => m.status === 'compliant').length || 0}/4 öğün uyumlu
  </p>
</Link>
```

**Step 2: Navbar'a beslenme linki**

Navbar.tsx'deki menü öğelerine ekle:

```tsx
{ href: '/dashboard/beslenme', label: 'Beslenme' }
```

**Step 3: Commit**

```bash
git add src/app/\(member\)/dashboard/page.tsx src/components/shared/Navbar.tsx
git commit -m "feat: add nutrition summary card to dashboard and nav link"
```

---

## Task 5: Admin Paneli — Üye Detayında Beslenme Tab'ı

**Files:**
- Modify: `src/app/(admin)/admin/members/[id]/MemberDetail.tsx` — yeni "Beslenme" tab'ı
- Modify: `src/app/(admin)/admin/members/[id]/page.tsx` — meal_logs verisini çek

**Step 1: page.tsx'de veri çekme**

Mevcut veri çekme bölümüne ekle:

```tsx
const { data: mealLogs } = await supabase
  .from('meal_logs')
  .select('*')
  .eq('user_id', params.id)
  .order('date', { ascending: false })
  .limit(120) // ~30 gün × 4 öğün
```

MemberDetail'e prop olarak geçir:

```tsx
<MemberDetail ... mealLogs={mealLogs || []} />
```

**Step 2: MemberDetail.tsx'de tab ekle**

Tab tanımına ekle:

```tsx
type Tab = 'overview' | 'measurements' | 'packages' | 'lessons' | 'nutrition'

const tabs = [
  { key: 'overview',     label: 'Genel Bakış' },
  { key: 'measurements', label: 'Ölçümler',    count: measurements.length },
  { key: 'packages',     label: 'Paketler',    count: packages.length },
  { key: 'lessons',      label: 'Dersler',     count: lessons.length },
  { key: 'nutrition',    label: 'Beslenme',    count: mealLogs.length },
]
```

**Step 3: Beslenme tab içeriği**

Tab content bölümüne ekle:

```tsx
{activeTab === 'nutrition' && (
  <div className="space-y-4">
    {/* Haftalık uyum yüzdesi */}
    <div className="bg-white rounded-xl p-4 border">
      <h3 className="font-semibold mb-2">Haftalık Uyum</h3>
      <div className="text-3xl font-bold text-green-600">
        {weeklyCompliancePercent}%
      </div>
    </div>

    {/* Günlük kayıtlar listesi — tarihe göre gruplu */}
    {Object.entries(groupedByDate).map(([date, logs]) => (
      <div key={date} className="bg-white rounded-xl p-4 border">
        <h4 className="font-medium text-sm text-gray-500 mb-2">{formatDate(date)}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {logs.map(log => (
            <div key={log.id} className={`p-3 rounded-lg ${
              log.status === 'compliant' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            } border`}>
              <div className="text-sm font-medium">{MEAL_TYPE_LABELS[log.meal_type]}</div>
              <div className="text-xs mt-1">{log.status === 'compliant' ? '✓ Uyumlu' : '✗ Uymadı'}</div>
              {log.photo_url && <img src={log.photo_url} className="mt-2 rounded w-full h-16 object-cover" />}
              {log.note && <p className="text-xs text-gray-500 mt-1">{log.note}</p>}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)}
```

**Step 4: Commit**

```bash
git add src/app/\(admin\)/admin/members/\[id\]/
git commit -m "feat: add nutrition tab to admin member detail page"
```

---

## Task 6: Haftalık Rapora Beslenme Uyumu Entegrasyonu

**Files:**
- Modify: `supabase/migrations/021_meal_logs.sql` (veya yeni 022) — weekly_reports'a kolon ekle
- Modify: `src/app/api/cron/weekly-report/route.ts` — beslenme uyumu hesapla
- Modify: `src/lib/weekly-report.ts` — mesaja beslenme ekle

**Step 1: weekly_reports tablosuna kolon ekle**

Migration'a ekle (veya yeni migration):

```sql
ALTER TABLE public.weekly_reports
  ADD COLUMN IF NOT EXISTS nutrition_compliance INTEGER DEFAULT NULL;
  -- 0-100 arası yüzde, NULL = beslenme kaydı yok
```

**Step 2: Cron route'da beslenme uyumu hesapla**

Haftalık rapor oluşturma döngüsünde, her üye için:

```ts
// Beslenme uyumu hesapla
const { data: weekMeals } = await admin
  .from('meal_logs')
  .select('status')
  .eq('user_id', member.id)
  .gte('date', weekStart)
  .lte('date', weekEnd)

const nutritionCompliance = weekMeals && weekMeals.length > 0
  ? Math.round((weekMeals.filter(m => m.status === 'compliant').length / weekMeals.length) * 100)
  : null
```

Upsert'e ekle:

```ts
nutrition_compliance: nutritionCompliance,
```

**Step 3: Mesaja beslenme uyumu ekle**

`generateMessage` fonksiyonuna:

```ts
export function generateMessage(lessonsCount: number, consecutiveWeeks: number, nutritionCompliance: number | null): string {
  let msg = /* mevcut mesaj mantığı */

  if (nutritionCompliance !== null) {
    if (nutritionCompliance >= 80) {
      msg += ` Beslenme uyumunuz %${nutritionCompliance} — harika!`
    } else if (nutritionCompliance >= 50) {
      msg += ` Beslenme uyumunuz %${nutritionCompliance} — daha iyi olabilir.`
    } else {
      msg += ` Beslenme uyumunuz %${nutritionCompliance} — bu hafta beslenmemize dikkat edelim.`
    }
  }

  return msg
}
```

**Step 4: Commit**

```bash
git add supabase/migrations/ src/app/api/cron/weekly-report/route.ts src/lib/weekly-report.ts
git commit -m "feat: integrate nutrition compliance into weekly reports"
```

---

## Task 7: Beslenme Hatırlatma Bildirimi (Opsiyonel Cron)

**Files:**
- Create: `src/app/api/cron/nutrition-reminder/route.ts`
- Modify: `vercel.json` — cron schedule ekle

**Step 1: Cron route oluştur**

Her gün akşam 20:00'de kayıt girmemiş üyelere hatırlatma:

```ts
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/push'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const admin = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  // Aktif üyeleri al
  const { data: members } = await admin
    .from('users')
    .select('id')
    .eq('role', 'member')
    .eq('is_active', true)

  if (!members?.length) return NextResponse.json({ sent: 0 })

  // Bugün kayıt girenleri bul
  const { data: todayLogs } = await admin
    .from('meal_logs')
    .select('user_id')
    .eq('date', today)

  const loggedUserIds = new Set(todayLogs?.map(l => l.user_id) || [])
  const reminderUserIds = members
    .filter(m => !loggedUserIds.has(m.id))
    .map(m => m.id)

  if (!reminderUserIds.length) return NextResponse.json({ sent: 0 })

  // Bildirim gönder
  await sendPushNotification({
    userIds: reminderUserIds,
    title: 'Beslenme Kaydı',
    message: 'Bugünün beslenme bilgilerini henüz girmedin. Hemen kaydet!',
    url: '/dashboard/beslenme',
  })

  // DB'ye kaydet
  const notifications = reminderUserIds.map(uid => ({
    user_id: uid,
    type: 'nutrition_reminder',
    title: 'Beslenme Kaydı',
    message: 'Bugünün beslenme bilgilerini henüz girmedin.',
  }))

  await admin.from('notifications').insert(notifications)

  return NextResponse.json({ sent: reminderUserIds.length })
}
```

**Step 2: vercel.json'a cron ekle**

```json
{
  "crons": [
    { "path": "/api/cron/weekly-report", "schedule": "0 21 * * 0" },
    { "path": "/api/cron/nutrition-reminder", "schedule": "0 20 * * *" }
  ]
}
```

**Step 3: Commit**

```bash
git add src/app/api/cron/nutrition-reminder/ vercel.json
git commit -m "feat: add daily nutrition reminder cron job"
```

---

## Özet: Task Sırası ve Bağımlılıklar

```
Task 1 (DB migration) ──→ Task 2 (Types) ──→ Task 3 (Üye sayfası) ──→ Task 4 (Dashboard + Nav)
                                            ↘ Task 5 (Admin tab)
                                            ↘ Task 6 (Haftalık rapor)
                                            ↘ Task 7 (Cron hatırlatma)
```

Task 1 ve 2 sıralı, sonrası paralel çalışabilir.

**Toplam: 7 task, ~12-15 dosya**
