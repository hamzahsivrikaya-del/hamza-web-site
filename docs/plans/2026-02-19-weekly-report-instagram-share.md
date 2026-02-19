# Haftalık Rapor & Instagram Paylaşım Kartı - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Her Pazar 18:00'de tüm aktif üyelere otomatik haftalık rapor oluştur; üye panelinde listele; Instagram'da paylaşılabilir markalı görsel kart üret.

**Architecture:**
- Vercel Cron Job (`vercel.json`) → `/api/cron/weekly-report` → `weekly_reports` tablosuna yazar
- `/api/share/report/[id]` → `next/og` ImageResponse ile server-side PNG üretir (1080×1080)
- Üye paneli `/dashboard/haftalik-ozet` → raporları listeler + paylaş butonu → Web Share API veya download
- Hamza'nın markası (isim + @handle) görselde her zaman görünür

**Tech Stack:** Next.js App Router, next/og (ImageResponse), Supabase, Web Share API, Vercel Cron

---

## Task 1: Veritabanı - weekly_reports tablosu

**Files:**
- Create: `supabase/migrations/005_weekly_reports.sql`

**Step 1: SQL migration dosyasını oluştur**

```sql
-- Haftalık raporlar tablosu
CREATE TABLE public.weekly_reports (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  week_start   DATE NOT NULL,   -- Pazartesi
  week_end     DATE NOT NULL,   -- Pazar
  lessons_count INTEGER NOT NULL DEFAULT 0,
  total_hours  NUMERIC(4,1) NOT NULL DEFAULT 0,
  consecutive_weeks INTEGER NOT NULL DEFAULT 0,
  message      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

-- Üye sadece kendi raporunu okur
CREATE POLICY "weekly_reports_self" ON public.weekly_reports
  FOR SELECT USING (auth.uid() = user_id);

-- Admin tümünü yönetir
CREATE POLICY "weekly_reports_admin" ON public.weekly_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role (cron) yazar
CREATE POLICY "weekly_reports_service" ON public.weekly_reports
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

**Step 2: Supabase Dashboard'da çalıştır**
- Supabase → SQL Editor → yeni query → SQL'i yapıştır → Run
- Tablo oluştuğunu Table Editor'da doğrula

---

## Task 2: Rapor üretim fonksiyonu (business logic)

**Files:**
- Create: `src/lib/weekly-report.ts`

**Step 1: Yardımcı fonksiyonları yaz**

```typescript
// src/lib/weekly-report.ts

export function getWeekRange(date: Date): { weekStart: string; weekEnd: string } {
  const d = new Date(date)
  // Pazar günü çalışır; bu haftanın Pazartesi'sini bul
  const day = d.getDay() // 0=Pazar, 1=Pazartesi...
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

export function generateMessage(lessonsCount: number, consecutiveWeeks: number): string {
  // Streak mesajları (öncelik)
  if (consecutiveWeeks >= 8 && lessonsCount >= 2)
    return `${consecutiveWeeks} haftadır sporunuzu aksatmadınız! İnanılmaz bir disiplin sergiliyorsunuz. 🏆`
  if (consecutiveWeeks >= 4 && lessonsCount >= 2)
    return `${consecutiveWeeks} haftadır düzenli antrenman yapıyorsunuz! Bu alışkanlık hayatınızı değiştiriyor. ⭐`

  // Haftalık performans
  if (lessonsCount === 0)
    return 'Bu hafta mola verdik. Dinlenmek de antreman! Gelecek hafta sizi bekliyoruz. 💪'
  if (lessonsCount === 1)
    return 'Bu hafta 1 ders yaptınız. Harika bir başlangıç! Her adım hedefe yaklaştırır. 🌟'
  if (lessonsCount === 2)
    return `Bu hafta 2 ders yaptınız. Çok iyi gidiyorsunuz! Düzenlilik en büyük anahtarınız. 🔥`
  if (lessonsCount === 3)
    return `Bu hafta 3 ders yaptınız! Harika bir performans. Böyle devam edin! 💪🔥`
  return `Bu hafta ${lessonsCount} ders yaptınız! Mükemmel bir hafta geçirdiniz. Siz bir şampiyonsunuz! 🏆`
}
```

**Step 2: TypeScript kontrolü**
```bash
npx tsc --noEmit
```
Expected: hata yok

---

## Task 3: Cron API Route - rapor üretimi

**Files:**
- Create: `src/app/api/cron/weekly-report/route.ts`

**Step 1: Route dosyasını yaz**

```typescript
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getWeekRange, generateMessage } from '@/lib/weekly-report'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Vercel Cron veya admin tetiklemesi için token doğrula
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { weekStart, weekEnd } = getWeekRange(new Date())

  // Aktif üyeleri al
  const { data: members, error: memberError } = await admin
    .from('users')
    .select('id')
    .eq('role', 'member')
    .eq('is_active', true)

  if (memberError || !members) {
    return NextResponse.json({ error: 'Üye listesi alınamadı' }, { status: 500 })
  }

  const results = await Promise.allSettled(
    members.map(async (member) => {
      // Bu haftaki dersler
      const { data: lessons } = await admin
        .from('lessons')
        .select('id')
        .eq('user_id', member.id)
        .gte('date', weekStart)
        .lte('date', weekEnd)

      const lessonsCount = lessons?.length ?? 0
      const totalHours = parseFloat((lessonsCount * 1).toFixed(1)) // 1 ders = 1 saat

      // Streak hesapla: kaç ardışık haftada ders var (bu hafta dahil)
      const consecutiveWeeks = await calculateStreak(admin, member.id, weekStart)

      const message = generateMessage(lessonsCount, consecutiveWeeks)

      // Upsert (aynı hafta için tekrar çalışırsa günceller)
      await admin.from('weekly_reports').upsert(
        {
          user_id: member.id,
          week_start: weekStart,
          week_end: weekEnd,
          lessons_count: lessonsCount,
          total_hours: totalHours,
          consecutive_weeks: consecutiveWeeks,
          message,
        },
        { onConflict: 'user_id,week_start' }
      )
    })
  )

  const succeeded = results.filter((r) => r.status === 'fulfilled').length
  return NextResponse.json({ ok: true, generated: succeeded, total: members.length })
}

