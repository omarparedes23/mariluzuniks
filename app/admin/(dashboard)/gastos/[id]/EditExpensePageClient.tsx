'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateExpense, deleteExpense } from '@/lib/actions/expenses'
import ExpenseForm from '../components/ExpenseForm'
import type { Gasto } from '@/types/admin'

interface EditExpensePageClientProps {
  expense: Gasto
  id: string
}

export default function EditExpensePageClient({ expense, id }: EditExpensePageClientProps) {
  const router = useRouter()
  const [deleteError, setDeleteError] = useState('')

  async function handleSubmit(formData: FormData) {
    return updateExpense(id, formData)
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer.')) {
      return
    }
    const result = await deleteExpense(id)
    if (result.success) {
      router.push('/admin/gastos')
    } else {
      setDeleteError(result.error || 'Error al eliminar el gasto')
    }
  }

  return (
    <div>
      {deleteError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {deleteError}
        </div>
      )}
      <ExpenseForm
        expense={expense}
        onSubmit={handleSubmit}
        backHref="/admin/gastos"
        title="Editar Gasto"
        subtitle="Modifica los datos del gasto"
        submitLabel="Actualizar Gasto"
        headerActions={
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Eliminar Gasto
          </button>
        }
      />
    </div>
  )
}
