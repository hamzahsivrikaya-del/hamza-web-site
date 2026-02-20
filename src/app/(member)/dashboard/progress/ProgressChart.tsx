'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDate, formatDateShort } from '@/lib/utils'
import type { Gender, Measurement } from '@/lib/types'
import BodyCompositionCard from './BodyCompositionCard'

const metricOptions = [
  { key: 'weight', label: 'Kilo', unit: 'kg', color: '#DC2626' },
  { key: 'body_fat_pct', label: 'Yağ %', unit: '%', color: '#F97316' },
  { key: 'chest', label: 'Göğüs', unit: 'cm', color: '#F59E0B' },
  { key: 'waist', label: 'Bel', unit: 'cm', color: '#22C55E' },
  { key: 'arm', label: 'Kol', unit: 'cm', color: '#3B82F6' },
  { key: 'leg', label: 'Bacak', unit: 'cm', color: '#8B5CF6' },
] as const

type MetricKey = typeof metricOptions[number]['key']

export default function ProgressChart({ measurements, gender }: { measurements: Measurement[]; gender?: Gender | null }) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(['weight'])

  const toggleMetric = (key: MetricKey) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    )
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

  // Son ölçüm
  const latest = measurements[measurements.length - 1]

  return (
    <div className="space-y-6">
      {/* Ölçü seçici butonları */}
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

      {/* Grafik */}
      <Card>
        <CardHeader><CardTitle>Ölçüm Grafiği</CardTitle></CardHeader>
        {measurements.length < 2 ? (
          <p className="text-sm text-text-secondary text-center py-8">
            Grafik için en az 2 ölçüm gerekli
          </p>
        ) : (
          <div className="h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" fontSize={11} tick={{ fontSize: 10 }} width={35} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '8px',
                    color: '#F5F0E8',
                  }}
                />
                <Legend />
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Vücut Kompozisyonu kartı */}
      <BodyCompositionCard measurements={measurements} gender={gender ?? undefined} />

      {/* Güncel ölçümler kartı */}
      {latest && (
        <Card>
          <CardHeader>
            <CardTitle>Güncel Ölçümler</CardTitle>
            <p className="text-xs text-text-secondary">{formatDate(latest.date)}</p>
          </CardHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {metricOptions.map((metric) => {
              const value = latest[metric.key]
              if (!value) return null

              // İlk ve son ölçüm karşılaştırma
              const first = measurements[0]?.[metric.key]
              const diff = first ? Number(value) - Number(first) : null

              return (
                <div key={metric.key} className="text-center p-3 rounded-lg bg-surface-hover">
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-text-secondary">{metric.label} ({metric.unit})</div>
                  {diff !== null && diff !== 0 && (
                    <div className={`text-xs mt-1 ${diff > 0 ? 'text-danger' : 'text-success'}`}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

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
    </div>
  )
}
