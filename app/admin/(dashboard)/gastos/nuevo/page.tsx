import { createExpense } from '@/lib/actions/expenses'
import ExpenseForm from '../components/ExpenseForm'

export default function NewExpensePage() {
  return (
    <ExpenseForm
      onSubmit={createExpense}
      backHref="/admin/gastos"
      title="Nuevo Gasto"
      subtitle="Registra un nuevo gasto del negocio"
      submitLabel="Guardar Gasto"
    />
  )
}
