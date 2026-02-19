import Link from 'next/link'
import SkinfoldCalculator from '@/components/shared/SkinfoldCalculator'

export const metadata = {
  title: 'Dericaltı Yağ Hesaplayıcı — Vücut Yağ Oranı | Hamza Sivrikaya',
  description: 'Ücretsiz dericaltı yağ hesaplayıcı. Jackson & Pollock 3 nokta yöntemiyle vücut yağ yüzdenizi ve yağsız vücut kütlenizi hesaplayın.',
}

export default function DeriKaliperPage() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0505] via-background to-[#05050a]" />
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />

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
          <span className="text-text-primary">Dericaltı Yağ Hesaplayıcı</span>
        </div>

        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider">
            <span className="text-primary">DERİCALTI</span> YAĞ
          </h1>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
            Jackson & Pollock 3 nokta kaliper yöntemiyle vücut yağ yüzdenizi, yağ kitlenizi ve yağsız vücut ağırlığınızı hesaplayın.
          </p>
        </div>

        <div className="animate-fade-up delay-200">
          <SkinfoldCalculator />
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-16 animate-fade-up delay-400">
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-2">Jackson & Pollock Yöntemi Nedir?</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              1978 yılında geliştirilen bu yöntem, belirli bölgelerdeki deri kıvrımı kalınlığını ölçerek vücut yoğunluğunu tahmin eder. Erkekler için göğüs, karın ve uyluk; kadınlar için triseps, suprailiak ve uyluk bölgeleri kullanılır.
            </p>
          </div>
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-2">Doğru Ölçüm İçin</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Kaliper ölçümlerinin doğru yapılması sonucun güvenilirliğini doğrudan etkiler. Her bölgeyi 2-3 kez ölçüp ortalamasını alın. Ölçümleri sabah, egzersiz öncesinde ve tok karnına yapmayın.
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
