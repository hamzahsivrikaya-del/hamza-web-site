'use client'

import { useState } from 'react'
import Link from 'next/link'
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
      const response = await fetch(`/api/share/report/${report.id}`)
      const blob = await response.blob()
      const file = new File([blob], 'haftalik-ozet.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        // Mobil: Web Share API (Instagram, WhatsApp vb. alır)
        await navigator.share({
          files: [file],
          title: 'Haftalık Antrenman Özetim',
          text: `Bu hafta ${report.lessons_count} ders yaptım! 💪 #HamzaSivrikaya #KişiselAntrenör`,
        })
      } else {
        // Masaüstü: doğrudan indir
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `haftalik-ozet-${report.week_start}.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Paylaşım hatası:', err)
      }
    }
    setSharing(null)
  }

  if (reports.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Haftalık Özetlerim</h1>
        </div>
        <Card>
          <div className="text-center py-10">
            <p className="text-4xl mb-3">📊</p>
            <p className="font-medium">Henüz haftalık rapor yok</p>
            <p className="text-sm text-text-secondary mt-1">
              Raporlar her Pazar akşamı otomatik oluşturulur.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link href="/dashboard" className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Haftalık Özetlerim</h1>
        </div>
        <p className="text-sm text-text-secondary mt-0.5 pl-9">Her Pazar akşamı güncellenir</p>
      </div>

      <div className="space-y-4">
        {reports.map((report, idx) => {
          const isLatest = idx === 0
          const showStreak = (report.consecutive_weeks ?? 0) >= 2

          return (
            <Card key={report.id} className={isLatest ? 'border-primary/30' : ''}>
              {isLatest && (
                <div className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">
                  Son Hafta
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-base">
                  {formatWeekLabel(report.week_start, report.week_end)}
                </CardTitle>
              </CardHeader>

              {/* İstatistikler */}
              <div className="flex gap-6 mt-3">
                <div>
                  <div className="text-3xl font-bold text-primary">{report.lessons_count}</div>
                  <div className="text-xs text-text-secondary mt-0.5">Ders</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{report.total_hours}</div>
                  <div className="text-xs text-text-secondary mt-0.5">Saat</div>
                </div>
                {showStreak && (
                  <div>
                    <div className="text-3xl font-bold text-amber-400">{report.consecutive_weeks}</div>
                    <div className="text-xs text-text-secondary mt-0.5">Hafta Seri 🔥</div>
                  </div>
                )}
              </div>

              {/* Motivasyon mesajı */}
              <p className="text-sm text-text-secondary mt-4 italic leading-relaxed">
                &ldquo;{report.message}&rdquo;
              </p>

              {/* Instagram paylaş */}
              <button
                onClick={() => handleShare(report)}
                disabled={sharing === report.id}
                className="mt-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                {sharing === report.id ? 'Hazırlanıyor...' : "Instagram'da Paylaş"}
              </button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
