'use client'

import { useState, useCallback, useEffect } from 'react'
import { Filter, RotateCcw, Tag, Calendar, Store } from 'lucide-react'

export interface ExpenseFilterValues {
  categoria: string
  startDate: string
  endDate: string
  proveedorSearch: string
}

interface ExpenseFiltersProps {
  filters: ExpenseFilterValues
  onChange: (filters: ExpenseFilterValues) => void
}

const categorias = [
  { value: '', label: 'Todas las categorías' },
  { value: 'insumos', label: 'Insumos' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'otros', label: 'Otros' },
]

export default function ExpenseFilters({ filters, onChange }: ExpenseFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ExpenseFilterValues>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleChange = useCallback(
    (key: keyof ExpenseFilterValues, value: string) => {
      const next = { ...localFilters, [key]: value }
      setLocalFilters(next)
      onChange(next)
    },
    [localFilters, onChange]
  )

  function handleReset() {
    const reset: ExpenseFilterValues = { categoria: '', startDate: '', endDate: '', proveedorSearch: '' }
    setLocalFilters(reset)
    onChange(reset)
  }

  const hasActiveFilters =
    localFilters.categoria || localFilters.startDate || localFilters.endDate || localFilters.proveedorSearch

  return (
    <div className="bg-card border border-gold/20 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Filter className="w-5 h-5 text-muted shrink-0" />

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
          {/* Category filter */}
          <div>
            <label className="flex items-center gap-1 text-xs text-muted mb-1">
              <Tag className="w-3 h-3" />
              Categoría
            </label>
            <select
              value={localFilters.categoria}
              onChange={(e) => handleChange('categoria', e.target.value)}
              className="w-full bg-bg border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none"
            >
              {categorias.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Proveedor search */}
          <div>
            <label className="flex items-center gap-1 text-xs text-muted mb-1">
              <Store className="w-3 h-3" />
              Proveedor
            </label>
            <input
              type="text"
              value={localFilters.proveedorSearch}
              onChange={(e) => handleChange('proveedorSearch', e.target.value)}
              placeholder="Buscar proveedor..."
              className="w-full bg-bg border border-gold/30 rounded px-3 py-2 text-cream text-sm placeholder:text-muted focus:border-gold focus:outline-none"
            />
          </div>

          {/* Start date */}
          <div>
            <label className="flex items-center gap-1 text-xs text-muted mb-1">
              <Calendar className="w-3 h-3" />
              Desde
            </label>
            <input
              type="date"
              value={localFilters.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full bg-bg border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none"
            />
          </div>

          {/* End date */}
          <div>
            <label className="flex items-center gap-1 text-xs text-muted mb-1">
              <Calendar className="w-3 h-3" />
              Hasta
            </label>
            <input
              type="date"
              value={localFilters.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full bg-bg border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 bg-gold/20 text-gold px-4 py-2 rounded text-sm hover:bg-gold/30 transition-colors shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
