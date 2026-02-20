'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateMeasurementPdf } from '@/lib/generateMeasurementPdf'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { formatDate, formatDateShort, getPackageStatusLabel } from '@/lib/utils'
import ProgressChart from '@/app/(member)/dashboard/progress/ProgressChart'
import Select from '@/components/ui/Select'
import type { User, Package, Measurement, Lesson, Gender } from '@/lib/types'

type Tab = 'overview' | 'measurements' | 'packages' | 'lessons'

interface Props {
  member: User
  packages: (Package & { lessons?: Lesson[] })[]
  measurements: Measurement[]
  lessons: (Lesson & { packages?: { total_lessons: number } })[]
}

export default function MemberDetail({ member, packages, measurements, lessons }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: member.full_name,
    phone: member.phone || '',
    gender: (member.gender || '') as '' | Gender,
    is_active: member.is_active,
  })
  const [saving, setSaving] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const activePackage    = packages.find((p) => p.status === 'active')
  const latestMeasurement = measurements[0]
  const initials = member.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('users')
      .update({
        full_name: editForm.full_name,
        phone: editForm.phone || null,
        gender: editForm.gender || null,
        is_active: editForm.is_active,
      })
      .eq('id', member.id)
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview',     label: 'Genel Bakış' },
    { key: 'measurements', label: 'Ölçümler',   count: measurements.length },
    { key: 'packages',     label: 'Paketler',    count: packages.length },
    { key: 'lessons',      label: 'Dersler',     count: lessons.length },
  ]

  return (
    <div className="min-h-screen -mt-6 -mx-4 sm:-mx-6 lg:-mx-8">

      {/* ── Hero + Tab bar ── */}
      <div style={{ background: '#0D0D0D', borderBottom: '1px solid #1E1E1E' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Üst satır: Geri + Aksiyonlar */}
          <div className="flex items-center justify-between pt-4 sm:pt-6 pb-4 sm:pb-5">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-[#4B5563] hover:text-[#F5F0E8] transition-colors text-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Üyeler
            </button>
            <div className="flex gap-2">
              {measurements.length > 0 && (
                <Button
                  variant="secondary"
                  loading={pdfLoading}
                  onClick={async () => {
                    setPdfLoading(true)
                    await generateMeasurementPdf(member, measurements)
                    setPdfLoading(false)
                  }}
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Rapor PDF
                </Button>
              )}
              <Button variant="secondary" onClick={() => setEditing(true)}>Düzenle</Button>
            </div>
          </div>

          {/* Üye kimliği */}
          <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-5">
            {/* Monogram avatar */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}
              >
                <span className="text-base sm:text-lg font-bold text-[#DC2626] -tracking-wide">{initials}</span>
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-[#0D0D0D]"
                style={{ background: member.is_active ? '#22C55E' : '#374151' }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <h1 className="text-lg sm:text-xl font-bold text-[#F5F0E8] tracking-tight truncate">{member.full_name}</h1>
                <Badge variant={member.is_active ? 'success' : 'default'}>
                  {member.is_active ? 'Aktif' : 'Pasif'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm text-[#4B5563]">
                <span className="truncate max-w-[180px] sm:max-w-none">{member.email}</span>
                {member.phone && (
                  <>
                    <span className="text-[#2A2A2A]">·</span>
                    <span>{member.phone}</span>
                  </>
                )}
                <span className="text-[#2A2A2A]">·</span>
                <span>Üyelik: {formatDate(member.start_date)}</span>
              </div>
            </div>
          </div>

          {/* Özet çubuk */}
          {(activePackage || latestMeasurement) && (
            <div className="flex flex-wrap gap-4 sm:gap-6 py-3 border-t border-[#1A1A1A] mb-0.5">
              {activePackage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 10, color: '#374151', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                      Aktif Paket
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 100, height: 4, background: '#1A1A1A', borderRadius: 2, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%', background: '#DC2626', borderRadius: 2,
                            width: `${(activePackage.used_lessons / activePackage.total_lessons) * 100}%`,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#F5F0E8' }}>
                        {activePackage.used_lessons}/{activePackage.total_lessons}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: '#374151', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                      Bitiş
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#F5F0E8' }}>
                      {formatDate(activePackage.expire_date)}
                    </p>
                  </div>
                </div>
              )}
              {latestMeasurement && (
                <div>
                  <p style={{ fontSize: 10, color: '#374151', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                    Son Ölçüm
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
                    {latestMeasurement.weight && (
                      <span style={{ color: '#F5F0E8' }}>{latestMeasurement.weight} kg</span>
                    )}
                    {latestMeasurement.body_fat_pct && (
                      <span style={{ color: '#F97316' }}>{latestMeasurement.body_fat_pct}% yağ</span>
                    )}
                    <span style={{ fontSize: 11, color: '#374151', fontWeight: 400 }}>
                      {formatDateShort(latestMeasurement.date)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab bar */}
          <div className="flex gap-0 -mb-px overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-[#DC2626] text-[#F5F0E8]'
                    : 'border-transparent text-[#4B5563] hover:text-[#9CA3AF]'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key
                        ? 'bg-[#DC2626]/20 text-[#DC2626]'
                        : 'bg-[#1A1A1A] text-[#374151]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab içerikleri ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* GENEL BAKIŞ */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Kişisel Bilgiler */}
              <div className="rounded-xl border border-[#1E1E1E] p-5" style={{ background: '#0D0D0D' }}>
                <p className="text-[10px] text-[#374151] uppercase tracking-widest mb-4">Kişisel Bilgiler</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#374151] mb-0.5">E-posta</p>
                    <p className="text-sm text-[#F5F0E8] break-all">{member.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#374151] mb-0.5">Telefon</p>
                    <p className="text-sm text-[#F5F0E8]">{member.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#374151] mb-0.5">Cinsiyet</p>
                    <p className="text-sm text-[#F5F0E8]">
                      {member.gender === 'male' ? 'Erkek' : member.gender === 'female' ? 'Kadın' : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#374151] mb-0.5">Üyelik Başlangıcı</p>
                    <p className="text-sm text-[#F5F0E8]">{formatDate(member.start_date)}</p>
                  </div>
                </div>
              </div>

              {/* Aktif Paket */}
              <div className="rounded-xl border border-[#1E1E1E] p-5" style={{ background: '#0D0D0D' }}>
                <p className="text-[10px] text-[#374151] uppercase tracking-widest mb-4">Aktif Paket</p>
                {activePackage ? (
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-[#F5F0E8]">
                          {activePackage.total_lessons - activePackage.used_lessons}
                        </p>
                        <p className="text-xs text-[#374151]">kalan ders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#9CA3AF]">{activePackage.used_lessons}/{activePackage.total_lessons}</p>
                        <p className="text-xs text-[#374151]">kullanıldı</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#DC2626] rounded-full"
                        style={{ width: `${(activePackage.used_lessons / activePackage.total_lessons) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#374151]">Bitiş: {formatDate(activePackage.expire_date)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-[#374151]">Aktif paket yok</p>
                )}
              </div>

              {/* Son Ölçüm */}
              <div className="rounded-xl border border-[#1E1E1E] p-5" style={{ background: '#0D0D0D' }}>
                <p className="text-[10px] text-[#374151] uppercase tracking-widest mb-4">Son Ölçüm</p>
                {latestMeasurement ? (
                  <div>
                    <p className="text-xs text-[#374151] mb-3">{formatDate(latestMeasurement.date)}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {latestMeasurement.weight && (
                        <div className="bg-[#111] rounded-lg p-2.5 border border-[#1E1E1E]">
                          <p className="text-lg font-bold text-[#F5F0E8]">{latestMeasurement.weight}</p>
                          <p className="text-[10px] text-[#374151]">kg</p>
                        </div>
                      )}
                      {latestMeasurement.body_fat_pct && (
                        <div className="bg-[#111] rounded-lg p-2.5 border border-[#1E1E1E]">
                          <p className="text-lg font-bold text-orange-400">{latestMeasurement.body_fat_pct}%</p>
                          <p className="text-[10px] text-[#374151]">yağ</p>
                        </div>
                      )}
                      {latestMeasurement.waist && (
                        <div className="bg-[#111] rounded-lg p-2.5 border border-[#1E1E1E]">
                          <p className="text-lg font-bold text-[#F5F0E8]">{latestMeasurement.waist}</p>
                          <p className="text-[10px] text-[#374151]">bel cm</p>
                        </div>
                      )}
                      {latestMeasurement.arm && (
                        <div className="bg-[#111] rounded-lg p-2.5 border border-[#1E1E1E]">
                          <p className="text-lg font-bold text-[#F5F0E8]">{latestMeasurement.arm}</p>
                          <p className="text-[10px] text-[#374151]">kol cm</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#374151]">Ölçüm yok</p>
                )}
              </div>
            </div>

            {/* Son Dersler — özet */}
            <div className="rounded-xl border border-[#1E1E1E] p-5" style={{ background: '#0D0D0D' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-[#374151] uppercase tracking-widest">Son Dersler</p>
                {lessons.length > 5 && (
                  <button
                    onClick={() => setActiveTab('lessons')}
                    className="text-xs text-[#DC2626] hover:text-[#EF4444] transition-colors cursor-pointer"
                  >
                    Tümünü gör →
                  </button>
                )}
              </div>
              {lessons.length > 0 ? (
                <div className="space-y-0">
                  {lessons.slice(0, 5).map((lesson, i) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between py-2.5 border-b border-[#111] last:border-0"
                    >
                      <span className="text-sm text-[#9CA3AF]">{formatDate(lesson.date)}</span>
                      {lesson.notes && (
                        <span className="text-sm text-[#374151] truncate max-w-[120px] sm:max-w-[200px]">{lesson.notes}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#374151]">Ders kaydı yok</p>
              )}
            </div>
          </div>
        )}

        {/* ÖLÇÜMLER */}
        {activeTab === 'measurements' && (
          <div>
            {measurements.length > 0 ? (
              <ProgressChart measurements={[...measurements].reverse()} gender={member.gender} />
            ) : (
              <div className="rounded-xl border border-[#1E1E1E] p-16 text-center" style={{ background: '#0D0D0D' }}>
                <p className="text-[#374151]">Henüz ölçüm kaydı yok</p>
              </div>
            )}
          </div>
        )}

        {/* PAKETLER */}
        {activeTab === 'packages' && (
          <div className="space-y-3">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-xl border p-5"
                  style={{
                    background: '#0D0D0D',
                    borderColor: pkg.status === 'active' ? 'rgba(220,38,38,0.25)' : '#1E1E1E',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-[#F5F0E8]">{pkg.total_lessons} Ders Paketi</p>
                      <p className="text-xs text-[#374151] mt-0.5">{formatDate(pkg.start_date)}</p>
                    </div>
                    <Badge
                      variant={pkg.status === 'active' ? 'success' : pkg.status === 'expired' ? 'danger' : 'default'}
                    >
                      {getPackageStatusLabel(pkg.status)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-[#374151]">
                      <span>{pkg.used_lessons} kullanıldı</span>
                      <span>{pkg.total_lessons - pkg.used_lessons} kalan</span>
                    </div>
                    <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(pkg.used_lessons / pkg.total_lessons) * 100}%`,
                          background: pkg.status === 'active' ? '#DC2626' : '#374151',
                        }}
                      />
                    </div>
                    <p className="text-xs text-[#374151]">Bitiş: {formatDate(pkg.expire_date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-[#1E1E1E] p-16 text-center" style={{ background: '#0D0D0D' }}>
                <p className="text-[#374151]">Paket geçmişi yok</p>
              </div>
            )}
          </div>
        )}

        {/* DERSLER */}
        {activeTab === 'lessons' && (
          <div className="rounded-xl border border-[#1E1E1E] overflow-hidden" style={{ background: '#0D0D0D' }}>
            {lessons.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1A1A1A' }}>
                    <th className="text-left px-3 sm:px-5 py-3 text-[10px] text-[#374151] uppercase tracking-widest font-medium">
                      Tarih
                    </th>
                    <th className="text-left px-3 sm:px-5 py-3 text-[10px] text-[#374151] uppercase tracking-widest font-medium">
                      Not
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson, i) => (
                    <tr
                      key={lesson.id}
                      style={{ borderBottom: i < lessons.length - 1 ? '1px solid #111' : 'none' }}
                    >
                      <td className="px-3 sm:px-5 py-3 text-[#9CA3AF] whitespace-nowrap">{formatDate(lesson.date)}</td>
                      <td className="px-3 sm:px-5 py-3 text-[#374151] truncate max-w-[150px] sm:max-w-none">{lesson.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-16 text-center">
                <p className="text-[#374151]">Ders kaydı yok</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Düzenleme Modal ── */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Üye Düzenle">
        <div className="space-y-4">
          <Input
            label="Ad Soyad"
            value={editForm.full_name}
            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
          />
          <Input
            label="Telefon"
            type="tel"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />
          <Select
            label="Cinsiyet"
            value={editForm.gender}
            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as '' | Gender })}
            options={[
              { value: '', label: 'Seçiniz' },
              { value: 'male', label: 'Erkek' },
              { value: 'female', label: 'Kadın' },
            ]}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={editForm.is_active}
              onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="is_active" className="text-sm">Aktif üye</label>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setEditing(false)}>İptal</Button>
            <Button loading={saving} onClick={handleSave}>Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
