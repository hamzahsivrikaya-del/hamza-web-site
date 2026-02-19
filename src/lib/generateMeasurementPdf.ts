import type { Measurement, User } from '@/lib/types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function getCategory(pct: number): string {
  if (pct < 6)  return 'Elite Sporcu'
  if (pct < 14) return 'Fit'
  if (pct < 18) return 'Ortalama'
  if (pct < 25) return 'Fazla Yağlı'
  return 'Obez'
}

export async function generateMeasurementPdf(member: User, measurements: Measurement[]) {
  // Dynamic import → sadece butona tıklanınca yüklenir
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const pageH = 297
  const margin = 18

  // ─── Renk paleti ───────────────────────────────────────
  const RED    = [220, 38, 38]   as [number, number, number]
  const DARK   = [17, 17, 17]    as [number, number, number]
  const CREAM  = [245, 240, 232] as [number, number, number]
  const GRAY   = [100, 100, 100] as [number, number, number]
  const LGRAY  = [180, 180, 180] as [number, number, number]
  const ORANGE = [249, 115, 22]  as [number, number, number]
  const BLUE   = [59, 130, 246]  as [number, number, number]

  // ─── Filigran ──────────────────────────────────────────
  const totalPages = 1 // sonradan güncellenir
  const drawWatermark = () => {
    doc.saveGraphicsState?.()
    doc.setGState?.(new (doc as any).GState({ opacity: 0.04 }))
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(60)
    doc.setTextColor(...DARK)
    // Merkez + 45° döndür
    const cx = W / 2
    const cy = pageH / 2
    doc.text('HAMZA', cx - 20, cy - 14, { angle: 45 })
    doc.text('SİVRİKAYA', cx - 36, cy + 10, { angle: 45 })
    doc.setGState?.(new (doc as any).GState({ opacity: 1 }))
    doc.restoreGraphicsState?.()
  }
  drawWatermark()

  // ─── Üst kırmızı şerit ─────────────────────────────────
  doc.setFillColor(...RED)
  doc.rect(0, 0, W, 10, 'F')

  // ─── Header bölümü ─────────────────────────────────────
  doc.setFillColor(...DARK)
  doc.rect(0, 10, W, 40, 'F')

  // Logo / İsim
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(...RED)
  doc.text('HAMZA SİVRİKAYA', margin, 28)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...LGRAY)
  doc.text('KİŞİSEL ANTRENÖR  ·  ANTALYA', margin, 35)

  // Sağ: Rapor başlığı
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...CREAM)
  doc.text('VÜCUT ÖLÇÜM RAPORU', W - margin, 26, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...LGRAY)
  doc.text(`Rapor tarihi: ${formatDate(new Date().toISOString())}`, W - margin, 33, { align: 'right' })

  // ─── Üye bilgi kartı ───────────────────────────────────
  let y = 60

  doc.setFillColor(26, 26, 26)
  doc.roundedRect(margin, y, W - margin * 2, 22, 3, 3, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...CREAM)
  doc.text(member.full_name, margin + 6, y + 8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...LGRAY)
  doc.text(`E-posta: ${member.email}`, margin + 6, y + 15)
  if (member.phone) {
    doc.text(`Tel: ${member.phone}`, margin + 80, y + 15)
  }
  doc.text(`Üyelik başlangıcı: ${formatDate(member.start_date)}`, W - margin - 6, y + 15, { align: 'right' })

  y += 32

  // ─── Son ölçüm özeti ───────────────────────────────────
  const sorted = [...measurements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const latest = sorted[0]
  const first  = sorted[sorted.length - 1]

  if (latest) {
    // Başlık
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...RED)
    doc.text('SON ÖLÇÜM ÖZETİ', margin, y)
    doc.setDrawColor(...RED)
    doc.setLineWidth(0.5)
    doc.line(margin, y + 1, margin + 40, y + 1)
    y += 6

    const cards = [
      { label: 'Kilo', value: latest.weight ? `${latest.weight} kg` : '-', color: CREAM },
      { label: 'Yağ %', value: latest.body_fat_pct ? `${latest.body_fat_pct}%` : '-', color: ORANGE },
      { label: 'Kategori', value: latest.body_fat_pct ? getCategory(Number(latest.body_fat_pct)) : '-', color: CREAM },
      { label: 'Göğüs', value: latest.chest ? `${latest.chest} cm` : '-', color: CREAM },
      { label: 'Bel', value: latest.waist ? `${latest.waist} cm` : '-', color: CREAM },
      { label: 'Kol', value: latest.arm ? `${latest.arm} cm` : '-', color: CREAM },
    ]

    const cardW = (W - margin * 2 - 5 * 3) / 6
    cards.forEach((card, i) => {
      const cx = margin + i * (cardW + 3)
      doc.setFillColor(26, 26, 26)
      doc.roundedRect(cx, y, cardW, 20, 2, 2, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...card.color)
      doc.text(card.value, cx + cardW / 2, y + 9, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(...LGRAY)
      doc.text(card.label, cx + cardW / 2, y + 16, { align: 'center' })
    })
    y += 28

    // Yağ/kas kütlesi
    if (latest.body_fat_pct && latest.weight) {
      const fatKg  = (Number(latest.body_fat_pct) / 100) * Number(latest.weight)
      const leanKg = Number(latest.weight) - fatKg

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...ORANGE)
      doc.text(`Yağ kütlesi: ${fatKg.toFixed(1)} kg`, margin, y)
      doc.setTextColor(...BLUE)
      doc.text(`Kas kütlesi: ${leanKg.toFixed(1)} kg`, margin + 50, y)

      // Split bar
      const barX = margin + 100
      const barW = W - margin - barX
      const fatW = (fatKg / Number(latest.weight)) * barW
      doc.setFillColor(...ORANGE)
      doc.roundedRect(barX, y - 4, fatW, 5, 1, 1, 'F')
      doc.setFillColor(...BLUE)
      doc.roundedRect(barX + fatW, y - 4, barW - fatW, 5, 1, 1, 'F')
      y += 10
    }

    // Skinfold
    if (latest.sf_chest || latest.sf_abdomen || latest.sf_thigh) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(245, 158, 11)
      const sfParts = []
      if (latest.sf_chest)   sfParts.push(`Göğüs: ${latest.sf_chest} mm`)
      if (latest.sf_abdomen) sfParts.push(`Karın: ${latest.sf_abdomen} mm`)
      if (latest.sf_thigh)   sfParts.push(`Uyluk: ${latest.sf_thigh} mm`)
      if (latest.sf_chest && latest.sf_abdomen && latest.sf_thigh) {
        sfParts.push(`Toplam: ${Number(latest.sf_chest) + Number(latest.sf_abdomen) + Number(latest.sf_thigh)} mm`)
      }
      doc.text('Skinfold: ' + sfParts.join('   '), margin, y)
      y += 8
    }
  }

  // ─── İlerleme karşılaştırma (ilk vs son) ───────────────
  if (sorted.length >= 2) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...RED)
    doc.text('GELİŞİM KARŞILAŞTIRMASI', margin, y + 4)
    doc.setDrawColor(...RED)
    doc.line(margin, y + 5, margin + 55, y + 5)
    y += 10

    const metrics: { key: keyof Measurement; label: string; unit: string; goodDown: boolean }[] = [
      { key: 'weight',       label: 'Kilo',    unit: 'kg', goodDown: true  },
      { key: 'body_fat_pct', label: 'Yağ %',   unit: '%',  goodDown: true  },
      { key: 'chest',        label: 'Göğüs',   unit: 'cm', goodDown: false },
      { key: 'waist',        label: 'Bel',     unit: 'cm', goodDown: true  },
      { key: 'arm',          label: 'Kol',     unit: 'cm', goodDown: false },
      { key: 'leg',          label: 'Bacak',   unit: 'cm', goodDown: false },
    ]

    const compRows = metrics
      .filter((m) => first[m.key] != null && latest[m.key] != null)
      .map((m) => {
        const f   = Number(first[m.key])
        const l   = Number(latest[m.key])
        const d   = l - f
        const isGood = m.goodDown ? d < 0 : d > 0
        const arrow  = d > 0 ? '▲' : d < 0 ? '▼' : '─'
        return [
          m.label,
          `${f} ${m.unit}`,
          `${l} ${m.unit}`,
          `${arrow} ${Math.abs(d).toFixed(1)} ${m.unit}`,
          isGood ? 'İyi' : d === 0 ? '-' : 'Kötü',
        ]
      })

    autoTable(doc, {
      startY: y,
      head: [['Ölçüm', `İlk (${formatDateShort(first.date)})`, `Son (${formatDateShort(latest.date)})`, 'Değişim', 'Durum']],
      body: compRows,
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: DARK,
        textColor: CREAM,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 8, textColor: [200, 200, 200] },
      alternateRowStyles: { fillColor: [22, 22, 22] },
      styles: { fillColor: [17, 17, 17], lineColor: [40, 40, 40], lineWidth: 0.3 },
      columnStyles: {
        3: { fontStyle: 'bold' },
        4: {
          halign: 'center',
          fontStyle: 'bold',
        },
      },
      didParseCell: (data) => {
        if (data.column.index === 4 && data.section === 'body') {
          if (data.cell.text[0] === 'İyi')  data.cell.styles.textColor = [34, 197, 94]
          if (data.cell.text[0] === 'Kötü') data.cell.styles.textColor = [239, 68, 68]
        }
      },
    })

    y = (doc as any).lastAutoTable.finalY + 12
  }

  // ─── Tüm ölçüm geçmişi tablosu ─────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...RED)
  doc.text('ÖLÇÜM GEÇMİŞİ', margin, y)
  doc.setDrawColor(...RED)
  doc.line(margin, y + 1, margin + 38, y + 1)
  y += 6

  const histRows = sorted.map((m) => [
    formatDateShort(m.date),
    m.weight    ? `${m.weight} kg`       : '-',
    m.body_fat_pct ? `${m.body_fat_pct}%` : '-',
    m.chest     ? `${m.chest} cm`        : '-',
    m.waist     ? `${m.waist} cm`        : '-',
    m.arm       ? `${m.arm} cm`          : '-',
    m.leg       ? `${m.leg} cm`          : '-',
    (m.sf_chest && m.sf_abdomen && m.sf_thigh)
      ? `${Number(m.sf_chest) + Number(m.sf_abdomen) + Number(m.sf_thigh)}`
      : '-',
  ])

  autoTable(doc, {
    startY: y,
    head: [['Tarih', 'Kilo', 'Yağ %', 'Göğüs', 'Bel', 'Kol', 'Bacak', 'SF Toplam']],
    body: histRows,
    margin: { left: margin, right: margin },
    headStyles: { fillColor: DARK, textColor: CREAM, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [200, 200, 200] },
    alternateRowStyles: { fillColor: [22, 22, 22] },
    styles: { fillColor: [17, 17, 17], lineColor: [40, 40, 40], lineWidth: 0.3 },
    columnStyles: {
      2: { textColor: [249, 115, 22], fontStyle: 'bold' }, // Yağ %
    },
  })

  // ─── Footer ────────────────────────────────────────────
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFillColor(...DARK)
    doc.rect(0, pageH - 12, W, 12, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.text('hamzasivrikaya.com  ·  0545 681 4776  ·  @hamzasivrikayaa', margin, pageH - 4.5)
    doc.text(`${i} / ${pageCount}`, W - margin, pageH - 4.5, { align: 'right' })
  }

  // ─── İndir ─────────────────────────────────────────────
  const safeName = member.full_name.replace(/\s+/g, '-').toLowerCase()
  doc.save(`olcum-raporu-${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`)
}
