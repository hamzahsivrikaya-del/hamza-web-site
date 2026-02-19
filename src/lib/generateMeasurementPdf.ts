import type { Measurement, User } from '@/lib/types'

/* ─── Tarih formatları ─────────────────────────────────── */
function fmtLong(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
function fmtShort(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

/* ─── Vücut yağ kategorisi ─────────────────────────────── */
function getCategory(pct: number): string {
  if (pct < 6)  return 'Elite Sporcu'
  if (pct < 14) return 'Fit'
  if (pct < 18) return 'Ortalama'
  if (pct < 25) return 'Fazla Yagli'   // ğ → jsPDF'te bile sorun olabilir
  return 'Obez'
}

/* ─── Local font TTF yükle → base64 ──────────────────── */
async function loadFontBase64(filename: string): Promise<string> {
  const ab    = await fetch(`/fonts/${filename}`).then((r) => r.arrayBuffer())
  const bytes = new Uint8Array(ab)
  // Uint8Array → base64: chunk'lar halinde dönüştür (büyük fontlar için)
  let binary  = ''
  const chunk = 8192
  for (let i = 0; i < bytes.byteLength; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

/* ─── Ana PDF üreticisi ────────────────────────────────── */
export async function generateMeasurementPdf(member: User, measurements: Measurement[]) {
  const { default: jsPDF }    = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  // Noto Sans — tam Türkçe desteği (public/fonts/ klasöründen yüklenir)
  const [regularB64, boldB64] = await Promise.all([
    loadFontBase64('NotoSans-Regular.ttf'),
    loadFontBase64('NotoSans-Bold.ttf'),
  ])

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  doc.addFileToVFS('NotoSans-Regular.ttf', regularB64)
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal')
  doc.addFileToVFS('NotoSans-Bold.ttf', boldB64)
  doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold')

  // Varsayılan fontu ayarla
  doc.setFont('NotoSans', 'normal')

  const W      = 210
  const pageH  = 297
  const margin = 18

  // Renkler
  const RED    : [number,number,number] = [220, 38, 38]
  const DARK   : [number,number,number] = [17, 17, 17]
  const CREAM  : [number,number,number] = [245, 240, 232]
  const GRAY   : [number,number,number] = [100, 100, 100]
  const LGRAY  : [number,number,number] = [160, 160, 160]
  const ORANGE : [number,number,number] = [249, 115, 22]
  const BLUE   : [number,number,number] = [59, 130, 246]

  /* ── Filigran ── */
  const drawWatermark = () => {
    doc.setFont('NotoSans', 'bold')
    doc.setFontSize(56)
    doc.setTextColor(17, 17, 17)
    // GState opacity API opsiyonel; varsa kullan
    try {
      const gs = new (doc as any).GState({ opacity: 0.04 })
      doc.saveGraphicsState?.()
      doc.setGState?.(gs)
    } catch { /* yok */ }
    const cx = W / 2, cy = pageH / 2
    doc.text('HAMZA', cx, cy - 12, { angle: 45, align: 'center' })
    doc.text('SIVRIKAYA', cx, cy + 12, { angle: 45, align: 'center' })
    try { doc.restoreGraphicsState?.() } catch { /* yok */ }
  }
  drawWatermark()

  /* ── Üst kırmızı şerit ── */
  doc.setFillColor(...RED)
  doc.rect(0, 0, W, 10, 'F')

  /* ── Header ── */
  doc.setFillColor(...DARK)
  doc.rect(0, 10, W, 40, 'F')

  doc.setFont('NotoSans', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...RED)
  doc.text('HAMZA SIVRIKAYA', margin, 28)

  doc.setFont('NotoSans', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...LGRAY)
  doc.text('KISISEL ANTRENOR  .  ANTALYA', margin, 35)

  doc.setFont('NotoSans', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...CREAM)
  doc.text('VUCUT OLCUM RAPORU', W - margin, 26, { align: 'right' })

  doc.setFont('NotoSans', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...LGRAY)
  doc.text(`Rapor tarihi: ${fmtLong(new Date().toISOString())}`, W - margin, 33, { align: 'right' })

  /* ── Üye bilgi kartı ── */
  let y = 60
  doc.setFillColor(26, 26, 26)
  doc.roundedRect(margin, y, W - margin * 2, 22, 3, 3, 'F')

  doc.setFont('NotoSans', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...CREAM)
  doc.text(member.full_name, margin + 6, y + 8)

  doc.setFont('NotoSans', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...LGRAY)
  doc.text(`E-posta: ${member.email}`, margin + 6, y + 15)
  if (member.phone) doc.text(`Tel: ${member.phone}`, margin + 90, y + 15)
  doc.text(`Uyelik: ${fmtLong(member.start_date)}`, W - margin - 6, y + 15, { align: 'right' })

  y += 32

  /* ── Son ölçüm özeti ── */
  const sorted = [...measurements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const latest = sorted[0]
  const first  = sorted[sorted.length - 1]

  if (latest) {
    doc.setFont('NotoSans', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...RED)
    doc.text('SON OLCUM OZETI', margin, y)
    doc.setDrawColor(...RED)
    doc.setLineWidth(0.5)
    doc.line(margin, y + 1, margin + 40, y + 1)
    y += 7

    const cards = [
      { label: 'Kilo',     value: latest.weight       ? `${latest.weight} kg`       : '-', color: CREAM  },
      { label: 'Yag %',    value: latest.body_fat_pct  ? `${latest.body_fat_pct}%`   : '-', color: ORANGE },
      { label: 'Kategori', value: latest.body_fat_pct  ? getCategory(Number(latest.body_fat_pct)) : '-', color: CREAM },
      { label: 'Gogus',    value: latest.chest         ? `${latest.chest} cm`        : '-', color: CREAM  },
      { label: 'Bel',      value: latest.waist         ? `${latest.waist} cm`        : '-', color: CREAM  },
      { label: 'Kol',      value: latest.arm           ? `${latest.arm} cm`          : '-', color: CREAM  },
    ]
    const cardW = (W - margin * 2 - 5 * 3) / 6
    cards.forEach((card, i) => {
      const cx = margin + i * (cardW + 3)
      doc.setFillColor(26, 26, 26)
      doc.roundedRect(cx, y, cardW, 20, 2, 2, 'F')
      doc.setFont('NotoSans', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(...card.color)
      doc.text(card.value, cx + cardW / 2, y + 9, { align: 'center' })
      doc.setFont('NotoSans', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(...LGRAY)
      doc.text(card.label, cx + cardW / 2, y + 16, { align: 'center' })
    })
    y += 28

    // Yağ/kas kütlesi + bar
    if (latest.body_fat_pct && latest.weight) {
      const fatKg  = (Number(latest.body_fat_pct) / 100) * Number(latest.weight)
      const leanKg = Number(latest.weight) - fatKg
      const fatPct = (fatKg / Number(latest.weight)) * 100

      doc.setFont('NotoSans', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...ORANGE)
      doc.text(`Yag kutlesi: ${fatKg.toFixed(1)} kg`, margin, y)
      doc.setTextColor(...BLUE)
      doc.text(`Kas kutlesi: ${leanKg.toFixed(1)} kg`, margin + 52, y)

      const barX = margin + 106
      const barW = W - margin - barX
      const fW   = (fatPct / 100) * barW
      doc.setFillColor(...ORANGE)
      doc.roundedRect(barX, y - 4, fW, 5, 1, 1, 'F')
      doc.setFillColor(...BLUE)
      doc.roundedRect(barX + fW, y - 4, barW - fW, 5, 1, 1, 'F')
      y += 10
    }

    // Skinfold
    if (latest.sf_chest || latest.sf_abdomen || latest.sf_thigh) {
      doc.setFont('NotoSans', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(245, 158, 11)
      const sfParts: string[] = []
      if (latest.sf_chest)   sfParts.push(`Gogus: ${latest.sf_chest} mm`)
      if (latest.sf_abdomen) sfParts.push(`Karin: ${latest.sf_abdomen} mm`)
      if (latest.sf_thigh)   sfParts.push(`Uyluk: ${latest.sf_thigh} mm`)
      if (latest.sf_chest && latest.sf_abdomen && latest.sf_thigh) {
        sfParts.push(`Toplam: ${Number(latest.sf_chest) + Number(latest.sf_abdomen) + Number(latest.sf_thigh)} mm`)
      }
      doc.text('Skinfold: ' + sfParts.join('   '), margin, y)
      y += 9
    }
  }

  /* ── Gelişim karşılaştırması ── */
  if (sorted.length >= 2) {
    doc.setFont('NotoSans', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...RED)
    doc.text('GELISIM KARSILASTIRMASI', margin, y + 4)
    doc.setDrawColor(...RED)
    doc.line(margin, y + 5, margin + 58, y + 5)
    y += 10

    const metrics: { key: keyof Measurement; label: string; unit: string; goodDown: boolean }[] = [
      { key: 'weight',       label: 'Kilo',  unit: 'kg', goodDown: true  },
      { key: 'body_fat_pct', label: 'Yag %', unit: '%',  goodDown: true  },
      { key: 'chest',        label: 'Gogus', unit: 'cm', goodDown: false },
      { key: 'waist',        label: 'Bel',   unit: 'cm', goodDown: true  },
      { key: 'arm',          label: 'Kol',   unit: 'cm', goodDown: false },
      { key: 'leg',          label: 'Bacak', unit: 'cm', goodDown: false },
    ]

    const compRows = metrics
      .filter((m) => first[m.key] != null && latest[m.key] != null)
      .map((m) => {
        const f  = Number(first[m.key])
        const l  = Number(latest[m.key])
        const d  = l - f
        const isGood = m.goodDown ? d < 0 : d > 0
        const sign   = d > 0 ? '+' : ''
        return [
          m.label,
          `${f} ${m.unit}`,
          `${l} ${m.unit}`,
          `${sign}${d.toFixed(1)} ${m.unit}`,
          d === 0 ? '-' : isGood ? 'Iyi' : 'Kotu',
        ]
      })

    autoTable(doc, {
      startY: y,
      head: [[
        'Olcum',
        `Ilk (${fmtShort(first.date)})`,
        `Son (${fmtShort(latest.date)})`,
        'Degisim',
        'Durum',
      ]],
      body: compRows,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: DARK, textColor: CREAM, fontSize: 8, fontStyle: 'bold', font: 'NotoSans' },
      bodyStyles: { fontSize: 8, textColor: [200, 200, 200], font: 'NotoSans' },
      alternateRowStyles: { fillColor: [22, 22, 22] },
      styles: { fillColor: [17, 17, 17], lineColor: [40, 40, 40], lineWidth: 0.3, font: 'NotoSans' },
      columnStyles: { 3: { fontStyle: 'bold' }, 4: { halign: 'center', fontStyle: 'bold' } },
      didParseCell: (data) => {
        if (data.column.index === 4 && data.section === 'body') {
          if (data.cell.text[0] === 'Iyi')  data.cell.styles.textColor = [34, 197, 94]
          if (data.cell.text[0] === 'Kotu') data.cell.styles.textColor = [239, 68, 68]
        }
      },
    })
    y = (doc as any).lastAutoTable.finalY + 12
  }

  /* ── Ölçüm geçmişi ── */
  doc.setFont('NotoSans', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...RED)
  doc.text('OLCUM GECMISI', margin, y)
  doc.setDrawColor(...RED)
  doc.line(margin, y + 1, margin + 36, y + 1)
  y += 6

  const histRows = sorted.map((m) => [
    fmtShort(m.date),
    m.weight        ? `${m.weight} kg`         : '-',
    m.body_fat_pct  ? `${m.body_fat_pct}%`     : '-',
    m.chest         ? `${m.chest} cm`           : '-',
    m.waist         ? `${m.waist} cm`           : '-',
    m.arm           ? `${m.arm} cm`             : '-',
    m.leg           ? `${m.leg} cm`             : '-',
    (m.sf_chest && m.sf_abdomen && m.sf_thigh)
      ? `${Number(m.sf_chest) + Number(m.sf_abdomen) + Number(m.sf_thigh)}`
      : '-',
  ])

  autoTable(doc, {
    startY: y,
    head: [['Tarih', 'Kilo', 'Yag %', 'Gogus', 'Bel', 'Kol', 'Bacak', 'SF Top.']],
    body: histRows,
    margin: { left: margin, right: margin },
    headStyles: { fillColor: DARK, textColor: CREAM, fontSize: 7.5, fontStyle: 'bold', font: 'NotoSans' },
    bodyStyles: { fontSize: 7.5, textColor: [200, 200, 200], font: 'NotoSans' },
    alternateRowStyles: { fillColor: [22, 22, 22] },
    styles: { fillColor: [17, 17, 17], lineColor: [40, 40, 40], lineWidth: 0.3, font: 'NotoSans' },
    columnStyles: { 2: { textColor: [249, 115, 22], fontStyle: 'bold' } },
  })

  /* ── Footer (her sayfa) ── */
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFillColor(...DARK)
    doc.rect(0, pageH - 12, W, 12, 'F')
    doc.setFont('NotoSans', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.text('hamzasivrikaya.com  .  0545 681 4776  .  @hamzasivrikayaa', margin, pageH - 4.5)
    doc.text(`${i} / ${pageCount}`, W - margin, pageH - 4.5, { align: 'right' })
  }

  /* ── İndir ── */
  const safeName = member.full_name.replace(/\s+/g, '-').toLowerCase()
  doc.save(`olcum-raporu-${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`)
}
