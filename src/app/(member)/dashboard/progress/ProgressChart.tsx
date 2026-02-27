'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDate, formatDateShort } from '@/lib/utils'
import type { Gender, Measurement, MemberGoal } from '@/lib/types'
import BodyCompositionCard from './BodyCompositionCard'

const metricOptions = [
  { key: 'weight', label: 'Kilo', unit: 'kg', color: '#DC2626', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
  { key: 'body_fat_pct', label: 'Yağ %', unit: '%', color: '#F97316', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
  { key: 'chest', label: 'Göğüs', unit: 'cm', color: '#F59E0B', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { key: 'waist', label: 'Bel', unit: 'cm', color: '#22C55E', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { key: 'arm', label: 'Kol', unit: 'cm', color: '#3B82F6', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { key: 'leg', label: 'Bacak', unit: 'cm', color: '#8B5CF6', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
] as const

type MetricKey = typeof metricOptions[number]['key']

export default function ProgressChart({ measurements, gender, goals, goalsEnabled = false }: { measurements: Measurement[]; gender?: Gender | null; goals: MemberGoal[]; goalsEnabled?: boolean }) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(['weight'])
  const [goalModal, setGoalModal] = useState<{ metric: MetricKey; current: number | null } | null>(null)
  const [goalValue, setGoalValue] = useState('')
  const [saving, setSaving] = useState(false)

  const toggleMetric = (key: MetricKey) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    )
  }

  const getGoal = (metric: MetricKey) => goals.find(g => g.metric_type === metric)
  const latest = measurements[measurements.length - 1]
  const first = measurements[0]

  function openGoalModal(metric: typeof metricOptions[number]) {
    setGoalModal({ metric: metric.key, current: latest?.[metric.key] ?? null })
    const goal = getGoal(metric.key)
    setGoalValue(goal?.target_value?.toString() || '')
    setGoalError('')
  }

  const [goalError, setGoalError] = useState('')

  async function saveGoal() {
    if (!goalModal || !goalValue) return
    setSaving(true)
    setGoalError('')
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric_type: goalModal.metric, target_value: parseFloat(goalValue) }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setGoalError(data.error || 'Hedef kaydedilemedi')
        return
      }
      window.location.reload()
    } catch {
      setGoalError('Bağlantı hatası, tekrar deneyin')
    } finally {
      setSaving(false)
    }
  }

  async function deleteGoal(metricType: string) {
    const res = await fetch('/api/goals', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metric_type: metricType }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'Hedef silinemedi')
      return
    }
    window.location.reload()
  }

  const chartData = measurements.map((m) => ({
    date: formatDateShort(m.date),
    weight: m.weight,
    body_fat_pct: m.body_fat_pct,
    chest: m.chest,
    waist: m.waist,
    arm: m.arm,
    leg: m.leg,
  }))

  function getProgress(metric: typeof metricOptions[number]) {
    const goal = getGoal(metric.key)
    const value = latest?.[metric.key]
    if (!goal || value == null) return null

    const current = Number(value)
    const target = goal.target_value
    const left = Math.abs(target - current)

    if (left <= 0.1) return { pct: 100, remaining: 'Hedefe ulaştı!', done: true }

    const startVal = first?.[metric.key]
    if (startVal != null) {
      const start = Number(startVal)
      const totalDistance = Math.abs(target - start)
      if (totalDistance > 0) {
        const covered = totalDistance - left
        const pct = Math.min(100, Math.max(5, (covered / totalDistance) * 100))
        return { pct, remaining: `${left.toFixed(1)} ${metric.unit} kaldı`, done: false }
      }
    }

    return { pct: 30, remaining: `${left.toFixed(1)} ${metric.unit} kaldı`, done: false }
  }

  return (
    <div className="space-y-6">
      {/* goalsEnabled: yeni kart tasarimi, degil: eski toggle butonlari */}
      {goalsEnabled ? (
        <>
          {/* Metrik Kartlari — 2x3 grid, her kart tiklanabilir */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {metricOptions.map((metric) => {
              const value = latest?.[metric.key]
              const goal = getGoal(metric.key)
              const progress = getProgress(metric)
              const isSelected = selectedMetrics.includes(metric.key)
              const diffVal = first?.[metric.key] && value ? Number(value) - Number(first[metric.key]) : null
              const isDecreaseGood = metric.key === 'weight' || metric.key === 'waist' || metric.key === 'body_fat_pct'

              return (
                <button
                  key={metric.key}
                  onClick={() => openGoalModal(metric)}
                  className="relative text-left p-3.5 rounded-xl border transition-all cursor-pointer active:scale-[0.98] bg-surface border-border hover:border-text-secondary/30"
                  style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--color-primary)' }}
                >
                  {/* Grafik toggle */}
                  <div
                    onClick={(e) => { e.stopPropagation(); toggleMetric(metric.key) }}
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? 'bg-black/10' : 'bg-transparent'
                    }`}
                    title={isSelected ? 'Grafikten kaldır' : 'Grafikte göster'}
                  >
                    <svg className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-text-primary' : 'text-border'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>

                  <div className="text-xs font-medium text-text-secondary mb-1">{metric.label}</div>

                  {value != null ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-text-primary">{value}</span>
                      <span className="text-xs text-text-secondary">{metric.unit}</span>
                      {diffVal != null && diffVal !== 0 && (
                        <span className={`text-xs font-medium ${
                          isDecreaseGood
                            ? (diffVal < 0 ? 'text-success' : 'text-danger')
                            : (diffVal > 0 ? 'text-success' : 'text-danger')
                        }`}>
                          {diffVal > 0 ? '+' : ''}{diffVal.toFixed(1)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-text-secondary">Ölçüm yok</div>
                  )}

                  {goal && progress ? (
                    <div className="mt-2.5">
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progress.done ? 'bg-success' : ''}`}
                          style={{ width: `${progress.pct}%`, backgroundColor: progress.done ? undefined : 'var(--color-primary)' }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className={`text-[10px] ${progress.done ? 'text-success font-medium' : 'text-text-secondary'}`}>
                          {progress.remaining}
                        </span>
                        <span className="text-[10px] text-text-secondary">Hedef: {goal.target_value}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex items-center gap-1 text-text-secondary">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      <span className="text-xs">Hedef belirle</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </>
      ) : (
        /* Eski tasarim — sadece toggle butonlari */
        <div className="flex flex-wrap gap-2">
          {metricOptions.map((metric) => (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer border
                ${selectedMetrics.includes(metric.key)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-text-secondary hover:text-text-primary'
                }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      )}

      {/* Grafik */}
      <Card>
        <CardHeader>
          <CardTitle>Ölçüm Grafiği</CardTitle>
          {goalsEnabled && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {metricOptions.map((metric) => (
                <button
                  key={metric.key}
                  onClick={() => toggleMetric(metric.key)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer border ${
                    selectedMetrics.includes(metric.key)
                      ? 'border-current text-white'
                      : 'border-border text-text-secondary'
                  }`}
                  style={selectedMetrics.includes(metric.key) ? { backgroundColor: metric.color, borderColor: metric.color } : undefined}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          )}
        </CardHeader>
        {measurements.length < 2 ? (
          <p className="text-sm text-text-secondary text-center py-8">
            Grafik için en az 2 ölçüm gerekli
          </p>
        ) : (
          <div className="h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-text-secondary)" fontSize={11} tick={{ fontSize: 10 }} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={11} tick={{ fontSize: 10 }} width={35} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-text-primary)',
                  }}
                />
                {metricOptions
                  .filter((m) => selectedMetrics.includes(m.key))
                  .map((metric) => (
                    <Line
                      key={metric.key}
                      type="monotone"
                      dataKey={metric.key}
                      name={metric.label}
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={{ fill: metric.color, r: 4 }}
                      connectNulls
                    />
                  ))}
                {metricOptions
                  .filter((m) => selectedMetrics.includes(m.key))
                  .map((metric) => {
                    const goal = getGoal(metric.key)
                    if (!goal) return null
                    return (
                      <ReferenceLine
                        key={`goal-${metric.key}`}
                        y={goal.target_value}
                        stroke={metric.color}
                        strokeDasharray="6 4"
                        strokeWidth={1.5}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Vucut Kompozisyonu karti */}
      <BodyCompositionCard measurements={measurements} gender={gender ?? undefined} />

      {/* Ölçüm geçmişi tablosu */}
      {measurements.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Ölçüm Geçmişi</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary">
                  <th className="text-left py-2 pr-2 sm:pr-4 sticky left-0 bg-surface z-10">Tarih</th>
                  <th className="text-right py-2 px-1.5 sm:px-2">Kilo</th>
                  <th className="text-right py-2 px-1.5 sm:px-2">Yağ %</th>
                  <th className="text-right py-2 px-1.5 sm:px-2">Göğüs</th>
                  <th className="text-right py-2 px-1.5 sm:px-2">Bel</th>
                  <th className="text-right py-2 px-1.5 sm:px-2">Kol</th>
                  <th className="text-right py-2 px-1.5 sm:px-2">Bacak</th>
                  <th className="text-right py-2 px-1.5 sm:px-2 text-orange-400/70">SF G.</th>
                  <th className="text-right py-2 px-1.5 sm:px-2 text-orange-400/70">SF K.</th>
                  <th className="text-right py-2 px-1.5 sm:px-2 text-orange-400/70">SF U.</th>
                </tr>
              </thead>
              <tbody>
                {[...measurements].reverse().map((m) => (
                  <tr key={m.id} className="border-b border-border/50">
                    <td className="py-2 pr-2 sm:pr-4 whitespace-nowrap sticky left-0 bg-surface z-10">{formatDateShort(m.date)}</td>
                    <td className="text-right py-2 px-1.5 sm:px-2">{m.weight || '-'}</td>
                    <td className="text-right py-2 px-1.5 sm:px-2 text-orange-400 font-medium">{m.body_fat_pct ? `${m.body_fat_pct}%` : '-'}</td>
                    <td className="text-right py-2 px-1.5 sm:px-2">{m.chest || '-'}</td>
                    <td className="text-right py-2 px-1.5 sm:px-2">{m.waist || '-'}</td>
                    <td className="text-right py-2 px-1.5 sm:px-2">{m.arm || '-'}</td>
                    <td className="text-right py-2 px-1.5 sm:px-2">{m.leg || '-'}</td>
                    <td className="text-right py-2 px-1.5 sm:px-2 text-orange-400/80">{m.sf_chest || '-'}</td>
                    <td className="text-right py-2 px-1.5 sm:px-2 text-orange-400/80">{m.sf_abdomen || '-'}</td>
                    <td className="text-right py-2 px-1.5 sm:px-2 text-orange-400/80">{m.sf_thigh || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Hedef Modal */}
      {goalModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={() => setGoalModal(null)}>
          <div
            className="bg-surface rounded-t-2xl sm:rounded-2xl border border-border w-full sm:max-w-sm p-5 pb-8 sm:pb-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle — mobil */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${metricOptions.find(m => m.key === goalModal.metric)?.color}15` }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: metricOptions.find(m => m.key === goalModal.metric)?.color }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={metricOptions.find(m => m.key === goalModal.metric)?.icon} />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {metricOptions.find(m => m.key === goalModal.metric)?.label} Hedefi
                </h3>
                {goalModal.current !== null && (
                  <p className="text-sm text-text-secondary">
                    Mevcut: <span className="font-medium text-text-primary">{goalModal.current} {metricOptions.find(m => m.key === goalModal.metric)?.unit}</span>
                  </p>
                )}
              </div>
            </div>

            <label className="block text-xs font-medium text-text-secondary mb-1.5">Hedef değer</label>
            <input
              type="number"
              step="0.1"
              value={goalValue}
              onChange={e => setGoalValue(e.target.value)}
              placeholder={`örnek: ${goalModal.current ? Math.round(Number(goalModal.current) * 0.9) : '75'}`}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary text-lg font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 mb-4"
              autoFocus
            />

            {goalError && <p className="text-sm text-danger mb-3">{goalError}</p>}

            <div className="flex gap-2">
              {getGoal(goalModal.metric) && (
                <button
                  onClick={() => { deleteGoal(goalModal.metric); setGoalModal(null) }}
                  className="px-4 py-2.5 rounded-xl text-sm text-danger border border-danger/30 hover:bg-danger/10 active:bg-danger/20 transition-colors cursor-pointer"
                >
                  Kaldır
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => setGoalModal(null)}
                className="px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary active:bg-surface-hover transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={saveGoal}
                disabled={!goalValue || saving}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
