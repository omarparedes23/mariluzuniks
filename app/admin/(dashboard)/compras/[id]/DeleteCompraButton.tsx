'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCompra } from '@/lib/actions/purchases'
import { Trash2 } from 'lucide-react'

interface DeleteCompraButtonProps {
  compraId: string
  compraFecha: string
  redirect?: boolean
}

export function DeleteCompraButton({ compraId, compraFecha, redirect = false }: DeleteCompraButtonProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const diasDiferencia = Math.floor(
    (Date.now() - new Date(compraFecha + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24)
  )
  const bloqueado = diasDiferencia >= 30

  async function handleDelete() {
    if (!confirm('¿Eliminar esta compra? Se revertirá el stock de todos los productos.')) return

    setDeleting(true)
    const result = await deleteCompra(compraId)
    setDeleting(false)

    if (result.success) {
      if (redirect) {
        router.push('/admin/compras')
      } else {
        window.location.reload()
      }
    } else {
      alert(result.error || 'Error al eliminar la compra')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting || bloqueado}
      title={bloqueado ? 'No se puede eliminar compras con más de 30 días' : 'Eliminar compra'}
      className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
