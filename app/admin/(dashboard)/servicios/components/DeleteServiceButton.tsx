'use client'

import { deleteService } from '@/lib/actions/services'
import { Trash2 } from 'lucide-react'

interface DeleteServiceButtonProps {
  serviceId: string
}

export function DeleteServiceButton({ serviceId }: DeleteServiceButtonProps) {
  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) {
      return
    }
    
    const result = await deleteService(serviceId)
    
    if (result.success) {
      window.location.reload()
    } else {
      alert(result.error || 'Error al eliminar el servicio')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
