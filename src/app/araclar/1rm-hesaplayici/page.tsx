import Link from 'next/link'
import OneRMCalculator from '@/components/shared/OneRMCalculator'

export const metadata = {
  title: '1RM Hesaplayıcı — Maksimum Kaldırma Ağırlığı | Hamza Sivrikaya',
  description: 'Ücretsiz 1RM hesaplayıcı. Kaldırdığınız ağırlık ve tekrar sayısından tahmini maksimum ağırlığınızı öğrenin. Epley ve Brzycki formülleri.',
  openGraph: {
    title: '1RM Hesaplayıcı | Hamza Sivrikaya',
    description: 'Tahmini maksimum kaldırma ağırlığınızı ve antrenman yüzdelik tablonuzu hesaplayın. Ücretsiz.',
    siteName: 'Hamza Sivrikaya',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '1RM Hesaplayıcı',
    description: 'Tahmini maksimum kaldırma ağırlığınızı hesaplayın.',
  },
}

export default function OneRMPage() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0505] via-background to-[#05050a]" />
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]" />

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
          <span className="text-text-primary">1RM Hesaplayıcı</span>
        </div>

        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider">
            <span className="text-primary">1RM</span> HESAPLAYICI
          </h1>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
            Bir harekette belirli ağırlıkla kaç tekrar yaptığınızı girin, tahmini maksimum kaldırma ağırlığınızı ve yüzdelik tablonuzu görün.
          </p>
        </div>

        <div className="animate-fade-up delay-200">
          <OneRMCalculator />
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-16 animate-fade-up delay-400">
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Epley Formülü</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              1RM = Ağırlık × (1 + Tekrar / 30). Yüksek tekrar sayılarında daha doğru sonuç verir.
            </p>
          </div>
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Brzycki Formülü</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              1RM = Ağırlık × 36 / (37 - Tekrar). Düşük tekrar sayılarında (1-10) daha güvenilir sonuçlar.
            </p>
          </div>
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Yüzdelik Tablo</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              1RM'nizin yüzdelerine göre antrenman ağırlıklarınızı planlayın. Güç, hipertrofi ve dayanıklılık bölgeleri.
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
