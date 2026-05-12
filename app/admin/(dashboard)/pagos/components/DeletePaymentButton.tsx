'use client'

import { deletePayment } from '@/lib/actions/payments'
import { Trash2 } from 'lucide-react'

interface DeletePaymentButtonProps {
  paymentId: string
}

export function DeletePaymentButton({ paymentId }: DeletePaymentButtonProps) {
  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este pago?')) {
      return
    }
    
    const result = await deletePayment(paymentId)
    
    if (result.success) {
      window.location.reload()
    } else {
      alert(result.error || 'Error al eliminar el pago')
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
