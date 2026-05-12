'use client'

import { deleteProduct } from '@/lib/actions/products'
import { Trash2 } from 'lucide-react'

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este producto?')) {
      return
    }
    
    const result = await deleteProduct(productId)
    
    if (result.success) {
      window.location.reload()
    } else {
      alert(result.error || 'Error al eliminar el producto')
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
