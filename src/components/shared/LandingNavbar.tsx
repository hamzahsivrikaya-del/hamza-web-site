'use client'

import { useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '#hakkimda', label: 'Hakkımda' },
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '/antrenmanlar', label: 'Antrenmanlar' },
  { href: '/araclar', label: 'Hesaplayıcılar' },
  { href: '/blog', label: 'Blog' },
  { href: '#iletisim', label: 'İletişim' },
]

export default function LandingNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop linkler */}
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors press-effect"
          >
            Üye Girişi
          </Link>
          {/* Mobil hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden p-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Menü"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobil dropdown menü */}
      {open && (
        <div className="sm:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
