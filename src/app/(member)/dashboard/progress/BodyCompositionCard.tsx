'use client'

import type { Measurement } from '@/lib/types'
import { formatDateShort } from '@/lib/utils'

function getCategory(pct: number) {
  if (pct < 6)  return { label: 'Elite Sporcu', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' }
  if (pct < 14) return { label: 'Fit',          color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' }
  if (pct < 18) return { label: 'Ortalama',     color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' }
  if (pct < 25) return { label: 'Fazla Yağlı',  color: '#F97316', bg: 'rgba(249,115,22,0.12)' }
  return               { label: 'Obez',          color: '#EF4444', bg: 'rgba(239,68,68,0.12)' }
}

/* Dairesel gauge için stroke-dashoffset hesabı */
function gaugeOffset(pct: number, max = 50): number {
  const r = 56
  const circumference = 2 * Math.PI * r
  const clamped = Math.min(Math.max(pct, 0), max)
  return circumference * (1 - clamped / max)
}

interface Props {
  measurements: Measurement[]
}

export default function BodyCompositionCard({ measurements }: Props) {
  // Vücut yağ verisi olan son ölçüm
  const withFat = [...measurements].reverse().filter((m) => m.body_fat_pct != null)
  if (withFat.length === 0) return null

  const latest = withFat[0]
  const pct    = Number(latest.body_fat_pct)
  const weight = Number(latest.weight ?? 0)
  const fatKg  = weight > 0 ? (pct / 100) * weight : null
  const leanKg = weight > 0 && fatKg != null ? weight - fatKg : null
  const fatPct = weight > 0 && fatKg != null ? (fatKg / weight) * 100 : pct
  const cat    = getCategory(pct)

  const r            = 56
  const circumference = 2 * Math.PI * r
  const offset       = gaugeOffset(pct)

  // Önceki ölçümle fark
  const prev      = withFat[1]
  const prevPct   = prev ? Number(prev.body_fat_pct) : null
  const fatDiff   = prevPct != null ? pct - prevPct : null

  return (
    <div
      style={{
        background: '#111010',
        border: '1px solid #2A2A2A',
        borderRadius: '16px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>
            Vücut Kompozisyonu
          </p>
          <p style={{ fontSize: '13px', color: '#4B5563' }}>
            {formatDateShort(latest.date)} ölçümü
          </p>
        </div>
        <span style={{
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1px',
          color: cat.color,
          background: cat.bg,
          border: `1px solid ${cat.color}40`,
          textTransform: 'uppercase',
        }}>
          {cat.label}
        </span>
      </div>

      {/* Ana içerik — gauge + metrikler */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>

        {/* Gauge */}
        <div style={{ position: 'relative', flexShrink: 0, width: 144, height: 144 }}>
          <svg width="144" height="144" style={{ transform: 'rotate(-90deg)' }}>
            {/* Arka halka */}
            <circle cx="72" cy="72" r={r} fill="none" stroke="#1E1E1E" strokeWidth="12" />
            {/* Yağ % halka */}
            <circle
              cx="72" cy="72" r={r}
              fill="none"
              stroke={cat.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
            />
          </svg>
          {/* Ortadaki yazı */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: cat.color, lineHeight: 1 }}>
              {pct.toFixed(1)}
            </span>
            <span style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>Yağ %</span>
            {fatDiff != null && (
              <span style={{
                fontSize: '11px',
                color: fatDiff < 0 ? '#22C55E' : '#EF4444',
                marginTop: '3px',
                fontWeight: 600,
              }}>
                {fatDiff > 0 ? '▲' : '▼'} {Math.abs(fatDiff).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Metrikler */}
        <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Yağ / Kas split bar */}
          {fatKg != null && leanKg != null && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#F97316', fontWeight: 600 }}>
                  Yağ {fatKg.toFixed(1)} kg
                </span>
                <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600 }}>
                  Kas {leanKg.toFixed(1)} kg
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: '#1E1E1E', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${fatPct}%`,
                  background: 'linear-gradient(90deg, #F97316, #EF4444)',
                  borderRadius: '4px',
                  transition: 'width 1s ease',
                }} />
                <div style={{
                  position: 'absolute', right: 0, top: 0, bottom: 0,
                  width: `${100 - fatPct}%`,
                  background: 'linear-gradient(90deg, #2563EB, #3B82F6)',
                  borderRadius: '4px',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          )}

          {/* Kilo */}
          {weight > 0 && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, background: '#1A1A1A', borderRadius: '10px', padding: '12px 14px', border: '1px solid #2A2A2A' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#F5F0E8' }}>{weight}</div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Toplam kg</div>
              </div>
              {fatKg != null && (
                <div style={{ flex: 1, background: '#1A1A1A', borderRadius: '10px', padding: '12px 14px', border: '1px solid #2A2A2A' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#F97316' }}>{fatKg.toFixed(1)}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Yağ kg</div>
                </div>
              )}
              {leanKg != null && (
                <div style={{ flex: 1, background: '#1A1A1A', borderRadius: '10px', padding: '12px 14px', border: '1px solid #2A2A2A' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#3B82F6' }}>{leanKg.toFixed(1)}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Kas kg</div>
                </div>
              )}
            </div>
          )}

          {/* Skinfold ölçümleri */}
          {(latest.sf_chest || latest.sf_abdomen || latest.sf_thigh) && (
            <div style={{ background: '#1A1A1A', borderRadius: '10px', padding: '14px 16px', border: '1px solid #2A2A2A' }}>
              <p style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                Skinfold Kaliper (mm)
              </p>
              <div style={{ display: 'flex', gap: '20px' }}>
                {latest.sf_chest && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#F59E0B' }}>{latest.sf_chest}</div>
                    <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '1px' }}>Göğüs</div>
                  </div>
                )}
                {latest.sf_abdomen && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#F59E0B' }}>{latest.sf_abdomen}</div>
                    <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '1px' }}>Karın</div>
                  </div>
                )}
                {latest.sf_thigh && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#F59E0B' }}>{latest.sf_thigh}</div>
                    <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '1px' }}>Uyluk</div>
                  </div>
                )}
                {latest.sf_chest && latest.sf_abdomen && latest.sf_thigh && (
                  <>
                    <div style={{ width: '1px', background: '#2A2A2A', margin: '0 4px' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#F5F0E8' }}>
                        {Number(latest.sf_chest) + Number(latest.sf_abdomen) + Number(latest.sf_thigh)}
                      </div>
                      <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '1px' }}>Toplam</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Geçmiş yağ % tablosu (2+ ölçüm varsa) */}
      {withFat.length > 1 && (
        <div style={{ marginTop: '24px', borderTop: '1px solid #1E1E1E', paddingTop: '20px' }}>
          <p style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Yağ % Geçmişi
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {withFat.slice(0, 8).reverse().map((m, i, arr) => {
              const p   = Number(m.body_fat_pct)
              const prev = arr[i - 1]
              const d   = prev ? p - Number(prev.body_fat_pct) : null
              const c   = getCategory(p)
              return (
                <div key={m.id} style={{
                  background: '#1A1A1A', border: '1px solid #2A2A2A',
                  borderRadius: '10px', padding: '10px 14px', textAlign: 'center',
                  minWidth: '72px',
                }}>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: c.color }}>{p.toFixed(1)}%</div>
                  <div style={{ fontSize: '10px', color: '#4B5563', marginTop: '2px' }}>{formatDateShort(m.date)}</div>
                  {d != null && d !== 0 && (
                    <div style={{ fontSize: '10px', color: d < 0 ? '#22C55E' : '#EF4444', marginTop: '2px', fontWeight: 600 }}>
                      {d > 0 ? '▲' : '▼'}{Math.abs(d).toFixed(1)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
