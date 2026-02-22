export default function BackgroundGraffiti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* 1. Barbell — sol üst köşe */}
      <svg style={{ position: 'absolute', left: -20, top: '4%', opacity: 0.04 }} width="320" height="80" viewBox="0 0 320 80">
        <rect x="0" y="5" width="30" height="70" fill="#1A1A1A" />
        <rect x="30" y="15" width="20" height="50" fill="#1A1A1A" />
        <rect x="50" y="30" width="220" height="20" fill="#1A1A1A" />
        <rect x="270" y="15" width="20" height="50" fill="#1A1A1A" />
        <rect x="290" y="5" width="30" height="70" fill="#1A1A1A" />
      </svg>

      {/* 2. Kettlebell — sağ üst */}
      <svg style={{ position: 'absolute', right: 40, top: '8%', opacity: 0.035 }} width="90" height="130" viewBox="0 0 90 130">
        <rect x="22" y="0" width="46" height="8" fill="#1A1A1A" />
        <rect x="18" y="0" width="10" height="38" fill="#1A1A1A" />
        <rect x="62" y="0" width="10" height="38" fill="#1A1A1A" />
        <polygon points="5,42 85,42 90,70 90,125 0,125 0,70" fill="#1A1A1A" />
      </svg>

      {/* 3. Hex plaka — sol, %28 */}
      <svg style={{ position: 'absolute', left: 30, top: '26%', opacity: 0.03, transform: 'rotate(12deg)' }} width="110" height="125" viewBox="0 0 110 125">
        <polygon points="55,0 105,18 110,62 105,107 55,125 5,107 0,62 5,18" fill="#1A1A1A" />
        <polygon points="55,30 80,40 83,62 80,85 55,95 30,85 27,62 30,40" fill="#FAFAFA" />
      </svg>

      {/* 4. Dumbbell (dikey) — sağ, %30 */}
      <svg style={{ position: 'absolute', right: 15, top: '28%', opacity: 0.04, transform: 'rotate(90deg)' }} width="200" height="55" viewBox="0 0 200 55">
        <rect x="0" y="2" width="35" height="50" fill="#1A1A1A" />
        <rect x="35" y="12" width="20" height="30" fill="#1A1A1A" />
        <rect x="55" y="20" width="90" height="14" fill="#1A1A1A" />
        <rect x="145" y="12" width="20" height="30" fill="#1A1A1A" />
        <rect x="165" y="2" width="35" height="50" fill="#1A1A1A" />
      </svg>

      {/* 5. Pull-up bar — üst orta */}
      <svg style={{ position: 'absolute', left: '35%', top: '15%', opacity: 0.025 }} width="260" height="70" viewBox="0 0 260 70">
        <rect x="0" y="0" width="260" height="12" fill="#1A1A1A" />
        <rect x="15" y="12" width="12" height="58" fill="#1A1A1A" />
        <rect x="233" y="12" width="12" height="58" fill="#1A1A1A" />
      </svg>

      {/* 6. Plyo box — sol, %50 */}
      <svg style={{ position: 'absolute', left: 10, top: '48%', opacity: 0.035, transform: 'rotate(-5deg)' }} width="120" height="100" viewBox="0 0 120 100">
        <polygon points="15,25 105,25 120,40 120,100 0,100 0,40" fill="#1A1A1A" />
        <polygon points="15,25 60,0 120,25 105,25 60,8" fill="#1A1A1A" />
      </svg>

      {/* 7. Timer / Kronometre — sağ, %50 */}
      <svg style={{ position: 'absolute', right: 50, top: '50%', opacity: 0.03 }} width="100" height="120" viewBox="0 0 100 120">
        <rect x="38" y="0" width="24" height="12" fill="#1A1A1A" />
        <rect x="45" y="12" width="10" height="10" fill="#1A1A1A" />
        <rect x="85" y="25" width="15" height="8" fill="#1A1A1A" transform="rotate(45 92 29)" />
        <rect x="10" y="25" width="80" height="90" rx="0" fill="none" stroke="#1A1A1A" strokeWidth="8" />
        <rect x="48" y="45" width="4" height="30" fill="#1A1A1A" />
        <rect x="48" y="65" width="25" height="4" fill="#1A1A1A" />
      </svg>

      {/* 8. Battle rope dalga — alt orta */}
      <svg style={{ position: 'absolute', left: '20%', bottom: '12%', opacity: 0.03 }} width="400" height="60" viewBox="0 0 400 60">
        <path d="M0,30 Q25,0 50,30 Q75,60 100,30 Q125,0 150,30 Q175,60 200,30 Q225,0 250,30 Q275,60 300,30 Q325,0 350,30 Q375,60 400,30" fill="none" stroke="#1A1A1A" strokeWidth="8" />
      </svg>

      {/* 9. Halter plaka yığını — sağ alt */}
      <svg style={{ position: 'absolute', right: 20, bottom: '5%', opacity: 0.04 }} width="80" height="160" viewBox="0 0 80 160">
        <rect x="0" y="0" width="80" height="25" fill="#1A1A1A" />
        <rect x="8" y="30" width="64" height="20" fill="#1A1A1A" />
        <rect x="15" y="55" width="50" height="18" fill="#1A1A1A" />
        <rect x="8" y="78" width="64" height="20" fill="#1A1A1A" />
        <rect x="0" y="103" width="80" height="25" fill="#1A1A1A" />
        <rect x="12" y="133" width="56" height="22" fill="#1A1A1A" />
      </svg>

      {/* 10. Crosshair / hedef — sol alt */}
      <svg style={{ position: 'absolute', left: 40, bottom: '4%', opacity: 0.025 }} width="90" height="90" viewBox="0 0 90 90">
        <rect x="40" y="0" width="10" height="90" fill="#1A1A1A" />
        <rect x="0" y="40" width="90" height="10" fill="#1A1A1A" />
        <rect x="12" y="12" width="66" height="66" fill="none" stroke="#1A1A1A" strokeWidth="5" />
      </svg>

      {/* 11. Yıldırım / güç — orta sol, %72 */}
      <svg style={{ position: 'absolute', left: '8%', top: '70%', opacity: 0.03 }} width="60" height="100" viewBox="0 0 60 100">
        <polygon points="35,0 10,45 25,45 5,100 50,48 32,48 55,0" fill="#1A1A1A" />
      </svg>

      {/* 12. Kalp / cardio — sağ, %72 */}
      <svg style={{ position: 'absolute', right: '8%', top: '72%', opacity: 0.025, transform: 'rotate(-10deg)' }} width="80" height="72" viewBox="0 0 80 72">
        <path d="M40,68 L5,32 Q0,20 8,10 Q16,0 28,4 L40,16 L52,4 Q64,0 72,10 Q80,20 75,32 Z" fill="#1A1A1A" />
      </svg>

      {/* 13. Koşucu silueti — üst sağ, %18 */}
      <svg style={{ position: 'absolute', right: '18%', top: '3%', opacity: 0.025 }} width="70" height="90" viewBox="0 0 70 90">
        <circle cx="45" cy="10" r="8" fill="#1A1A1A" />
        <polygon points="45,18 55,40 65,55 55,55 48,42 35,65 25,65 38,40 30,55 18,55 32,35 40,18" fill="#1A1A1A" />
        <rect x="25" y="60" width="6" height="28" fill="#1A1A1A" transform="rotate(-5 28 74)" />
        <rect x="50" y="52" width="6" height="30" fill="#1A1A1A" transform="rotate(12 53 67)" />
      </svg>
    </div>
  )
}
