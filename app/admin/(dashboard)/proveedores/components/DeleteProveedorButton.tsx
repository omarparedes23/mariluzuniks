'use client'

import { useState } from 'react'
import { deleteProveedor } from '@/lib/actions/proveedores'
import { Trash2 } from 'lucide-react'

interface DeleteProveedorButtonProps {
  proveedorId: string
  onDeleted?: () => void
}

export function DeleteProveedorButton({ proveedorId, onDeleted }: DeleteProveedorButtonProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este proveedor? Esta acción no se puede deshacer.')) {
      return
    }

    setDeleting(true)
    const result = await deleteProveedor(proveedorId)
    setDeleting(false)

    if (result.success) {
      if (onDeleted) {
        onDeleted()
      } else {
        window.location.reload()
      }
    } else {
      alert(result.error || 'Error al eliminar el proveedor')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Eliminar"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
