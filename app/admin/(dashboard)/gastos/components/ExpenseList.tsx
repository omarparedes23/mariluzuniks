'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getExpenses } from '@/lib/actions/expenses'
import type { Gasto, GastoCategoria } from '@/types/admin'
import type { ExpenseFilterValues } from './ExpenseFilters'
import {
  Calendar,
  Pencil,
  Receipt,
  CreditCard,
  Banknote,
  Hash,
  Store,
  FileText,
} from 'lucide-react'
import { DeleteExpenseButton } from './DeleteExpenseButton'

interface ExpenseListProps {
  filters?: ExpenseFilterValues
}

const categoriaLabels: Record<GastoCategoria, string> = {
  insumos: 'Insumos',
  servicios: 'Servicios',
  alquiler: 'Alquiler',
  marketing: 'Marketing',
  otros: 'Otros',
}

const categoriaBadgeStyles: Record<GastoCategoria, string> = {
  insumos: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  servicios: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  alquiler: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  marketing: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  otros: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

const comprobanteLabels: Record<string, string> = {
  factura: 'Factura',
  boleta: 'Boleta',
  ticket: 'Ticket',
  sin_comprobante: 'Sin comprobante',
}

const comprobanteBadgeStyles: Record<string, string> = {
  factura: 'bg-green-500/10 text-green-400 border-green-500/20',
  boleta: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  ticket: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  sin_comprobante: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function ExpenseList({ filters }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Gasto[]>([])
  const [loading, setLoading] = useState(true)

  const loadExpenses = useCallback(async () => {
    setLoading(true)
    const data = await getExpenses(filters)
    setExpenses(data)
    setLoading(false)
  }, [filters])

  useEffect(() => {
    loadExpenses()
  }, [loadExpenses])

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount)
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted">Cargando gastos...</div>
        </div>
      ) : expenses.length > 0 ? (
        <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left p-4 text-cream font-medium">Monto</th>
                <th className="text-left p-4 text-cream font-medium">Categoría</th>
                <th className="text-left p-4 text-cream font-medium">Fecha</th>
                <th className="text-left p-4 text-cream font-medium">Proveedor</th>
                <th className="text-left p-4 text-cream font-medium">Comprobante</th>
                <th className="text-left p-4 text-cream font-medium">Método de pago</th>
                <th className="text-right p-4 text-cream font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-gold/10 last:border-b-0 hover:bg-gold/5 transition-colors"
                >
                  <td className="p-4">
                    <span className="text-cream font-medium">
                      {formatCurrency(expense.monto)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${categoriaBadgeStyles[expense.categoria]}`}
                    >
                      {categoriaLabels[expense.categoria]}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-muted text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(expense.fecha)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-cream text-sm">
                      <Store className="w-4 h-4 text-muted" />
                      {expense.proveedor?.nombre || expense.proveedor_nombre || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${comprobanteBadgeStyles[expense.tipo_comprobante || 'sin_comprobante']}`}
                      >
                        {comprobanteLabels[expense.tipo_comprobante || 'sin_comprobante']}
                      </span>
                      {expense.numero_comprobante && (
                        <div className="flex items-center gap-1 text-muted text-xs">
                          <FileText className="w-3 h-3" />
                          {expense.numero_comprobante}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-cream text-sm">
                        {expense.metodo_pago === 'efectivo' ? (
                          <Banknote className="w-4 h-4 text-muted" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-muted" />
                        )}
                        {expense.metodo_pago === 'efectivo'
                          ? 'Efectivo'
                          : expense.metodo_pago === 'yape'
                          ? 'Yape'
                          : 'Transferencia'}
                      </span>
                      {expense.numero_operacion && (
                        <div className="flex items-center gap-1 text-muted text-xs">
                          <Hash className="w-3 h-3" />
                          {expense.numero_operacion}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/gastos/${expense.id}`}
                        className="p-2 text-gold hover:bg-gold/10 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteExpenseButton
                        expenseId={expense.id}
                        onDeleted={loadExpenses}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-gold/20 rounded-lg p-12 text-center">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-cream mb-2">No hay gastos registrados</p>
          <p className="text-muted text-sm mb-4">
            Comienza agregando tu primer gasto
          </p>
          <Link
            href="/admin/gastos/nuevo"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Agregar gasto →
          </Link>
        </div>
      )}
    </div>
  )
}
