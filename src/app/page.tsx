import Link from 'next/link'
import LandingNavbar from '@/components/shared/LandingNavbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]" style={{ fontFamily: 'var(--font-oswald), sans-serif' }}>
      <LandingNavbar />

      {/* ==================== HERO (Image right + Text left) ==================== */}
      <section id="hakkimda" className="relative min-h-screen flex items-center overflow-hidden bg-[#1A1A1A]">
        {/* Image — right side on desktop, full background on mobile */}
        <div className="absolute inset-0 md:left-[40%]">
          <img
            src="/images/hamza-about.jpg"
            alt="Hamza Sivrikaya - Kişisel Antrenör"
            className="w-full h-full object-cover object-top"
          />
          {/* Gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent md:bg-gradient-to-r md:from-[#1A1A1A] md:via-[#1A1A1A]/80 md:to-transparent" />
          <div className="absolute inset-0 bg-[#1A1A1A]/40 md:bg-transparent" />
        </div>

        {/* Content — left side */}
        <div className="relative w-full max-w-6xl mx-auto px-4 pt-28 pb-16 sm:pt-32 sm:pb-20">
          <div className="max-w-xl">
            {/* Label */}
            <p className="text-xs uppercase tracking-[0.35em] text-white/50 font-medium mb-5 animate-fade-up">
              Kişisel Antrenör · Antalya
            </p>

            {/* Main heading — HWPO-style massive bold */}
            <h1 className="font-display text-5xl sm:text-7xl md:text-7xl lg:text-8xl tracking-wide leading-[0.9] text-white mb-5 animate-fade-up delay-100">
              DAHA GÜÇLÜ<br />
              <span className="text-primary">BİR SEN</span><br />İNŞA ET
            </h1>

            {/* Italic subheading — editorial contrast */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/65 leading-snug mb-6 animate-fade-up delay-200" style={{ fontFamily: 'var(--font-lora), serif', fontStyle: 'italic' }}>
              Sağlığını, özgüvenini ve devamlılığını destekleyen antrenman — 2026 ve sonrası için.
            </p>

            {/* Short about */}
            <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-8 animate-fade-up delay-300">
              Kişiye özel programlar, doğru teknik ve sürekli takiple hedefinize ulaşmanız için
              yanınızdayım. İster yeni başlayın, ister seviyenizi yükseltin — bulunduğunuz
              yerden başlıyoruz.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up delay-400">
              <a href="#iletisim" className="w-full sm:w-auto text-center px-8 py-4 sm:py-3.5 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary-hover transition-all press-effect">
                Ücretsiz Görüşme
              </a>
              <a href="#hizmetler" className="w-full sm:w-auto text-center px-8 py-4 sm:py-3.5 border border-white/20 text-white/70 text-sm font-bold uppercase tracking-widest hover:border-white/50 hover:text-white transition-all press-effect">
                Hizmetleri Gör
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ACCENT STRIP ==================== */}
      <div className="bg-primary py-4 overflow-hidden">
        <div className="flex items-center justify-center gap-4 sm:gap-8 font-display text-sm sm:text-base md:text-lg tracking-[0.25em] text-white whitespace-nowrap">
          <span>HEDEF BELİRLE</span>
          <span className="text-white/40">·</span>
          <span>ÇALIŞ</span>
          <span className="text-white/40">·</span>
          <span>SONUÇ AL</span>
          <span className="text-white/40">·</span>
          <span>TEKRAR ET</span>
        </div>
      </div>

      {/* ==================== SERVICES (Photo collage background) ==================== */}
      <section id="hizmetler" className="relative py-20 sm:py-28 px-4 overflow-hidden">
        {/* 3 photos side by side as background collage */}
        <div className="absolute inset-0 grid grid-cols-3">
          <div className="relative overflow-hidden">
            <img src="/images/hamza-running.jpg" alt="" className="w-full h-full object-cover object-center" />
          </div>
          <div className="relative overflow-hidden">
            <img src="/images/hamza-hyrox.jpg" alt="" className="w-full h-full object-cover object-top" />
          </div>
          <div className="relative overflow-hidden">
            <img src="/images/hamza-gym.jpg" alt="" className="w-full h-full object-cover object-center" />
          </div>
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4">Neler Sunuyorum</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider text-white">HİZMETLER</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Birebir Antrenman */}
            <div className="group bg-black/50 backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-black/60 hover:border-white/20 animate-fade-up delay-100 cursor-default">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Birebir Antrenman</h3>
                  <p className="text-sm text-white/45 leading-relaxed">Tamamen size özel tasarlanmış antrenman programları. Tek odak noktam sizin hedefiniz.</p>
                </div>
              </div>
            </div>

            {/* CrossFit */}
            <div className="group bg-black/50 backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-black/60 hover:border-white/20 animate-fade-up delay-200 cursor-default">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">CrossFit & HYROX</h3>
                  <p className="text-sm text-white/45 leading-relaxed">Doğru teknik, güvenli ilerleme. Olimpik kaldırışlardan jimnastiğe, seviyenize uygun CrossFit.</p>
                </div>
              </div>
            </div>

            {/* Beslenme */}
            <div className="group bg-black/50 backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-black/60 hover:border-white/20 animate-fade-up delay-300 cursor-default">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Beslenme Danışmanlığı</h3>
                  <p className="text-sm text-white/45 leading-relaxed">Hedeflerinize uygun, sürdürülebilir ve yaşam tarzınıza entegre beslenme planları.</p>
                </div>
              </div>
            </div>

            {/* Ölçüm & Takip */}
            <div className="group bg-black/50 backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-black/60 hover:border-white/20 animate-fade-up delay-400 cursor-default">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Ölçüm & Takip</h3>
                  <p className="text-sm text-white/45 leading-relaxed">Düzenli vücut analizleri ve ilerleme raporlarıyla nerede olduğunuzu her zaman bilin.</p>
                </div>
              </div>
            </div>

            {/* Atletik Performans */}
            <div className="group bg-black/50 backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-black/60 hover:border-white/20 animate-fade-up delay-500 cursor-default">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Atletik Performans Koçluğu</h3>
                  <p className="text-sm text-white/45 leading-relaxed">Hız, çeviklik ve patlayıcı güç odaklı programlarla performansınızı bir üst seviyeye taşıyın.</p>
                </div>
              </div>
            </div>

            {/* Online Program */}
            <div className="group bg-black/50 backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-black/60 hover:border-white/20 animate-fade-up delay-600 cursor-default">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Online Program</h3>
                  <p className="text-sm text-white/45 leading-relaxed">Nerede olursanız olun, size özel hazırlanan haftalık program ve takiple antrenmanınızı sürdürün.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DIVIDER ==================== */}
      <div className="bg-[#F5F5F5] py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl tracking-wider text-[#1A1A1A]">
            SADECE ANTRENMAN DEĞİL,<br /><span className="text-primary">YAŞAM TARZI</span>
          </p>
        </div>
      </div>

      {/* ==================== FREE TRAINING (Split layout — image left, text right) ==================== */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center overflow-hidden bg-[#1A1A1A]">
        {/* Image — right side on desktop, full background on mobile */}
        <div className="absolute inset-0 md:left-[45%]">
          <img
            src="/images/hamza-rope.jpg"
            alt="Hamza Sivrikaya ip tırmanışı"
            className="w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent md:bg-gradient-to-r md:from-[#1A1A1A] md:via-[#1A1A1A]/80 md:to-transparent" />
          <div className="absolute inset-0 bg-[#1A1A1A]/50 md:bg-transparent" />
        </div>

        {/* Content — left side */}
        <div className="relative w-full max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="md:max-w-[50%]">
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold mb-5 animate-fade-up">
              Ücretsiz · Her Hafta Güncellenir
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wider text-white leading-[0.95] mb-6 animate-fade-up delay-100">
              FORMDA KALMANIN<br /><span className="text-primary">BEDELİ YOK</span>
            </h2>
            <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-5 animate-fade-up delay-200">
              Her pazartesi yepyeni bir program. Yapılandırılmış, detaylı set ve tekrar bilgileriyle
              hazırlanmış haftalık antrenmanlarla kendi hızında ilerle.
            </p>
            <p className="text-white/35 text-sm leading-relaxed mb-10 animate-fade-up delay-300" style={{ fontFamily: 'var(--font-lora), serif', fontStyle: 'italic' }}>
              &ldquo;Başlamak için mükemmel zamanı bekleme. Bugün başla, yarın daha güçlü ol.&rdquo;
            </p>
            <Link href="/antrenmanlar" className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary-hover transition-all press-effect animate-fade-up delay-400">
              Programa Git
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CALCULATORS ==================== */}
      <section className="relative py-20 sm:py-28 px-4 bg-[#2A2A2A] overflow-hidden">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4">Ücretsiz Araçlar</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider text-white">HESAPLAYICILAR</h2>
            <p className="text-white/35 mt-4 max-w-lg mx-auto">Fitness yolculuğunda sana yardımcı olacak ücretsiz araçlar</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/araclar/kalori-hesaplayici" className="group bg-[#1F1F1F] border border-[#383838] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-[#4A4A4A] hover:bg-[#242424] animate-fade-up delay-100">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 bg-white/8 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm group-hover:text-white/90 transition-colors">Kalori & Makro</h3>
                  <p className="text-xs text-white/35 mt-1">Günlük kalori ve makro ihtiyacını hesapla</p>
                </div>
              </div>
            </Link>

            <Link href="/araclar/1rm-hesaplayici" className="group bg-[#1F1F1F] border border-[#383838] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-[#4A4A4A] hover:bg-[#242424] animate-fade-up delay-200">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 bg-white/8 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm group-hover:text-white/90 transition-colors">1RM Hesaplayıcı</h3>
                  <p className="text-xs text-white/35 mt-1">Maksimum kaldırma ağırlığını öğren</p>
                </div>
              </div>
            </Link>

            <Link href="/araclar/bki-hesaplayici" className="group bg-[#1F1F1F] border border-[#383838] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-[#4A4A4A] hover:bg-[#242424] animate-fade-up delay-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 bg-white/8 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm group-hover:text-white/90 transition-colors">BMI Hesaplayıcı</h3>
                  <p className="text-xs text-white/35 mt-1">Vücut Kitle İndeksini hesapla</p>
                </div>
              </div>
            </Link>

            <Link href="/araclar/su-ihtiyaci-hesaplayici" className="group bg-[#1F1F1F] border border-[#383838] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-[#4A4A4A] hover:bg-[#242424] animate-fade-up delay-400">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 bg-white/8 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm group-hover:text-white/90 transition-colors">Su İhtiyacı</h3>
                  <p className="text-xs text-white/35 mt-1">Günlük su ihtiyacını hesapla</p>
                </div>
              </div>
            </Link>

            <Link href="/araclar/ideal-kilo-hesaplayici" className="group bg-[#1F1F1F] border border-[#383838] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-[#4A4A4A] hover:bg-[#242424] animate-fade-up delay-500">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 bg-white/8 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm group-hover:text-white/90 transition-colors">İdeal Kilo</h3>
                  <p className="text-xs text-white/35 mt-1">4 bilimsel formülle ideal kilonu öğren</p>
                </div>
              </div>
            </Link>

            <Link href="/araclar/deri-kaliper-hesaplayici" className="group bg-[#1F1F1F] border border-[#383838] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-[#4A4A4A] hover:bg-[#242424] animate-fade-up delay-600">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 bg-white/8 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm group-hover:text-white/90 transition-colors">Deri Kaliper</h3>
                  <p className="text-xs text-white/35 mt-1">Skinfold ölçümleriyle yağ oranını hesapla</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-8 text-center animate-fade-up delay-700">
            <Link href="/araclar" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold uppercase tracking-wider">
              Tüm Araçları Gör
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== BLOG ==================== */}
      <section className="relative py-20 sm:py-28 px-4 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4">Daha Fazlası</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider text-[#1A1A1A]">BLOG</h2>
          </div>
          <div className="max-w-md mx-auto">
            <Link href="/blog" className="group bg-white border-2 border-[#E5E5E5] p-8 text-center block transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-[#CCC] animate-fade-up delay-100">
              <div className="w-14 h-14 bg-[#F0F0F0] flex items-center justify-center mx-auto mb-5 group-hover:bg-[#E8E8E8] transition-colors">
                <svg className="w-7 h-7 text-[#57534E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-1 text-[#1A1A1A]">Fitness & Sağlık Yazıları</h3>
              <p className="text-sm text-[#57534E]">Antrenman teknikleri, beslenme ve sağlıklı yaşam hakkında yazılar</p>
              <div className="mt-4 text-sm text-primary font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                Yazıları Oku
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CONTACT ==================== */}
      <section id="iletisim" className="relative py-20 sm:py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4">Hemen Ulaşın</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider text-[#1A1A1A]">İLETİŞİM</h2>
            <p className="text-[#57534E] mt-4">Ücretsiz ön görüşme için hemen ulaşın</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <a href="https://wa.me/905456814776" target="_blank" rel="noopener noreferrer" className="group bg-[#FAFAFA] border-2 border-[#E5E5E5] p-8 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-[#CCC] animate-fade-up delay-100">
              <div className="w-12 h-12 bg-green-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </div>
              <h3 className="font-bold text-[#1A1A1A] mb-1">WhatsApp</h3>
              <p className="text-sm text-[#57534E]">0545 681 4776</p>
            </a>
            <a href="https://instagram.com/hamzasivrikayaa" target="_blank" rel="noopener noreferrer" className="group bg-[#FAFAFA] border-2 border-[#E5E5E5] p-8 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-[#CCC] animate-fade-up delay-200">
              <div className="w-12 h-12 bg-pink-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-500/20 transition-colors">
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </div>
              <h3 className="font-bold text-[#1A1A1A] mb-1">Instagram</h3>
              <p className="text-sm text-[#57534E]">@hamzasivrikayaa</p>
            </a>
            <a href="tel:+905456814776" className="group bg-[#FAFAFA] border-2 border-[#E5E5E5] p-8 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-[#CCC] animate-fade-up delay-300">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <h3 className="font-bold text-[#1A1A1A] mb-1">Telefon</h3>
              <p className="text-sm text-[#57534E]">0545 681 4776</p>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-8 px-4 border-t border-[#E5E5E5] bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#57534E]">© 2026 Hamza Sivrikaya. Tüm hakları saklıdır.</div>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-[#57534E] hover:text-[#1A1A1A] transition-colors">Blog</Link>
            <Link href="/login" className="text-sm text-[#57534E] hover:text-[#1A1A1A] transition-colors">Üye Girişi</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
