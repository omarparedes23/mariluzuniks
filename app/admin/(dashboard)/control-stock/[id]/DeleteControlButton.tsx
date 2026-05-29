'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteControlSesion } from '@/lib/actions/control-stock'
import type { ControlEstado } from '@/types/admin'
import { Trash2 } from 'lucide-react'

interface DeleteControlButtonProps {
  sesionId: string
  estado: ControlEstado
}

export function DeleteControlButton({ sesionId, estado }: DeleteControlButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  if (estado !== 'borrador') return null

  async function handleDelete() {
    if (!confirm('¿Eliminar esta sesión de control? Esta acción no se puede deshacer.')) return

    setDeleting(true)
    const result = await deleteControlSesion(sesionId)

    if (result.success) {
      router.push('/admin/control-stock')
    } else {
      alert(result.error ?? 'Error al eliminar la sesión')
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      title="Eliminar sesión de control"
      className="flex items-center gap-2 px-4 py-3 text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Trash2 className="w-4 h-4" />
      {deleting ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