async function calculateStreak(
  admin: ReturnType<typeof import('@/lib/supabase/admin').createAdminClient>,
  userId: string,
  currentWeekStart: string
): Promise<number> {
  // Son 52 hafta boyunca geriye git, ardışık ders haftası say
  let streak = 0
  let weekStart = new Date(currentWeekStart)

  for (let i = 0; i < 52; i++) {
    const wStart = weekStart.toISOString().split('T')[0]
    const wEnd = new Date(weekStart)
    wEnd.setDate(weekStart.getDate() + 6)
    const wEndStr = wEnd.toISOString().split('T')[0]

    const { data } = await admin
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('date', wStart)
      .lte('date', wEndStr)

    // @ts-expect-error count tipi
    if ((data as unknown as { count: number })?.count > 0 || i === 0 && i === 0) {
      // İlk hafta (bu hafta) 0 ders olsa bile streak 0'dan başlar
      const { count } = await admin
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('date', wStart)
        .lte('date', wEndStr)

      if ((count ?? 0) > 0) {
        streak++
      } else if (i > 0) {
        break // Ardışıklık bozuldu
      }
    } else {
      if (i > 0) break
    }

    // Bir önceki haftaya git
    weekStart.setDate(weekStart.getDate() - 7)
  }

  return streak
}
```

**Not:** Streak fonksiyonu simplify edilebilir, çalışması yeterli.

**Step 2: CRON_SECRET env değişkenini ekle**

`.env.local`'a ekle:
```
CRON_SECRET=hamza-pt-cron-2026
```

**Step 3: TypeScript kontrol**
```bash
npx tsc --noEmit
```

---

## Task 4: Vercel Cron yapılandırması

**Files:**
- Create: `vercel.json`

**Step 1: vercel.json oluştur**

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-report",
      "schedule": "0 15 * * 0"
    }
  ]
}
```

**Not:** `0 15 * * 0` = Her Pazar 15:00 UTC = 18:00 Türkiye saati (UTC+3)

Vercel Cron, route'a `Authorization: Bearer $CRON_SECRET` ile GET isteği atar.
Vercel Dashboard'da Environment Variable olarak `CRON_SECRET` eklenecek (deploy sonrası).

---

## Task 5: Instagram paylaşım görseli API (next/og)

**Files:**
- Create: `src/app/api/share/report/[id]/route.tsx`

**Step 1: ImageResponse route'unu yaz**

