# Light Theme Migration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tüm sayfalara (admin, member, public) açık tema uygula — landing page renk tiplerini kullanarak.

**Architecture:** CSS variable sistemi `.theme-light` class ile zaten mevcut. Ana strateji: tüm layout/page wrapper'lara `theme-light` class ekle + hardcoded koyu renkleri kaldır.

**Tech Stack:** Tailwind CSS v4, CSS custom properties, Next.js App Router

---

## Task 1: globals.css — Light theme autofill + scrollbar fix

**Files:**
- Modify: `src/app/globals.css`

**Changes:**
- Autofill styling'i `.theme-light` altına taşı (light bg + dark text)
- Default tema değişkenlerini light theme olarak güncelle (dark theme artık yok)

---

## Task 2: Admin Layout — theme-light class + SVG renk fix

**Files:**
- Modify: `src/app/(admin)/AdminLayoutClient.tsx`

**Changes:**
- Root div'e `theme-light` class ve `bg-[#FAFAFA]` ekle

---

## Task 3: Member Layout — theme-light class + SVG fix

**Files:**
- Modify: `src/app/(member)/layout.tsx`

**Changes:**
- `style={{ backgroundColor: '#111010' }}` → `className="theme-light bg-[#FAFAFA]"`
- SVG fill'leri `#F5F0E8` → `#1A1A1A` (light theme'de koyu grafiti)

---

## Task 4: Blog sayfası — theme-light wrapper

**Files:**
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`

**Changes:**
- Root div'e `theme-light` class ekle
- `bg-background` → light uyumlu

---

## Task 5: Antrenmanlar sayfası — light theme redesign

**Files:**
- Modify: `src/app/antrenmanlar/page.tsx`

**Changes:**
- `theme-light` class ekle
- Koyu gradient arka planı kaldır → beyaz/açık gri
- Floating SVG'leri koyu renge çevir (primary yerine siyah opacity)

---

## Task 6: Araçlar (hesaplayıcılar) sayfaları — theme-light

**Files:**
- Modify: `src/app/araclar/page.tsx`
- Modify: Tüm `src/app/araclar/*/page.tsx` dosyaları

**Changes:**
- `theme-light` class ekle
- Koyu arka planları kaldır

---

## Task 7: Login sayfaları — light theme

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/login/forgot-password/page.tsx`
- Modify: `src/app/(auth)/login/reset-password/page.tsx`

**Changes:**
- Koyu gradient'ları kaldır → açık tema
- SVG pattern renklerini güncelle

---

## Task 8: WorkoutDayCard — light theme uyumu

**Files:**
- Modify: `src/components/shared/WorkoutDayCard.tsx`

**Changes:**
- CSS variables kullanan kısımları kontrol et
- Hardcoded koyu renkler varsa düzelt

---

## Task 9: ProgressChart — tooltip renk fix

**Files:**
- Modify: `src/app/(member)/dashboard/progress/ProgressChart.tsx`

**Changes:**
- Recharts tooltip: `backgroundColor: '#1A1A1A'` → `'#FFFFFF'`
- `border: '1px solid #2A2A2A'` → `'1px solid #E5E5E5'`
- `color: '#F5F0E8'` → `'#1A1A1A'`

---

## Task 10: Sidebar + Navbar font tutarlılığı

**Files:**
- Verify: `src/components/shared/Sidebar.tsx`
- Verify: `src/components/shared/Navbar.tsx`
- Verify: `src/components/shared/MobileSidebar.tsx`

**Changes:**
- CSS variables kullanıyorlar → `.theme-light` ile otomatik dönüşecek
- Verify + gerekli fix'ler

---

## Uygulama Sırası

1. globals.css (temel)
2. Admin + Member layout (wrapper)
3. Public sayfalar (blog, antrenmanlar, araclar)
4. Login sayfaları
5. Component fix'leri (WorkoutDayCard, ProgressChart)
6. Build test
