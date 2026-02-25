import Link from 'next/link'
import LandingNavbar from '@/components/shared/LandingNavbar'
import NavyBodyFatCalculator from '@/components/shared/NavyBodyFatCalculator'

export const metadata = {
  title: 'Vücut Yağ Oranı Hesaplayıcı — U.S. Navy Metodu | Hamza Sivrikaya',
  description: 'Ücretsiz vücut yağ oranı hesaplayıcı. Kaliper gerektirmez — sadece mezura ile boyun, bel ve kalça ölçümlerinizi girerek yağ yüzdenizi hesaplayın.',
}

export default function VucutYagPage() {
  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      <LandingNavbar />

      <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-12">
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-8 animate-fade-up">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:text-primary transition-colors">Hesaplayıcılar</Link>
          <span>/</span>
          <span className="text-text-primary">Vücut Yağ Hesaplayıcı</span>
        </div>

        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider">
            <span className="text-primary">VÜCUT</span> YAĞ ORANI
          </h1>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
            Kaliper cihazı gerektirmeyen U.S. Navy yöntemiyle vücut yağ yüzdenizi hesaplayın. Tek ihtiyacınız bir mezura.
          </p>
        </div>

        <div className="animate-fade-up delay-200">
          <NavyBodyFatCalculator />
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-16 animate-fade-up delay-400">
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-2">U.S. Navy Metodu Nedir?</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              ABD Donanması tarafından geliştirilen bu yöntem, boyun, bel ve kalça çevre ölçümlerini kullanarak vücut yağ oranını tahmin eder. Kaliper veya özel cihaz gerektirmez — sadece bir mezura yeterlidir. Erkeklerde boyun ve bel, kadınlarda boyun, bel ve kalça ölçümleri kullanılır.
            </p>
          </div>
          <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-2">Doğru Ölçüm İçin</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong>Boyun:</strong> Adem elmasının hemen altından yatay ölçün. <strong>Bel:</strong> Göbek hizasından, nefes verirken ölçün. <strong>Kalça:</strong> En geniş noktadan yatay ölçün. Mezurayı sıkmadan, ciltte düz tutarak ölçüm yapın.
            </p>
          </div>
        </div>

        {/* Skinfold vs Navy karşılaştırma */}
        <div className="mt-8 bg-surface/60 backdrop-blur-sm rounded-xl border border-border p-6 animate-fade-up delay-500">
          <h3 className="font-semibold mb-3">Skinfold Kaliper vs U.S. Navy — Hangisini Kullanmalıyım?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4">
              <p className="text-sm font-medium text-text-primary mb-1">Skinfold Kaliper</p>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>+ Daha hassas sonuç</li>
                <li>+ Bölgesel yağ dağılımı bilgisi</li>
                <li>- Kaliper cihazı gerektirir</li>
                <li>- Doğru ölçüm deneyim ister</li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-sm font-medium text-text-primary mb-1">U.S. Navy Metodu</p>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>+ Sadece mezura yeterli</li>
                <li>+ Herkes kolayca yapabilir</li>
                <li>+ İlerleme takibi için ideal</li>
                <li>- Kalipere göre daha az hassas</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-3">
            Kaliper cihazınız varsa <Link href="/araclar/deri-kaliper-hesaplayici" className="text-primary hover:underline">Skinfold Hesaplayıcı</Link>'yı kullanabilirsiniz.
          </p>
        </div>
      </div>

      <footer className="relative py-8 px-4 border-t border-border mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-secondary">&copy; 2026 Hamza Sivrikaya. Tüm hakları saklıdır.</div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Ana Sayfa</Link>
            <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
