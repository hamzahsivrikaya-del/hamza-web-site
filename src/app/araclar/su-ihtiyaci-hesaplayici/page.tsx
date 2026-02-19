import Link from 'next/link'
import WaterCalculator from '@/components/shared/WaterCalculator'

export const metadata = {
  title: 'Su İhtiyacı Hesaplayıcı — Günlük Su Miktarı | Hamza Sivrikaya',
  description: 'Ücretsiz su ihtiyacı hesaplayıcı. Kilonuz ve aktivite seviyenize göre günlük içmeniz gereken su miktarını öğrenin.',
  openGraph: {
    title: 'Su İhtiyacı Hesaplayıcı | Hamza Sivrikaya',
    description: 'Kilonuz ve aktivite seviyenize göre günlük su ihtiyacınızı ve içme programınızı hesaplayın. Ücretsiz.',
    siteName: 'Hamza Sivrikaya',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Su İhtiyacı Hesaplayıcı',
    description: 'Günlük su ihtiyacınızı ve içme programınızı hesaplayın.',
  },
}

export default function WaterPage() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0505] via-background to-[#050508]" />
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[120px]" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />

      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-wider text-primary">HAMZA SİVRİKAYA</Link>
          <Link href="/" className="text-sm px-4 py-2 bg-white/5 border border-border text-text-secondary rounded-lg hover:bg-white/10 transition-colors press-effect">Ana Sayfa</Link>
        </div>
      </nav>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-8 animate-fade-up">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/#hesaplayicilar" className="hover:text-primary transition-colors">Hesaplayıcılar</Link>
          <span>/</span>
          <span className="text-text-primary">Su İhtiyacı Hesaplayıcı</span>
        </div>

        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider">
            SU <span className="text-blue-400">İHTİYACI</span> HESAPLAYICI
          </h1>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
            Kilonuz ve aktivite seviyenize göre günlük su ihtiyacınızı hesaplayın. Gün boyunca ne zaman, ne kadar su içmeniz gerektiğini öğrenin.
          </p>
        </div>

        <div className="animate-fade-up delay-200">
          <WaterCalculator />
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-16 animate-fade-up delay-400">
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-2">Neden Su Önemli?</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Vücudumuzun %60-70'i sudan oluşur. Kas performansı, metabolizma, sindirim ve beyin fonksiyonları için yeterli su tüketimi kritiktir.
            </p>
          </div>
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-2">Antrenman ve Su</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Egzersiz sırasında vücut saatte 0.5-2 litre su kaybedebilir. %2 dehidrasyon bile performansı %10-20 düşürebilir.
            </p>
          </div>
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-2">İpuçları</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Sabah kalkar kalkmaz 1 bardak su için. Antrenman öncesi ve sonrası mutlaka su tüketin. İdrar renginiz açık sarı olmalı.
            </p>
          </div>
        </div>

      </div>

      <footer className="relative py-8 px-4 border-t border-primary/15 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-secondary">© 2026 Hamza Sivrikaya. Tüm hakları saklıdır.</div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Ana Sayfa</Link>
            <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
