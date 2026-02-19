'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function CronTrigger() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleTrigger() {
    setLoading(true)
    setResult(null)
    try {
      // Admin proxy route üzerinden tetikle (token sunucu tarafında eklenir)
      const res = await fetch('/api/admin/trigger-report', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setResult(`✓ ${data.generated}/${data.total} üye için rapor oluşturuldu.`)
      } else {
        setResult(`Hata: ${data.error}`)
      }
    } catch {
      setResult('Bağlantı hatası')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <Button variant="secondary" onClick={handleTrigger} loading={loading}>
        Haftalık Raporu Şimdi Oluştur
      </Button>
      {result && (
        <p className={`text-sm ${result.startsWith('✓') ? 'text-success' : 'text-danger'}`}>
          {result}
        </p>
      )}
    </div>
  )
}
