'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ExpenseList from './ExpenseList'
import ExpenseFilters from './ExpenseFilters'
import type { ExpenseFilterValues } from './ExpenseFilters'

export default function ExpensePageClient() {
  const [filters, setFilters] = useState<ExpenseFilterValues>({
    categoria: '',
    startDate: '',
    endDate: '',
    proveedorSearch: '',
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Gastos</h1>
          <p className="text-muted">Registro de gastos del negocio</p>
        </div>
        <Link
          href="/admin/gastos/nuevo"
          className="bg-gold text-black px-4 py-2 rounded font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Gasto
        </Link>
      </div>

      <ExpenseFilters filters={filters} onChange={setFilters} />
      <ExpenseList filters={filters} />
    </div>
  )
}
