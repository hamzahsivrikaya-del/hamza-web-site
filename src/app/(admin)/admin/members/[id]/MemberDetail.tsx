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
    { key: 'overview',     label: 'Genel Bakis' },
    { key: 'measurements', label: 'Olcumler',   count: measurements.length },
    { key: 'packages',     label: 'Paketler',    count: packages.length },
    { key: 'lessons',      label: 'Dersler',     count: lessons.length },
  ]

  return (
    <div className="min-h-screen -mt-6 -mx-4 sm:-mx-6 lg:-mx-8">

      {/* -- Hero + Tab bar -- */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Ust satir: Geri + Aksiyonlar */}
          <div className="flex items-center justify-between pt-4 sm:pt-6 pb-4 sm:pb-5">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors text-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Uyeler
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
              <Button variant="secondary" onClick={() => setEditing(true)}>Duzenle</Button>
            </div>
          </div>

          {/* Uye kimligi */}
          <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-5">
            {/* Monogram avatar */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/25">
                <span className="text-base sm:text-lg font-bold text-primary -tracking-wide">{initials}</span>
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-surface ${member.is_active ? 'bg-success' : 'bg-text-secondary/40'}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight truncate">{member.full_name}</h1>
                <Badge variant={member.is_active ? 'success' : 'default'}>
                  {member.is_active ? 'Aktif' : 'Pasif'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm text-text-secondary">
                <span className="truncate max-w-[180px] sm:max-w-none">{member.email}</span>
                {member.phone && (
                  <>
                    <span className="text-border">·</span>
                    <span>{member.phone}</span>
                  </>
                )}
                <span className="text-border">·</span>
                <span>Uyelik: {formatDate(member.start_date)}</span>
              </div>
            </div>
          </div>

          {/* Ozet cubuk */}
          {(activePackage || latestMeasurement) && (
            <div className="grid grid-cols-1 sm:grid-cols-none sm:flex sm:flex-wrap gap-3 sm:gap-6 py-3 border-t border-border mb-0.5">
              {activePackage && (
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Aktif Paket</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 sm:w-[100px] h-1 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(activePackage.used_lessons / activePackage.total_lessons) * 100}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-semibold text-text-primary">
                        {activePackage.used_lessons}/{activePackage.total_lessons}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Bitis</p>
                    <p className="text-[13px] font-semibold text-text-primary">
                      {formatDate(activePackage.expire_date)}
                    </p>
                  </div>
                </div>
              )}
              {latestMeasurement && (
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Son Olcum</p>
                  <div className="flex items-center gap-2.5 text-[13px] font-semibold">
                    {latestMeasurement.weight && (
                      <span className="text-text-primary">{latestMeasurement.weight} kg</span>
                    )}
                    {latestMeasurement.body_fat_pct && (
                      <span className="text-orange-500">{latestMeasurement.body_fat_pct}% yag</span>
                    )}
                    <span className="text-[11px] text-text-secondary font-normal">
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
                    ? 'border-primary text-text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key
                        ? 'bg-primary/15 text-primary'
                        : 'bg-surface-hover text-text-secondary'
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

      {/* -- Tab icerikleri -- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* GENEL BAKIS */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Kisisel Bilgiler */}
              <div className="rounded-xl border border-border p-5 bg-surface">
                <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-4">Kisisel Bilgiler</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">E-posta</p>
                    <p className="text-sm text-text-primary break-all">{member.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Telefon</p>
                    <p className="text-sm text-text-primary">{member.phone || '\u2014'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Cinsiyet</p>
                    <p className="text-sm text-text-primary">
                      {member.gender === 'male' ? 'Erkek' : member.gender === 'female' ? 'Kadin' : '\u2014'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Uyelik Baslangici</p>
                    <p className="text-sm text-text-primary">{formatDate(member.start_date)}</p>
                  </div>
                </div>
              </div>

              {/* Aktif Paket */}
              <div className="rounded-xl border border-border p-5 bg-surface">
                <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-4">Aktif Paket</p>
                {activePackage ? (
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-text-primary">
                          {activePackage.total_lessons - activePackage.used_lessons}
                        </p>
                        <p className="text-xs text-text-secondary">kalan ders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-secondary">{activePackage.used_lessons}/{activePackage.total_lessons}</p>
                        <p className="text-xs text-text-secondary">kullanildi</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(activePackage.used_lessons / activePackage.total_lessons) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-secondary">Bitis: {formatDate(activePackage.expire_date)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">Aktif paket yok</p>
                )}
              </div>

              {/* Son Olcum */}
              <div className="rounded-xl border border-border p-5 bg-surface">
                <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-4">Son Olcum</p>
                {latestMeasurement ? (
                  <div>
                    <p className="text-xs text-text-secondary mb-3">{formatDate(latestMeasurement.date)}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {latestMeasurement.weight && (
                        <div className="bg-surface-hover rounded-lg p-2.5 border border-border">
                          <p className="text-lg font-bold text-text-primary">{latestMeasurement.weight}</p>
                          <p className="text-[10px] text-text-secondary">kg</p>
                        </div>
                      )}
                      {latestMeasurement.body_fat_pct && (
                        <div className="bg-surface-hover rounded-lg p-2.5 border border-border">
                          <p className="text-lg font-bold text-orange-500">{latestMeasurement.body_fat_pct}%</p>
                          <p className="text-[10px] text-text-secondary">yag</p>
                        </div>
                      )}
                      {latestMeasurement.waist && (
                        <div className="bg-surface-hover rounded-lg p-2.5 border border-border">
                          <p className="text-lg font-bold text-text-primary">{latestMeasurement.waist}</p>
                          <p className="text-[10px] text-text-secondary">bel cm</p>
                        </div>
                      )}
                      {latestMeasurement.arm && (
                        <div className="bg-surface-hover rounded-lg p-2.5 border border-border">
                          <p className="text-lg font-bold text-text-primary">{latestMeasurement.arm}</p>
                          <p className="text-[10px] text-text-secondary">kol cm</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">Olcum yok</p>
                )}
              </div>
            </div>

            {/* Son Dersler -- ozet */}
            <div className="rounded-xl border border-border p-5 bg-surface">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-text-secondary uppercase tracking-widest">Son Dersler</p>
                {lessons.length > 5 && (
                  <button
                    onClick={() => setActiveTab('lessons')}
                    className="text-xs text-primary hover:text-primary-hover transition-colors cursor-pointer"
                  >
                    Tumunu gor →
                  </button>
                )}
              </div>
              {lessons.length > 0 ? (
                <div className="space-y-0">
                  {lessons.slice(0, 5).map((lesson, i) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
                    >
                      <span className="text-sm text-text-secondary">{formatDate(lesson.date)}</span>
                      {lesson.notes && (
                        <span className="text-sm text-text-secondary truncate max-w-[120px] sm:max-w-[200px]">{lesson.notes}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">Ders kaydi yok</p>
              )}
            </div>
          </div>
        )}

        {/* OLCUMLER */}
        {activeTab === 'measurements' && (
          <div>
            {measurements.length > 0 ? (
              <ProgressChart measurements={[...measurements].reverse()} gender={member.gender} />
            ) : (
              <div className="rounded-xl border border-border p-16 text-center bg-surface">
                <p className="text-text-secondary">Henuz olcum kaydi yok</p>
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
                  className={`rounded-xl border p-5 bg-surface ${
                    pkg.status === 'active' ? 'border-primary/25' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-text-primary">{pkg.total_lessons} Ders Paketi</p>
                      <p className="text-xs text-text-secondary mt-0.5">{formatDate(pkg.start_date)}</p>
                    </div>
                    <Badge
                      variant={pkg.status === 'active' ? 'success' : pkg.status === 'expired' ? 'danger' : 'default'}
                    >
                      {getPackageStatusLabel(pkg.status)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>{pkg.used_lessons} kullanildi</span>
                      <span>{pkg.total_lessons - pkg.used_lessons} kalan</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pkg.status === 'active' ? 'bg-primary' : 'bg-text-secondary/40'}`}
                        style={{ width: `${(pkg.used_lessons / pkg.total_lessons) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-secondary">Bitis: {formatDate(pkg.expire_date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-border p-16 text-center bg-surface">
                <p className="text-text-secondary">Paket gecmisi yok</p>
              </div>
            )}
          </div>
        )}

        {/* DERSLER */}
        {activeTab === 'lessons' && (
          <div className="rounded-xl border border-border overflow-hidden bg-surface">
            {lessons.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 sm:px-5 py-3 text-[10px] text-text-secondary uppercase tracking-widest font-medium">
                      Tarih
                    </th>
                    <th className="text-left px-3 sm:px-5 py-3 text-[10px] text-text-secondary uppercase tracking-widest font-medium">
                      Not
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson, i) => (
                    <tr
                      key={lesson.id}
                      className={i < lessons.length - 1 ? 'border-b border-border/50' : ''}
                    >
                      <td className="px-3 sm:px-5 py-3 text-text-secondary whitespace-nowrap">{formatDate(lesson.date)}</td>
                      <td className="px-3 sm:px-5 py-3 text-text-secondary truncate max-w-[150px] sm:max-w-none">{lesson.notes || '\u2014'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-16 text-center">
                <p className="text-text-secondary">Ders kaydi yok</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* -- Duzenleme Modal -- */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Uye Duzenle">
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
              { value: '', label: 'Seciniz' },
              { value: 'male', label: 'Erkek' },
              { value: 'female', label: 'Kadin' },
            ]}
          />
          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
            <div>
              <p className="text-sm font-medium text-text-primary">Uye Durumu</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {editForm.is_active ? 'Uye aktif \u2014 giris yapabilir' : 'Uye pasif \u2014 giris yapamaz'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                editForm.is_active ? 'bg-green-500' : 'bg-border'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                editForm.is_active ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setEditing(false)}>Iptal</Button>
            <Button loading={saving} onClick={handleSave}>Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
