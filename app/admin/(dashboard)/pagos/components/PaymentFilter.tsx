'use client'

import { useRouter } from 'next/navigation'
import { Filter } from 'lucide-react'

interface PaymentFilterProps {
  startDate?: string
  endDate?: string
}

export function PaymentFilter({ startDate, endDate }: PaymentFilterProps) {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const start = formData.get('start') as string
    const end = formData.get('end') as string
    
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    
    router.push(`/admin/pagos?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-gold/20 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-muted" />
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Desde</label>
            <input
              type="date"
              name="start"
              defaultValue={startDate}
              className="w-full bg-bg border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Hasta</label>
            <input
              type="date"
              name="end"
              defaultValue={endDate}
              className="w-full bg-bg border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-gold/20 text-gold px-4 py-2 rounded text-sm hover:bg-gold/30 transition-colors"
        >
          Filtrar
        </button>
      </div>
    </form>
  )
}
