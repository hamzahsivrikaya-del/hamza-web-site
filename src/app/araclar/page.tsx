import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitness Hesaplayıcıları | Hamza Sivrikaya',
  description: 'Kalori, 1RM, BMI, su ihtiyacı, ideal kilo ve deri kaliper hesaplayıcıları. Ücretsiz fitness araçları.',
}

const tools = [
  {
    href: '/araclar/kalori-hesaplayici',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    title: 'Kalori & Makro',
    desc: 'Günlük kalori, protein, yağ ve karbonhidrat ihtiyacını hesapla.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    href: '/araclar/1rm-hesaplayici',
    icon: 'M3 6h18M3 12h18M3 18h18',
    title: '1RM Hesaplayıcı',
    desc: 'Tahmini maksimum kaldırma ağırlığını ve yüzdelik tabloyu öğren.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    href: '/araclar/bki-hesaplayici',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    title: 'BMI Hesaplayıcı',
    desc: 'Vücut Kitle İndeksini hesapla, sağlıklı aralığı öğren.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    href: '/araclar/su-ihtiyaci-hesaplayici',
    icon: 'M12 3v1m0 16v1m-6.364-2.636l.707-.707m10.314-10.314l.707-.707M3 12h1m16 0h1m-2.636 6.364l-.707-.707M6.343 6.343l-.707-.707',
    title: 'Su İhtiyacı',
    desc: 'Günlük su ihtiyacını ve içme planını hesapla.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    href: '/araclar/ideal-kilo-hesaplayici',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    title: 'İdeal Kilo',
    desc: '4 bilimsel formülle ideal kilonu öğren.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    href: '/araclar/deri-kaliper-hesaplayici',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Deri Kaliper',
    desc: 'Skinfold ölçümleriyle vücut yağ oranını hesapla.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
]

export default function AraclarPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Atmosferik arka plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#150808] via-[#0d0a0a] to-[#0a0508]" />
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] bg-orange-500/8 rounded-full blur-[110px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[300px] bg-red-500/8 rounded-full blur-[100px]" />
        {/* Floating spor figürleri */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Dumbbell - sağ üst */}
          <svg className="absolute top-[8%] right-[5%] w-28 h-28 text-primary opacity-[0.06] rotate-[25deg] animate-float" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
          {/* Kettlebell - sol üst */}
          <svg className="absolute top-[15%] left-[4%] w-20 h-20 text-primary opacity-[0.07] rotate-[-10deg] animate-float-slow" style={{ animationDelay: '2s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a4 4 0 00-3 6.65V11H8a3 3 0 00-3 3v4a3 3 0 003 3h8a3 3 0 003-3v-4a3 3 0 00-3-3h-1V8.65A4 4 0 0012 2zm0 2a2 2 0 110 4 2 2 0 010-4z"/>
          </svg>
          {/* Koşucu - orta sağ */}
          <svg className="absolute top-[38%] right-[3%] w-22 h-22 text-primary opacity-[0.05] rotate-[8deg] animate-float-drift" style={{ animationDelay: '1s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
          </svg>
          {/* Yıldırım - sol orta */}
          <svg className="absolute top-[50%] left-[7%] w-16 h-16 text-orange-500 opacity-[0.07] rotate-[-20deg] animate-float" style={{ animationDelay: '3s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
          </svg>
          {/* Büyük dumbbell - sol alt */}
          <svg className="absolute top-[65%] left-[2%] w-32 h-32 text-primary opacity-[0.04] rotate-[-35deg] animate-float-slow" style={{ animationDelay: '4s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
          {/* Kalp - sağ alt */}
          <svg className="absolute top-[75%] right-[10%] w-14 h-14 text-primary opacity-[0.06] rotate-[12deg] animate-float-drift" style={{ animationDelay: '5s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {/* Timer - alt orta */}
          <svg className="absolute top-[88%] left-[30%] w-16 h-16 text-primary opacity-[0.05] rotate-[-5deg] animate-float" style={{ animationDelay: '6s' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="relative border-b border-border bg-background/40 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 text-center">
          <Link href="/" className="inline-block font-display text-lg tracking-wider text-primary mb-4 hover:opacity-80 transition-opacity">
            HAMZA SİVRİKAYA
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl tracking-wider mb-2">HESAPLAYICILAR</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Fitness yolculuğunda sana yardımcı olacak ücretsiz araçlar
          </p>
        </div>
      </div>

      {/* Kartlar */}
      <div className="relative max-w-3xl mx-auto px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-surface rounded-xl border border-border p-5 hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-11 h-11 ${tool.bg} rounded-xl flex items-center justify-center`}>
                  <svg className={`w-5 h-5 ${tool.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tool.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-text-primary group-hover:text-primary transition-colors">{tool.title}</h2>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">{tool.desc}</p>
                </div>
                <svg className="w-5 h-5 text-text-secondary/30 group-hover:text-primary/50 shrink-0 mt-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-primary hover:underline text-sm font-medium">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
