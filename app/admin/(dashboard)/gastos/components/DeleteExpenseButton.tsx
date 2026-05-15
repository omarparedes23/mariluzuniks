'use client'

import { useState } from 'react'
import { deleteExpense } from '@/lib/actions/expenses'
import { Trash2 } from 'lucide-react'

interface DeleteExpenseButtonProps {
  expenseId: string
  onDeleted?: () => void
}

export function DeleteExpenseButton({ expenseId, onDeleted }: DeleteExpenseButtonProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer.')) {
      return
    }

    setDeleting(true)
    const result = await deleteExpense(expenseId)
    setDeleting(false)

    if (result.success) {
      if (onDeleted) {
        onDeleted()
      } else {
        window.location.reload()
      }
    } else {
      alert(result.error || 'Error al eliminar el gasto')
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
