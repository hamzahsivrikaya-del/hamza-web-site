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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
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
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
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
