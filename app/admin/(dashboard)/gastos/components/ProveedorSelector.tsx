'use client'

import { useState, useEffect, useCallback } from 'react'
import { getProveedores } from '@/lib/actions/proveedores'
import type { Proveedor } from '@/types/admin'
import { Store, ChevronDown } from 'lucide-react'

interface ProveedorSelectorProps {
  proveedorId: string | null
  proveedorNombre: string | null
  onChange: (proveedorId: string | null, proveedorNombre: string | null) => void
}

const OTRO_VALUE = '__otro__'

export default function ProveedorSelector({
  proveedorId,
  proveedorNombre,
  onChange,
}: ProveedorSelectorProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(false)

  const loadProveedores = useCallback(async () => {
    setLoading(true)
    const data = await getProveedores()
    setProveedores(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProveedores()
  }, [loadProveedores])

  const isOtro = !proveedorId && proveedorNombre !== null && proveedorNombre !== ''
  const selectedValue = proveedorId || (isOtro ? OTRO_VALUE : '')

  function handleSelect(value: string) {
    if (value === OTRO_VALUE) {
      onChange(null, proveedorNombre || '')
    } else {
      const selected = proveedores.find((p) => p.id === value)
      if (selected) {
        onChange(selected.id, selected.nombre)
      } else {
        onChange(null, null)
      }
    }
  }

  function handleOtroNombreChange(value: string) {
    onChange(null, value.trim())
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <select
          value={selectedValue}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full bg-bg border border-gold/30 rounded pl-10 pr-10 py-3 text-cream focus:border-gold focus:outline-none transition-colors appearance-none"
        >
          <option value="" disabled>
            {loading ? 'Cargando proveedores...' : 'Selecciona un proveedor'}
          </option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
          <option value={OTRO_VALUE}>+ Otro (escribir nombre)</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>

      {selectedValue === OTRO_VALUE && (
        <div>
          <input
            type="text"
            value={proveedorNombre || ''}
            onChange={(e) => handleOtroNombreChange(e.target.value)}
            placeholder="Nombre del proveedor"
            className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
          />
        </div>
      )}
    </div>
  )
}
