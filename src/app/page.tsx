import Link from 'next/link'
import AnimatedCounter from '@/components/shared/AnimatedCounter'
import LandingNavbar from '@/components/shared/LandingNavbar'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Gradient arka plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a0000] via-[#120808] to-[#0a0505]" />

        {/* Glow'lar */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-primary/12 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/8 rounded-full blur-[80px]" />

        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 60" stroke="#DC2626" strokeWidth="0.8" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* Açılı şeritler */}
        <div className="absolute -top-10 -right-10 w-[600px] h-[250px] bg-gradient-to-r from-primary/20 via-orange-600/10 to-transparent rotate-[25deg] blur-sm" />
        <div className="absolute top-40 -left-20 w-[500px] h-[180px] bg-gradient-to-r from-transparent via-primary/15 to-orange-500/10 -rotate-[15deg] blur-sm" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[150px] bg-gradient-to-l from-primary/15 via-red-500/10 to-transparent rotate-[35deg] blur-sm" />

        {/* Floating spor ikonları */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.07]">
          <svg className="absolute top-20 left-[10%] w-24 h-24 text-primary rotate-[-20deg] animate-float" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
          <svg className="absolute top-32 right-[15%] w-20 h-20 text-primary rotate-[10deg] animate-float delay-200" style={{ animationDelay: '1s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
          </svg>
          <svg className="absolute bottom-20 left-[20%] w-16 h-16 text-primary rotate-[15deg] animate-float" style={{ animationDelay: '2s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg className="absolute bottom-40 right-[25%] w-18 h-18 text-primary -rotate-[25deg] animate-float" style={{ animationDelay: '3s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
          </svg>
          <svg className="absolute top-[60%] left-[5%] w-14 h-14 text-primary rotate-[5deg] animate-float" style={{ animationDelay: '4s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
        </div>

        {/* Hero İçerik */}
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-6"></div>
          <h1 className="animate-fade-up">
            <span className="font-display text-6xl sm:text-7xl md:text-9xl tracking-wider block text-text-primary">HAMZA</span>
            <span className="font-display text-5xl sm:text-6xl md:text-8xl tracking-wider block text-gradient">SİVRİKAYA</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary mt-5 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-200">
            Hedefinize ulaşmanız için yanınızdayım. Birebir antrenman programları,
            beslenme danışmanlığı ve sürekli takip ile sonuca odaklı çalışıyoruz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-up delay-400">
            <a
              href="#iletisim"
              className="px-8 py-3.5 bg-primary text-white rounded-lg text-lg font-medium hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/25 press-effect"
            >
              İletişime Geç
            </a>
            <a
              href="#hizmetler"
              className="px-8 py-3.5 bg-white/5 border border-white/10 text-text-primary rounded-lg text-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm press-effect"
            >
              Hizmetleri Gör
            </a>
          </div>
        </div>
      </section>

      {/* Rakamlar — Counter animasyonu */}
      <section className="relative py-16 border-y border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        <div className="relative max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-up">
            <div className="font-display text-5xl sm:text-6xl text-primary">
              <AnimatedCounter end={5} suffix="+" />
            </div>
            <div className="text-sm text-text-secondary mt-1">Yıl Deneyim</div>
          </div>
          <div className="animate-fade-up delay-100">
            <div className="font-display text-5xl sm:text-6xl text-primary">
              <AnimatedCounter end={100} suffix="+" />
            </div>
            <div className="text-sm text-text-secondary mt-1">Mutlu Üye</div>
          </div>
          <div className="animate-fade-up delay-200">
            <div className="font-display text-5xl sm:text-6xl text-primary">
              <AnimatedCounter end={1000} suffix="+" />
            </div>
            <div className="text-sm text-text-secondary mt-1">Tamamlanan Ders</div>
          </div>
          <div className="animate-fade-up delay-300">
            <div className="font-display text-5xl sm:text-6xl text-primary">
              <AnimatedCounter end={95} prefix="%" />
            </div>
            <div className="text-sm text-text-secondary mt-1">Memnuniyet</div>
          </div>
        </div>
      </section>

      {/* Hakkımda */}
      <section id="hakkimda" className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-[150px]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Fotoğraf alanı */}
            <div className="relative animate-fade-up">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-2xl blur-sm" />
              <div className="relative aspect-[4/5] bg-surface rounded-2xl border border-border flex items-center justify-center">
                <div className="text-center text-text-secondary">
                  <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm">Fotoğraf eklenecek</p>
                </div>
              </div>
            </div>
            {/* Metin */}
            <div className="animate-fade-up delay-200">
              <h2 className="font-display text-4xl sm:text-5xl tracking-wider mb-6">
                BEN <span className="text-primary">HAMZA</span>
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Antalya&apos;da sertifikalı kişisel antrenör olarak fitness, fonksiyonel
                  antrenman ve atletik performans alanlarında 5 yılı aşkın deneyimle
                  hizmet veriyorum. CrossFit metodolojisini de bilen biri olarak her
                  seviyeye uygun antrenman tasarlıyorum.
                </p>
                <p>
                  Spor benim için hep bir araç oldu — sadece daha iyi görünmek için değil,
                  daha güçlü, daha dayanıklı ve yaşama daha hazır olmak için. Halter,
                  jimnastik, dayanıklılık antrenmanları ve fonksiyonel hareketlerle
                  çalışırken antrenmanın ne kadar kişisel ve dönüştürücü olabileceğini
                  bizzat yaşadım; şimdi aynı dönüşümü sizinle yaşatmak istiyorum.
                </p>
                <p>
                  Her üyemi dinleyerek başlıyorum. Hedef ne olursa olsun — güç kazanmak,
                  yağ yakmak ya da performansını üst seviyeye taşımak — kişiye özel program,
                  düzenli ölçüm takibi ve dürüst geri bildirimle ilerliyoruz. Burada kısa
                  vadeli sonuçlar değil, kalıcı alışkanlıklar inşa ediyoruz.
                </p>
              </div>
              <a
                href="#iletisim"
                className="inline-block mt-8 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/25 press-effect"
              >
                Benimle Çalış
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hizmetler */}
      <section id="hizmetler" className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0505] via-[#150810] to-[#0f0a15]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/8 rounded-full blur-[100px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="service-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#DC2626" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#service-pattern)" />
        </svg>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="font-display text-4xl sm:text-5xl tracking-wider">HİZMETLER</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                title: 'Birebir Antrenman',
                desc: 'Tamamen size özel tasarlanmış antrenman programları. Tek odak noktam sizin hedefiniz, tek önceliğim sizin gelişiminiz.',
              },
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'CrossFit Özel Ders',
                desc: 'Doğru teknik, güvenli ilerleme ve kişiye özel programlama. Olimpik kaldırışlardan jimnastiğe, seviyenize uygun CrossFit deneyimi.',
              },
              {
                icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
                title: 'Beslenme Danışmanlığı',
                desc: 'Antrenman kadar beslenme de önemli. Hedeflerinize uygun, sürdürülebilir ve yaşam tarzınıza entegre beslenme planları.',
              },
            ].map((service, i) => (
              <div
                key={service.title}
                className={`group bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 hover-lift card-glow animate-fade-up delay-${(i + 1) * 100}`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
            {[
              {
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                title: 'Ölçüm & Takip',
                desc: 'Ölçemediğiniz şeyi geliştiremezsiniz. Düzenli vücut analizleri ve ilerleme raporlarıyla nerede olduğunuzu her zaman bilin.',
              },
              {
                icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                title: 'Atletik Performans Koçluğu',
                desc: 'Sadece güçlü değil, atletik olun. Hız, çeviklik ve patlayıcı güç odaklı programlarla performansınızı bir üst seviyeye taşıyın.',
              },
            ].map((service, i) => (
              <div
                key={service.title}
                className={`group bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 hover-lift card-glow animate-fade-up delay-${(i + 4) * 100}`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keşfet */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[100px]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="font-display text-4xl sm:text-5xl tracking-wider">KEŞFET</h2>
            <p className="text-text-secondary mt-3">Ücretsiz içerikler ve araçlar</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link
              href="/antrenmanlar"
              className="group bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 text-center hover-lift card-glow animate-fade-up delay-100"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">Antrenmanlar</h3>
              <p className="text-sm text-text-secondary">Haftalık ücretsiz antrenman programı</p>
              <div className="mt-3 text-sm text-primary font-medium flex items-center justify-center gap-1">
                Programa Git
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link
              href="/araclar"
              className="group bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 text-center hover-lift card-glow animate-fade-up delay-200"
            >
              <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors">
                <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">Hesaplayıcılar</h3>
              <p className="text-sm text-text-secondary">Kalori, 1RM, BMI ve daha fazlası</p>
              <div className="mt-3 text-sm text-orange-500 font-medium flex items-center justify-center gap-1">
                Hesapla
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link
              href="/blog"
              className="group bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 text-center hover-lift card-glow animate-fade-up delay-300"
            >
              <div className="w-14 h-14 bg-blue-400/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-400/20 transition-colors">
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">Blog</h3>
              <p className="text-sm text-text-secondary">Fitness ve sağlıklı yaşam yazıları</p>
              <div className="mt-3 text-sm text-blue-400 font-medium flex items-center justify-center gap-1">
                Yazıları Oku
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0505] via-[#100508] to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="font-display text-4xl sm:text-5xl tracking-wider">İLETİŞİM</h2>
            <p className="text-text-secondary mt-3">Ücretsiz ön görüşme için hemen ulaşın</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* WhatsApp */}
            <a
              href="https://wa.me/905456814776"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 text-center hover-lift animate-fade-up delay-100"
              style={{ '--tw-shadow-color': 'rgba(34, 197, 94, 0.1)' } as React.CSSProperties}
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">WhatsApp</h3>
              <p className="text-sm text-text-secondary">0545 681 4776</p>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/hamzasivrikayaa"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 text-center hover-lift animate-fade-up delay-200"
            >
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-500/20 transition-colors">
                <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Instagram</h3>
              <p className="text-sm text-text-secondary">@hamzasivrikayaa</p>
            </a>

            {/* Telefon */}
            <a
              href="tel:+905456814776"
              className="group bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 text-center hover-lift animate-fade-up delay-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Telefon</h3>
              <p className="text-sm text-text-secondary">0545 681 4776</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-primary/15">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-secondary">
            © 2026 Hamza Sivrikaya. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Blog</Link>
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Üye Girişi</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