```typescript
import { ImageResponse } from 'next/og'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: report } = await admin
    .from('weekly_reports')
    .select('*, users(full_name)')
    .eq('id', id)
    .single()

  if (!report) {
    return new Response('Rapor bulunamadı', { status: 404 })
  }

  const userName = (report.users as unknown as { full_name: string })?.full_name || 'Üye'
  const firstName = userName.split(' ')[0]
  const weekLabel = `${formatShortDate(report.week_start)} – ${formatShortDate(report.week_end)}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px 90px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Arka plan dekoratif çizgi */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '6px',
          backgroundColor: '#DC2626',
          display: 'flex',
        }} />

        {/* Header: Marka */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#DC2626', letterSpacing: '4px', textTransform: 'uppercase' }}>
            HAMZA SİVRİKAYA
          </div>
          <div style={{ fontSize: '16px', color: '#666', letterSpacing: '2px' }}>
            KİŞİSEL ANTRENÖR
          </div>
        </div>

        {/* Orta: Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '48px', width: '100%' }}>
          {/* Üye adı */}
          <div style={{ fontSize: '42px', fontWeight: 700, color: '#F5F0E8' }}>
            {firstName}'in Haftalık Özeti
          </div>

          {/* Stats grid */}
          <div style={{ display: 'flex', gap: '60px', alignItems: 'center' }}>
            {/* Ders sayısı */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '96px', fontWeight: 900, color: '#DC2626', lineHeight: 1 }}>
                {report.lessons_count}
              </div>
              <div style={{ fontSize: '20px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>
                DERS
              </div>
            </div>

            {/* Dikey çizgi */}
            <div style={{ width: '2px', height: '120px', backgroundColor: '#222', display: 'flex' }} />

            {/* Saat */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '96px', fontWeight: 900, color: '#F5F0E8', lineHeight: 1 }}>
                {report.total_hours}
              </div>
              <div style={{ fontSize: '20px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>
                SAAT
              </div>
            </div>

            {/* Dikey çizgi */}
            {report.consecutive_weeks >= 2 && (
              <>
                <div style={{ width: '2px', height: '120px', backgroundColor: '#222', display: 'flex' }} />
                {/* Streak */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '96px', fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>
                    {report.consecutive_weeks}
                  </div>
                  <div style={{ fontSize: '20px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    HAFTA SERİ
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Motivasyonel mesaj */}
          <div style={{
            fontSize: '26px',
            color: '#F5F0E8',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
            backgroundColor: '#1A1A1A',
            padding: '32px 48px',
            borderRadius: '16px',
            borderLeft: '4px solid #DC2626',
          }}>
            {report.message}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '18px', color: '#444' }}>{weekLabel}</div>
          <div style={{ fontSize: '22px', color: '#DC2626', fontWeight: 600 }}>@hamzasivrikayaa</div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    }
  )
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
}
```

**Step 2: TypeScript kontrol**
```bash
npx tsc --noEmit
```

---

## Task 6: Üye paneli - Haftalık Özetlerim sayfası

**Files:**
- Create: `src/app/(member)/dashboard/haftalik-ozet/page.tsx`
- Create: `src/app/(member)/dashboard/haftalik-ozet/WeeklyReportList.tsx`

**Step 1: Server component - page.tsx**

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WeeklyReportList from './WeeklyReportList'

export default async function HaftalikOzetPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: reports } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('user_id', user.id)
    .order('week_start', { ascending: false })
    .limit(12) // Son 3 ay

  return <WeeklyReportList reports={reports || []} />
}
```

**Step 2: Client component - WeeklyReportList.tsx**

```tsx
'use client'

import { useState } from 'react'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

interface WeeklyReport {
  id: string
  week_start: string
  week_end: string
  lessons_count: number
  total_hours: number
  consecutive_weeks: number
  message: string
}

function formatWeekLabel(start: string, end: string): string {
  const s = new Date(start).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
  const e = new Date(end).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
  return `${s} – ${e}`
}

export default function WeeklyReportList({ reports }: { reports: WeeklyReport[] }) {
  const [sharing, setSharing] = useState<string | null>(null)

  async function handleShare(report: WeeklyReport) {
    setSharing(report.id)
    try {
      const imageUrl = `/api/share/report/${report.id}`
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'haftalik-ozet.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Haftalık Antrenman Özetim',
          text: `Bu hafta ${report.lessons_count} ders yaptım! #hamzasivrikaya #kisiselantrenor`,
        })
      } else {
        // Fallback: indir
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'haftalik-ozet.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share hatası:', err)
      }
    }
    setSharing(null)
  }

  if (reports.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Haftalık Özetlerim</h1>
        <Card>
          <p className="text-text-secondary text-center py-8">
            Henüz haftalık rapor yok. Raporlar her Pazar akşamı oluşturulur.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Haftalık Özetlerim</h1>
      <p className="text-sm text-text-secondary">Her Pazar akşamı güncellenir</p>

      <div className="space-y-4">
        {reports.map((report, idx) => (
          <Card key={report.id} className={idx === 0 ? 'border-primary/30' : ''}>
            {idx === 0 && (
              <div className="text-xs font-medium text-primary mb-3 uppercase tracking-wider">Son Hafta</div>
            )}
            <CardHeader>
              <CardTitle className="text-base">{formatWeekLabel(report.week_start, report.week_end)}</CardTitle>
            </CardHeader>

            {/* Stats */}
            <div className="flex gap-6 mt-2">
              <div>
                <div className="text-2xl font-bold text-primary">{report.lessons_count}</div>
                <div className="text-xs text-text-secondary">Ders</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{report.total_hours}</div>
                <div className="text-xs text-text-secondary">Saat</div>
              </div>
              {report.consecutive_weeks >= 2 && (
                <div>
                  <div className="text-2xl font-bold text-amber-400">{report.consecutive_weeks}</div>
                  <div className="text-xs text-text-secondary">Hafta Seri</div>
                </div>
              )}
            </div>

            {/* Mesaj */}
            <p className="text-sm text-text-secondary mt-3 italic">"{report.message}"</p>

            {/* Paylaş butonu */}
            <button
              onClick={() => handleShare(report)}
              disabled={sharing === report.id}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-sm font-medium hover:opacity-90 transition-opacity active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              {sharing === report.id ? 'Hazırlanıyor...' : "Instagram'da Paylaş"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 7: Navbar'a link ekle + Dashboard hızlı link

**Files:**
- Modify: `src/components/shared/Navbar.tsx`
- Modify: `src/app/(member)/dashboard/page.tsx`

**Step 1: Navbar'a "Haftalık Özet" linki ekle**

`src/components/shared/Navbar.tsx` dosyasında `Ayarlar` linkinin önüne ekle:
```tsx
<Link href="/dashboard/haftalik-ozet" className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
  Haftalık Özet
</Link>
```

**Step 2: Dashboard hızlı link grid'ine ekle**

`src/app/(member)/dashboard/page.tsx` dosyasında mevcut 3 kartın yanına 4. kart ekle:
```tsx
<Link href="/dashboard/haftalik-ozet">
  <Card className="hover-lift card-glow text-center cursor-pointer animate-fade-up delay-600">
    <svg className="w-6 h-6 mx-auto text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <span className="text-sm font-medium">Haftalık Özet</span>
  </Card>
</Link>
```

---

## Task 8: Manuel test için admin trigger

**Files:**
- Modify: `src/app/(admin)/admin/settings/page.tsx`

**Step 1: Admin ayarlar sayfasına "Haftalık Raporu Şimdi Oluştur" butonu ekle**

Bu buton geliştirme/test sırasında cron'u manuel tetiklemek için kullanılır.

```tsx
// Mevcut admin/settings/page.tsx'e Client Component olarak ekle
// CRON_SECRET ile /api/cron/weekly-report'a GET isteği atar
```

**Not:** Admin settings sayfası zaten var, mevcut içeriği okuyup uygun yere buton ekle.

---

## Task 9: Son kontrol

**Step 1: TypeScript kontrolü**
```bash
npx tsc --noEmit
```

**Step 2: Manuel cron testi**
- Dev server'da: `curl -H "Authorization: Bearer hamza-pt-cron-2026" http://localhost:3000/api/cron/weekly-report`
- Expected response: `{"ok":true,"generated":2,"total":2}`

**Step 3: Görsel test**
- `http://localhost:3000/api/share/report/[gerçek-report-id]` adresini ziyaret et
- 1080x1080 PNG görüntülenmelidir

**Step 4: Üye paneli test**
- Test üye hesabıyla giriş yap
- `/dashboard/haftalik-ozet` sayfasına git
- Raporlar listelenmeli
- "Instagram'da Paylaş" butonu çalışmalı (mobilde share sheet, masaüstünde indir)

---

## Notlar

- **Ders süresi:** 1 ders = 1 saat (sabit varsayım, DB'de süre alanı yok)
- **Streak:** Mevcut haftadan geriye sayılan, her haftada ≥1 ders olan ardışık hafta sayısı
- **Paylaşım:** Mobil tarayıcıda Web Share API ile Instagram'a gönderilebilir; masaüstünde PNG indirir
- **Görsel:** next/og edge runtime kullanır, Vercel'de sorunsuz çalışır
- **Cron zamanı:** `0 15 * * 0` = Pazar 15:00 UTC = 18:00 Türkiye
