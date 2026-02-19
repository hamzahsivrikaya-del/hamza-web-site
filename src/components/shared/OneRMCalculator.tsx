'use client'

import { useState } from 'react'

const exercises = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Diğer',
]

export default function OneRMCalculator() {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [exercise, setExercise] = useState('Bench Press')
  const [result, setResult] = useState<{
    epley: number
    brzycki: number
    average: number
    percentages: { pct: number; weight: number }[]
  } | null>(null)
  const [error, setError] = useState('')

  function calculate() {
    setError('')

    const w = parseFloat(weight)
    const r = parseInt(reps)

    if (!w || !r || w <= 0 || r <= 0) {
      setError('Lütfen ağırlık ve tekrar sayısını girin')
      return
    }

    if (r > 30) {
      setError('Tekrar sayısı en fazla 30 olabilir')
      return
    }

    if (r === 1) {
      const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60].map((pct) => ({
        pct,
        weight: Math.round(w * (pct / 100)),
      }))
      setResult({ epley: w, brzycki: w, average: w, percentages })
      return
    }

    // Epley formülü
    const epley = Math.round(w * (1 + r / 30))
    // Brzycki formülü
    const brzycki = Math.round(w * (36 / (37 - r)))
    const average = Math.round((epley + brzycki) / 2)

    const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60].map((pct) => ({
      pct,
      weight: Math.round(average * (pct / 100)),
    }))

    setResult({ epley, brzycki, average, percentages })
  }

  const repRanges: Record<number, string> = {
    100: '1 tekrar',
    95: '2 tekrar',
    90: '3-4 tekrar',
    85: '5-6 tekrar',
    80: '7-8 tekrar',
    75: '9-10 tekrar',
    70: '11-12 tekrar',
    65: '13-15 tekrar',
    60: '16-20 tekrar',
  }

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sol: Form */}
        <div className="bg-surface/80 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8 space-y-5">
          {/* Hareket Seçimi */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Hareket</label>
            <div className="grid grid-cols-3 gap-2">
              {exercises.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setExercise(ex)}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    exercise === ex
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white/5 border border-border text-text-secondary hover:bg-white/10'
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Ağırlık ve Tekrar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Kaldırdığın Ağırlık (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="100"
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-text-primary text-center text-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors placeholder:text-text-secondary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Tekrar Sayısı</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="5"
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-text-primary text-center text-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors placeholder:text-text-secondary/30"
              />
            </div>
          </div>

          <p className="text-xs text-text-secondary/50 text-center">
            Bir harekette belirli bir ağırlıkla kaç tekrar yapabildiğinizi girin
          </p>

          {error && (
            <p className="text-sm text-danger text-center animate-fade-in">{error}</p>
          )}

          <button
            onClick={calculate}
            className="w-full py-4 bg-primary text-white rounded-xl text-lg font-semibold hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/25 press-effect"
          >
            Hesapla
          </button>
        </div>

        {/* Sağ: Sonuçlar */}
        <div className={`bg-surface/80 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8 flex flex-col justify-center ${!result ? 'items-center' : ''}`}>
          {!result ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </div>
              <p className="text-text-secondary text-sm">Ağırlık ve tekrar sayısını girip hesaplayın</p>
              <p className="text-text-secondary/50 text-xs mt-2">Epley ve Brzycki formülleri kullanılır</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* 1RM */}
              <div className="text-center">
                <p className="text-sm text-text-secondary mb-1">Tahmini 1RM — {exercise}</p>
                <div className="font-display text-6xl sm:text-7xl text-primary">{result.average}</div>
                <p className="text-sm text-text-secondary mt-1">kg</p>
              </div>

              {/* Formül Karşılaştırma */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-text-secondary mb-1">Epley Formülü</p>
                  <p className="text-xl font-bold text-text-primary">{result.epley} kg</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-text-secondary mb-1">Brzycki Formülü</p>
                  <p className="text-xl font-bold text-text-primary">{result.brzycki} kg</p>
                </div>
              </div>

              {/* Yüzdelik Tablo */}
              <div>
                <p className="text-sm text-text-secondary mb-3 text-center">Yüzdelik Ağırlık Tablosu</p>
                <div className="space-y-1.5">
                  {result.percentages.map(({ pct, weight: w }) => (
                    <div key={pct} className="flex items-center gap-3">
                      <span className="text-xs text-text-secondary w-10 text-right">%{pct}</span>
                      <div className="flex-1 h-7 bg-white/5 rounded-lg overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-primary/40 to-primary/20 rounded-lg transition-all"
                          style={{ width: `${pct}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="text-xs font-bold text-text-primary">{w} kg</span>
                          <span className="text-xs text-text-secondary">{repRanges[pct]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
