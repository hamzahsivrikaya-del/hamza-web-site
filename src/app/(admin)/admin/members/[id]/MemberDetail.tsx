'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateMeasurementPdf } from '@/lib/generateMeasurementPdf'
import { createClient } from '@/lib/supabase/client'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { formatDate, getPackageStatusLabel } from '@/lib/utils'
import ProgressChart from '@/app/(member)/dashboard/progress/ProgressChart'
import type { User, Package, Measurement, Lesson } from '@/lib/types'

interface Props {
  member: User
  packages: (Package & { lessons?: Lesson[] })[]
  measurements: Measurement[]
  lessons: (Lesson & { packages?: { total_lessons: number } })[]
}

export default function MemberDetail({ member, packages, measurements, lessons }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: member.full_name,
    phone: member.phone || '',
    is_active: member.is_active,
  })
  const [saving, setSaving] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const activePackage = packages.find((p) => p.status === 'active')

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    await supabase
      .from('users')
      .update({
        full_name: editForm.full_name,
        phone: editForm.phone || null,
        is_active: editForm.is_active,
      })
      .eq('id', member.id)

    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-text-secondary hover:text-text-primary cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">{member.full_name}</h1>
          <Badge variant={member.is_active ? 'success' : 'default'}>
            {member.is_active ? 'Aktif' : 'Pasif'}
          </Badge>
        </div>
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
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Rapor PDF
            </Button>
          )}
          <Button variant="secondary" onClick={() => setEditing(true)}>Düzenle</Button>
        </div>
      </div>

      {/* Bilgiler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Kişisel Bilgiler</CardTitle></CardHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">E-posta</span>
              <span>{member.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Telefon</span>
              <span>{member.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Başlangıç</span>
              <span>{formatDate(member.start_date)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Aktif Paket</CardTitle></CardHeader>
          {activePackage ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Ders</span>
                <span>{activePackage.used_lessons}/{activePackage.total_lessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Kalan</span>
                <span>{activePackage.total_lessons - activePackage.used_lessons} ders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Bitiş</span>
                <span>{formatDate(activePackage.expire_date)}</span>
              </div>
              {/* Progress bar */}
              <div className="mt-2">
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(activePackage.used_lessons / activePackage.total_lessons) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-secondary">Aktif paket yok</p>
          )}
        </Card>

        <Card>
          <CardHeader><CardTitle>Son Ölçüm</CardTitle></CardHeader>
          {measurements.length > 0 ? (
            <div className="space-y-2 text-sm">
              <div className="text-xs text-text-secondary mb-2">{formatDate(measurements[0].date)}</div>
              {measurements[0].weight && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Kilo</span>
                  <span>{measurements[0].weight} kg</span>
                </div>
              )}
              {measurements[0].body_fat_pct && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Yağ %</span>
                  <span className="text-orange-400 font-medium">{measurements[0].body_fat_pct}%</span>
                </div>
              )}
              {measurements[0].chest && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Göğüs</span>
                  <span>{measurements[0].chest} cm</span>
                </div>
              )}
              {measurements[0].waist && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Bel</span>
                  <span>{measurements[0].waist} cm</span>
                </div>
              )}
              {measurements[0].arm && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Kol</span>
                  <span>{measurements[0].arm} cm</span>
                </div>
              )}
              {measurements[0].leg && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Bacak</span>
                  <span>{measurements[0].leg} cm</span>
                </div>
              )}
              {(measurements[0].sf_chest || measurements[0].sf_abdomen || measurements[0].sf_thigh) && (
                <>
                  <div className="border-t border-border pt-2 mt-2">
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Skinfold (mm)</p>
                  </div>
                  {measurements[0].sf_chest && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Göğüs</span>
                      <span>{measurements[0].sf_chest} mm</span>
                    </div>
                  )}
                  {measurements[0].sf_abdomen && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Karın</span>
                      <span>{measurements[0].sf_abdomen} mm</span>
                    </div>
                  )}
                  {measurements[0].sf_thigh && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Uyluk</span>
                      <span>{measurements[0].sf_thigh} mm</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">Ölçüm yok</p>
          )}
        </Card>
      </div>

      {/* Ölçüm Grafik + Geçmiş */}
      {measurements.length > 0 && (
        <ProgressChart measurements={[...measurements].reverse()} />
      )}

      {/* Paket Geçmişi */}
      <Card>
        <CardHeader><CardTitle>Paket Geçmişi</CardTitle></CardHeader>
        {packages.length > 0 ? (
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-3 rounded-lg border ${
                  pkg.status === 'active' ? 'border-primary/30 bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{pkg.total_lessons} Ders Paketi</span>
                    <span className="text-sm text-text-secondary ml-2">
                      {formatDate(pkg.start_date)}
                    </span>
                  </div>
                  <Badge
                    variant={
                      pkg.status === 'active' ? 'success' : pkg.status === 'expired' ? 'danger' : 'default'
                    }
                  >
                    {getPackageStatusLabel(pkg.status)}
                  </Badge>
                </div>
                <div className="text-sm text-text-secondary mt-1">
                  {pkg.used_lessons}/{pkg.total_lessons} ders kullanıldı
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Paket geçmişi yok</p>
        )}
      </Card>

      {/* Son Dersler */}
      <Card>
        <CardHeader><CardTitle>Son Dersler</CardTitle></CardHeader>
        {lessons.length > 0 ? (
          <div className="space-y-2">
            {lessons.slice(0, 10).map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{formatDate(lesson.date)}</span>
                {lesson.notes && (
                  <span className="text-sm text-text-secondary">{lesson.notes}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Ders kaydı yok</p>
        )}
      </Card>

      {/* Düzenleme Modal */}
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
