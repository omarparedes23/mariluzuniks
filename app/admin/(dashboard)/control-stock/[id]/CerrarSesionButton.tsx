'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { closeControlSesion } from '@/lib/actions/control-stock'
import type { ControlItem, ControlEstado } from '@/types/admin'
import { Lock } from 'lucide-react'

interface CerrarSesionButtonProps {
  sesionId: string
  items: ControlItem[]
  estado: ControlEstado
}

export function CerrarSesionButton({ sesionId, items, estado }: CerrarSesionButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pendingCount = items.filter(i => i.stock_contado === null).length
  const isDisabled = pendingCount > 0 || estado !== 'borrador' || loading

  async function handleClick() {
    if (isDisabled) return
    if (
      !confirm(
        '¿Cerrar esta sesión? Esta acción actualizará el stock de todos los productos y no se puede deshacer.'
      )
    )
      return

    setLoading(true)
    setError('')

    const result = await closeControlSesion(sesionId)

    if (result.success) {
      router.push('/admin/control-stock')
    } else {
      setError(result.error ?? 'Error al cerrar la sesión')
      setLoading(false)
    }
  }

  if (estado !== 'borrador') return null

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Lock className="w-4 h-4" />
        {loading ? 'Cerrando...' : 'Cerrar sesión'}
      </button>

      {pendingCount > 0 && (
        <p className="text-sm text-amber-400">
          Faltan {pendingCount} {pendingCount === 1 ? 'producto' : 'productos'} por contar
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
