'use client'

import dynamic from 'next/dynamic'

const ProgressChart = dynamic(() => import('./ProgressChart'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center text-text-secondary text-sm">
      Grafik yükleniyor...
    </div>
  ),
})

export default ProgressChart
