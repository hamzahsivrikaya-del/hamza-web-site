import { ImageResponse } from 'next/og'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: report } = await admin
    .from('weekly_reports')
    .select('*, users(full_name)')
    .eq('id', id)
    .single()

  if (!report) {
    return new Response('Rapor bulunamadı', { status: 404 })
  }

  const userName = (report.users as unknown as { full_name: string })?.full_name || 'Üye'
  const firstName = userName.split(' ')[0]
  const weekLabel = `${formatShortDate(report.week_start)} – ${formatShortDate(report.week_end)}`
  const showStreak = (report.consecutive_weeks ?? 0) >= 2
  const title = `${firstName}'in Haftalık Özeti`

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '72px 90px 64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Üst kırmızı şerit */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: '#DC2626', display: 'flex' }} />

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', fontSize: '30px', fontWeight: 900, color: '#DC2626', letterSpacing: '5px', textTransform: 'uppercase' }}>
            HAMZA SİVRİKAYA
          </div>
          <div style={{ display: 'flex', fontSize: '15px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase' }}>
            Kişisel Antrenör
          </div>
        </div>

        {/* Orta içerik */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '52px', width: '100%' }}>
          <div style={{ display: 'flex', fontSize: '44px', fontWeight: 700, color: '#F5F0E8', letterSpacing: '-1px' }}>
            {title}
          </div>

          {/* İstatistikler */}
          <div style={{ display: 'flex', gap: '64px', alignItems: 'center' }}>
            {/* Ders */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', fontSize: '104px', fontWeight: 900, color: '#DC2626', lineHeight: '1' }}>
                {String(report.lessons_count)}
              </div>
              <div style={{ display: 'flex', fontSize: '18px', color: '#666', textTransform: 'uppercase', letterSpacing: '3px' }}>
                DERS
              </div>
            </div>

            <div style={{ display: 'flex', width: '2px', height: '130px', backgroundColor: '#1E1E1E' }} />

            {/* Saat */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', fontSize: '104px', fontWeight: 900, color: '#F5F0E8', lineHeight: '1' }}>
                {String(report.total_hours)}
              </div>
              <div style={{ display: 'flex', fontSize: '18px', color: '#666', textTransform: 'uppercase', letterSpacing: '3px' }}>
                SAAT
              </div>
            </div>

            {/* Streak - fragment yerine koşullu tek div */}
            {showStreak ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '64px' }}>
                <div style={{ display: 'flex', width: '2px', height: '130px', backgroundColor: '#1E1E1E' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', fontSize: '104px', fontWeight: 900, color: '#F59E0B', lineHeight: '1' }}>
                    {String(report.consecutive_weeks)}
                  </div>
                  <div style={{ display: 'flex', fontSize: '18px', color: '#666', textTransform: 'uppercase', letterSpacing: '3px' }}>
                    HAFTA SERİ
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Motivasyon mesajı */}
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              color: '#F5F0E8',
              textAlign: 'center',
              maxWidth: '820px',
              lineHeight: '1.55',
              backgroundColor: '#141414',
              padding: '36px 52px',
              borderRadius: '16px',
              borderLeftWidth: '5px',
              borderLeftStyle: 'solid',
              borderLeftColor: '#DC2626',
            }}
          >
            {report.message}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', fontSize: '18px', color: '#333' }}>
            {weekLabel}
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: '#DC2626', fontWeight: 700, letterSpacing: '1px' }}>
            @hamzasivrikayaa
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  )
}
