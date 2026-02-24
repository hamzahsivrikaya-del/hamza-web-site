'use client'

import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import type { MealLog, MealStatus, MemberMeal } from '@/lib/types'

// ---------- helpers ----------

/** YYYY-MM-DD formatında tarih döndür (timezone-safe) */
function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

/** Kısa Türkçe tarih: "24 Şub" */
function shortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

/** Türkçe gün adı */
function dayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('tr-TR', { weekday: 'long' })
}

/** Bugünün formatlı hali */
function prettyDate(dateStr: string, today: string): string {
  if (dateStr === today) return 'Bugün'
  const yesterday = new Date(today + 'T00:00:00')
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateStr === toDateStr(yesterday)) return 'Dün'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })
}

// ---------- component ----------

interface Props {
  userId: string
  memberMeals: MemberMeal[]
  initialLogs: MealLog[]
  today: string
}

export default function BeslenmeClient({ userId, memberMeals, initialLogs, today }: Props) {
  const router = useRouter()
  const [logs, setLogs] = useState<MealLog[]>(initialLogs)
  const [selectedDate, setSelectedDate] = useState(today)
  const [saving, setSaving] = useState<string | null>(null) // "mealId-compliant" gibi key
  const [uploading, setUploading] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({}) // mealId -> note text
  const [expandedNote, setExpandedNote] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const mealCount = memberMeals.length

  // Seçili güne ait loglar
  const dayLogs = useMemo(
    () => logs.filter((l) => l.date === selectedDate),
    [logs, selectedDate]
  )

  function getLog(mealId: string): MealLog | undefined {
    return dayLogs.find((l) => l.meal_id === mealId)
  }

  // ---- tarih navigasyonu ----
  function changeDate(offset: number) {
    const d = new Date(selectedDate + 'T00:00:00')
    d.setDate(d.getDate() + offset)
    const newDate = toDateStr(d)
    if (newDate > today) return // geleceğe gidemez
    setSelectedDate(newDate)
    setExpandedNote(null)
  }

  // ---- kaydet / güncelle ----
  async function handleMealSave(meal: MemberMeal, status: MealStatus) {
    const key = `${meal.id}-${status}`
    setSaving(key)
    try {
      const supabase = createClient()
      const existingLog = getLog(meal.id)
      const noteText = notes[meal.id] ?? existingLog?.note ?? null

      const { data, error } = await supabase
        .from('meal_logs')
        .upsert(
          {
            user_id: userId,
            date: selectedDate,
            meal_id: meal.id,
            status,
            photo_url: existingLog?.photo_url ?? null,
            note: noteText,
          },
          { onConflict: 'user_id,date,meal_id' }
        )
        .select()
        .single()

      if (!error && data) {
        setLogs((prev) => {
          const without = prev.filter(
            (l) => !(l.date === selectedDate && l.meal_id === meal.id)
          )
          return [data, ...without]
        })
      }
    } catch {
      // sessiz hata
    }
    setSaving(null)
  }

  // ---- foto yükleme ----
  async function handlePhotoUpload(file: File, meal: MemberMeal) {
    if (file.size > 2 * 1024 * 1024) {
      alert('Dosya 2MB\'dan küçük olmalı')
      return
    }
    setUploading(meal.id)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${userId}/${selectedDate}_${meal.id}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('meal_photos')
        .upload(path, file, { upsert: true })

      if (uploadError) {
        setUploading(null)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('meal_photos')
        .getPublicUrl(path)

      // Log varsa güncelle, yoksa "compliant" olarak oluştur
      const existingLog = getLog(meal.id)
      const { data, error } = await supabase
        .from('meal_logs')
        .upsert(
          {
            user_id: userId,
            date: selectedDate,
            meal_id: meal.id,
            status: existingLog?.status ?? 'compliant',
            photo_url: publicUrl,
            note: notes[meal.id] ?? existingLog?.note ?? null,
          },
          { onConflict: 'user_id,date,meal_id' }
        )
        .select()
        .single()

      if (!error && data) {
        setLogs((prev) => {
          const without = prev.filter(
            (l) => !(l.date === selectedDate && l.meal_id === meal.id)
          )
          return [data, ...without]
        })
      }
    } catch {
      // sessiz hata
    }
    setUploading(null)
  }

  // ---- haftalık uyum ----
  const weekStats = useMemo(() => {
    // Bu haftanın pazartesisini bul
    const todayDate = new Date(today + 'T00:00:00')
    const dayOfWeek = todayDate.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(todayDate)
    monday.setDate(todayDate.getDate() + mondayOffset)

    const weekDates: string[] = []
    for (let i = 0; i <= 6; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const ds = toDateStr(d)
      if (ds <= today) weekDates.push(ds)
    }

    let totalMeals = 0
    let compliantMeals = 0

    for (const date of weekDates) {
      const dayMealLogs = logs.filter((l) => l.date === date)
      totalMeals += dayMealLogs.length
      compliantMeals += dayMealLogs.filter((l) => l.status === 'compliant').length
    }

    // Dinamik öğün sayısı x gün sayısı
    const maxPossible = weekDates.length * mealCount
    const loggedPct = totalMeals > 0 ? Math.round((compliantMeals / totalMeals) * 100) : 0
    const filledPct = maxPossible > 0 ? Math.round((totalMeals / maxPossible) * 100) : 0

    return { compliantMeals, totalMeals, maxPossible, loggedPct, filledPct, weekDates }
  }, [logs, today, mealCount])

  // ---- son 7 gün özeti ----
  const last7Days = useMemo(() => {
    const days: { date: string; compliant: number; total: number }[] = []
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today + 'T00:00:00')
      d.setDate(d.getDate() - i)
      const ds = toDateStr(d)
      const dayMealLogs = logs.filter((l) => l.date === ds)
      days.push({
        date: ds,
        compliant: dayMealLogs.filter((l) => l.status === 'compliant').length,
        total: dayMealLogs.length,
      })
    }
    return days
  }, [logs, today])

  // ---- card border class ----
  function cardBorderClass(mealId: string): string {
    const log = getLog(mealId)
    if (!log) return 'border-border'
    return log.status === 'compliant'
      ? 'border-success/60 shadow-[0_0_12px_-4px_rgba(34,197,94,0.2)]'
      : 'border-danger/60 shadow-[0_0_12px_-4px_rgba(239,68,68,0.2)]'
  }

  // ---- öğün atanmamış durumu ----
  if (mealCount === 0) {
    return (
      <div className="space-y-6 pb-8">
        {/* Başlık */}
        <div className="flex items-center gap-3 animate-fade-up">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Beslenme Takibi</h1>
        </div>

        <Card className="animate-fade-up delay-100">
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-surface-hover flex items-center justify-center">
              <svg className="w-7 h-7 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Henüz öğün planınız atanmadı
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Antrenörünüzle iletişime geçin.
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Başlık */}
      <div className="flex items-center gap-3 animate-fade-up">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Beslenme Takibi</h1>
      </div>

      {/* Tarih seçici */}
      <div className="flex items-center justify-between bg-surface rounded-xl border border-border p-3 animate-fade-up delay-100">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
          aria-label="Önceki gün"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <p className="font-semibold text-sm">{prettyDate(selectedDate, today)}</p>
          {selectedDate !== today && (
            <p className="text-xs text-text-secondary mt-0.5">{shortDate(selectedDate)}</p>
          )}
        </div>
        <button
          onClick={() => changeDate(1)}
          disabled={selectedDate >= today}
          className="p-2 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Sonraki gün"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Öğün kartları */}
      <div className="space-y-3">
        {memberMeals.map((meal) => {
          const log = getLog(meal.id)
          const isExpanded = expandedNote === meal.id
          const noteValue = notes[meal.id] ?? log?.note ?? ''

          return (
            <Card
              key={meal.id}
              className={`transition-all duration-300 animate-fade-up ${cardBorderClass(meal.id)}`}
            >
              <div className="space-y-3">
                {/* Başlık satırı */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {meal.order_num}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{meal.name}</h3>
                      {log && (
                        <span
                          className={`text-xs font-medium ${
                            log.status === 'compliant' ? 'text-success' : 'text-danger'
                          }`}
                        >
                          {log.status === 'compliant' ? 'Uyuldu' : 'Uyulmadı'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Foto thumbnail */}
                  {log?.photo_url && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <Image
                        src={log.photo_url}
                        alt={meal.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  )}
                </div>

                {/* Uyum butonları */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMealSave(meal, 'compliant')}
                    disabled={saving !== null}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                      ${
                        log?.status === 'compliant'
                          ? 'bg-success/15 text-success border-2 border-success/40'
                          : 'bg-surface-hover text-text-secondary border-2 border-transparent hover:border-success/30 hover:text-success'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {saving === `${meal.id}-compliant` ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Uydum
                  </button>
                  <button
                    onClick={() => handleMealSave(meal, 'non_compliant')}
                    disabled={saving !== null}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                      ${
                        log?.status === 'non_compliant'
                          ? 'bg-danger/15 text-danger border-2 border-danger/40'
                          : 'bg-surface-hover text-text-secondary border-2 border-transparent hover:border-danger/30 hover:text-danger'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {saving === `${meal.id}-non_compliant` ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Uymadım
                  </button>
                </div>

                {/* Foto yükle + Not butonu */}
                <div className="flex gap-2">
                  <input
                    ref={(el) => { fileRefs.current[meal.id] = el }}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handlePhotoUpload(file, meal)
                      e.target.value = '' // aynı dosyayı tekrar seçebilmek için
                    }}
                  />
                  <button
                    onClick={() => fileRefs.current[meal.id]?.click()}
                    disabled={uploading !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {uploading === meal.id ? (
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    Foto
                  </button>
                  <button
                    onClick={() => setExpandedNote(isExpanded ? null : meal.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Not
                    {(log?.note || notes[meal.id]) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                </div>

                {/* Not alanı (expandable) */}
                {isExpanded && (
                  <div className="animate-fade-in">
                    <textarea
                      value={noteValue}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [meal.id]: e.target.value }))
                      }
                      placeholder="Öğünle ilgili not ekle..."
                      rows={2}
                      className="w-full text-sm bg-surface-hover border border-border rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-primary/50 placeholder:text-text-secondary/50"
                    />
                    {notes[meal.id] !== undefined && notes[meal.id] !== (log?.note ?? '') && (
                      <button
                        onClick={() => {
                          if (log) {
                            handleMealSave(meal, log.status)
                          }
                        }}
                        disabled={!log}
                        className="mt-1.5 text-xs text-primary font-medium hover:underline cursor-pointer disabled:opacity-50"
                      >
                        Notu kaydet
                      </button>
                    )}
                  </div>
                )}

                {/* Mevcut not gösterimi (collapsed) */}
                {!isExpanded && log?.note && (
                  <p className="text-xs text-text-secondary italic truncate">
                    {log.note}
                  </p>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Haftalık uyum özeti */}
      <Card className="animate-fade-up delay-300">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-text-primary">Bu Hafta</h3>

          {weekStats.totalMeals === 0 ? (
            <p className="text-sm text-text-secondary">Henüz kayıt yok</p>
          ) : (
            <>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-text-primary">
                  %{weekStats.loggedPct}
                </span>
                <span className="text-sm text-text-secondary pb-1">
                  uyum ({weekStats.compliantMeals}/{weekStats.totalMeals} öğün)
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="h-2.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${weekStats.loggedPct}%`,
                      backgroundColor:
                        weekStats.loggedPct >= 80
                          ? 'var(--color-success)'
                          : weekStats.loggedPct >= 50
                            ? 'var(--color-warning)'
                            : 'var(--color-danger)',
                    }}
                  />
                </div>
                <p className="text-xs text-text-secondary">
                  {weekStats.filledPct}% girildi ({weekStats.totalMeals}/{weekStats.maxPossible})
                </p>
              </div>
            </>
          )}

          {/* Hafta günleri mini grid */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {weekStats.weekDates.map((date) => {
              const dayMealLogs = logs.filter((l) => l.date === date)
              const compliant = dayMealLogs.filter((l) => l.status === 'compliant').length
              const total = dayMealLogs.length
              const isSelected = date === selectedDate

              return (
                <button
                  key={date}
                  onClick={() => { setSelectedDate(date); setExpandedNote(null) }}
                  className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer
                    ${isSelected ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-surface-hover'}`}
                >
                  <span className="text-[10px] text-text-secondary">
                    {dayName(date).slice(0, 3)}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                    {new Date(date + 'T00:00:00').getDate()}
                  </span>
                  {total > 0 && (
                    <div className="flex gap-px">
                      {memberMeals.map((meal, i) => {
                        const ml = dayMealLogs.find((l) => l.meal_id === meal.id)
                        return (
                          <span
                            key={meal.id}
                            className={`w-1 h-1 rounded-full ${
                              ml
                                ? ml.status === 'compliant'
                                  ? 'bg-success'
                                  : 'bg-danger'
                                : 'bg-border'
                            }`}
                          />
                        )
                      })}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Son 7 gün geçmişi */}
      <Card className="animate-fade-up delay-400">
        <h3 className="font-semibold text-sm text-text-primary mb-3">Son 7 Gün</h3>
        <div className="space-y-2">
          {last7Days.map(({ date, compliant, total }) => (
            <button
              key={date}
              onClick={() => { setSelectedDate(date); setExpandedNote(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {prettyDate(date, today)}
                </p>
                <p className="text-xs text-text-secondary">
                  {total === 0 ? 'Girilmedi' : `${compliant}/${total} uyumlu`}
                </p>
              </div>

              {/* Mini durum göstergesi */}
              {total > 0 ? (
                <div className="flex gap-1">
                  {memberMeals.map((meal) => {
                    const ml = logs.find((l) => l.date === date && l.meal_id === meal.id)
                    return (
                      <span
                        key={meal.id}
                        className={`w-2.5 h-2.5 rounded-full ${
                          !ml
                            ? 'bg-border'
                            : ml.status === 'compliant'
                              ? 'bg-success'
                              : 'bg-danger'
                        }`}
                        title={meal.name}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="flex gap-1">
                  {memberMeals.map((meal) => (
                    <span key={meal.id} className="w-2.5 h-2.5 rounded-full bg-border" />
                  ))}
                </div>
              )}

              <svg className="w-4 h-4 text-text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
