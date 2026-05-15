import { notFound } from 'next/navigation'
import { getExpenseById } from '@/lib/actions/expenses'
import EditExpensePageClient from './EditExpensePageClient'

interface EditExpensePageProps {
  params: Promise<{ id: string }>
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = await params
  const expense = await getExpenseById(id)

  if (!expense) {
    notFound()
  }

  return <EditExpensePageClient expense={expense} id={id} />
}
