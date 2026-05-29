'use client'

import { useState, useRef, useEffect } from 'react'
import { updateControlItem } from '@/lib/actions/control-stock'
import type { ControlItem, ControlEstado } from '@/types/admin'
import { Check, X, Loader2 } from 'lucide-react'

interface ControlGridProps {
  items: ControlItem[]
  sesionId: string
  estado: ControlEstado
  fechaInicio: string
  fechaFin: string
}

type RowStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error'

function initLocalValues(items: ControlItem[]): Record<string, number | null> {
  return Object.fromEntries(items.map(i => [i.id, i.stock_contado]))
}

function initStatuses(items: ControlItem[]): Record<string, RowStatus> {
  return Object.fromEntries(items.map(i => [i.id, 'idle' as RowStatus]))
}

export function ControlGrid({ items, sesionId: _sesionId, estado, fechaInicio: _fechaInicio, fechaFin: _fechaFin }: ControlGridProps) {
  const [localValues, setLocalValues] = useState<Record<string, number | null>>(() => initLocalValues(items))
  const [statuses, setStatuses] = useState<Record<string, RowStatus>>(() => initStatuses(items))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const timerRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const clearTimerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // Cancel all pending timers on unmount to avoid ghost saves after session deletion
  useEffect(() => {
    return () => {
      Object.values(timerRefs.current).forEach(clearTimeout)
      Object.values(clearTimerRef.current).forEach(clearTimeout)
    }
  }, [])

  // Auto-clear 'saved' status after 2s
  useEffect(() => {
    const savedIds = Object.entries(statuses)
      .filter(([, s]) => s === 'saved')
      .map(([id]) => id)

    for (const id of savedIds) {
      if (!clearTimerRef.current[id]) {
        clearTimerRef.current[id] = setTimeout(() => {
          setStatuses(prev => prev[id] === 'saved' ? { ...prev, [id]: 'idle' } : prev)
          delete clearTimerRef.current[id]
        }, 2000)
      }
    }
  }, [statuses])

  async function saveItem(itemId: string, value: number | null) {
    setStatuses(prev => ({ ...prev, [itemId]: 'saving' }))
    const res = await updateControlItem(itemId, value)
    if (res.success) {
      setStatuses(prev => ({ ...prev, [itemId]: 'saved' }))
      setErrors(prev => { const next = { ...prev }; delete next[itemId]; return next })
    } else {
      setStatuses(prev => ({ ...prev, [itemId]: 'error' }))
      setErrors(prev => ({ ...prev, [itemId]: res.error ?? 'Error al guardar' }))
    }
  }

  function handleChange(itemId: string, raw: string) {
    const value = raw === '' ? null : parseInt(raw, 10)
    setLocalValues(prev => ({ ...prev, [itemId]: value }))
    setStatuses(prev => ({ ...prev, [itemId]: 'pending' }))
    clearTimeout(timerRefs.current[itemId])
    timerRefs.current[itemId] = setTimeout(() => {
      saveItem(itemId, value)
    }, 500)
  }

  function handleBlur(itemId: string) {
    clearTimeout(timerRefs.current[itemId])
    const value = localValues[itemId] ?? null
    if (statuses[itemId] === 'pending') {
      saveItem(itemId, value)
    }
  }

  const isReadonly = estado !== 'borrador'

  // Computed per-row values
  function getEsperado(item: ControlItem): number {
    return item.stock_anterior + item.compras_en_periodo + item.ajustes_en_periodo
  }

  function getConsumo(item: ControlItem): number | null {
    const contado = localValues[item.id]
    if (contado === null || contado === undefined) return null
    return getEsperado(item) - contado
  }

  function getCostoTotal(item: ControlItem): number | null {
    const consumo = getConsumo(item)
    if (consumo === null || item.costo_unitario === null) return null
    return consumo * item.costo_unitario
  }

  // Summary totals
  const totalConsumo = items.reduce((sum, item) => {
    const c = getConsumo(item)
    return c !== null ? sum + c : sum
  }, 0)

  const totalCosto = items.reduce((sum, item) => {
    const ct = getCostoTotal(item)
    return ct !== null ? sum + ct : sum
  }, 0)

  const sinCostoCount = items.filter(item => item.costo_unitario === null).length

  return (
    <div className="space-y-3">
      {estado === 'borrador' && (
        <p className="text-sm text-muted px-1">
          Los valores de conteo están pre-llenados con el stock esperado (sin consumo).
          Corrige solo los productos donde el conteo físico difiera.
        </p>
      )}
    <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20">
              <th className="text-left p-4 text-muted font-medium whitespace-nowrap">Producto</th>
              <th className="text-right p-4 text-muted font-medium whitespace-nowrap">Stock ant.</th>
              <th className="text-right p-4 text-muted font-medium whitespace-nowrap">Compras</th>
              <th className="text-right p-4 text-muted font-medium whitespace-nowrap">Ajustes</th>
              <th className="text-right p-4 text-muted font-medium whitespace-nowrap">Esperado</th>
              <th className="text-right p-4 text-muted font-medium whitespace-nowrap">Contado</th>
              <th className="text-right p-4 text-muted font-medium whitespace-nowrap">Consumo</th>
              <th className="text-right p-4 text-muted font-medium whitespace-nowrap">Costo unit.</th>
              <th className="text-right p-4 text-muted font-medium whitespace-nowrap">Costo total</th>
              <th className="w-8 p-4" />
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const esperado = getEsperado(item)
              const consumo = getConsumo(item)
              const costoTotal = getCostoTotal(item)
              const status = statuses[item.id] ?? 'idle'
              const isSurplus = consumo !== null && consumo < 0

              return (
                <tr key={item.id} className="border-b border-gold/10 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                  {/* Producto */}
                  <td className="p-4">
                    <p className="text-cream">{item.producto?.nombre ?? '—'}</p>
                    {item.producto?.codigo && (
                      <span className="inline-block mt-1 text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                        {item.producto.codigo}
                      </span>
                    )}
                  </td>

                  {/* Stock anterior */}
                  <td className="p-4 text-right text-cream">{item.stock_anterior}</td>

                  {/* Compras */}
                  <td className="p-4 text-right text-cream">{item.compras_en_periodo}</td>

                  {/* Ajustes */}
                  <td className="p-4 text-right text-cream">
                    {item.ajustes_en_periodo > 0
                      ? <span className="text-green-400">+{item.ajustes_en_periodo}</span>
                      : item.ajustes_en_periodo < 0
                        ? <span className="text-red-400">{item.ajustes_en_periodo}</span>
                        : <span className="text-cream">0</span>
                    }
                  </td>

                  {/* Esperado */}
                  <td className="p-4 text-right text-gold font-medium">{esperado}</td>

                  {/* Contado */}
                  <td className="p-4 text-right">
                    {isReadonly ? (
                      <span className="text-cream">
                        {localValues[item.id] !== null && localValues[item.id] !== undefined
                          ? localValues[item.id]
                          : <span className="text-muted">—</span>
                        }
                      </span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={localValues[item.id] !== null && localValues[item.id] !== undefined ? (localValues[item.id] as number) : ''}
                        onChange={e => handleChange(item.id, e.target.value)}
                        onBlur={() => handleBlur(item.id)}
                        placeholder="—"
                        className="w-24 bg-bg border border-gold/30 rounded px-3 py-1.5 text-cream text-right focus:border-gold focus:outline-none transition-colors placeholder:text-muted"
                      />
                    )}
                  </td>

                  {/* Consumo */}
                  <td className="p-4 text-right">
                    {consumo === null ? (
                      <span className="text-muted">—</span>
                    ) : isSurplus ? (
                      <span className="text-green-400 font-medium">{consumo}</span>
                    ) : (
                      <span className="text-cream font-medium">{consumo}</span>
                    )}
                  </td>

                  {/* Costo unit. */}
                  <td className="p-4 text-right">
                    {item.costo_unitario !== null ? (
                      <span className="text-cream">S/ {Number(item.costo_unitario).toFixed(2)}</span>
                    ) : (
                      <span className="text-xs bg-muted/20 text-muted px-2 py-0.5 rounded-full">sin costo</span>
                    )}
                  </td>

                  {/* Costo total */}
                  <td className="p-4 text-right">
                    {costoTotal !== null ? (
                      <span className="text-gold font-medium">S/ {costoTotal.toFixed(2)}</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  {/* Status indicator */}
                  <td className="p-4 text-center">
                    {status === 'idle' && null}
                    {status === 'pending' && (
                      <span className="inline-block w-2 h-2 rounded-full bg-muted" />
                    )}
                    {status === 'saving' && (
                      <Loader2 className="w-4 h-4 text-muted animate-spin mx-auto" />
                    )}
                    {status === 'saved' && (
                      <Check className="w-4 h-4 text-green-400 mx-auto" />
                    )}
                    {status === 'error' && (
                      <span
                        title={errors[item.id] ?? 'Error al guardar'}
                        className="cursor-help"
                      >
                        <X className="w-4 h-4 text-red-400 mx-auto" />
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>

          {/* Summary footer */}
          <tfoot>
            <tr className="border-t border-gold/20 bg-white/[0.02]">
              <td className="p-4 text-muted text-sm font-medium" colSpan={6}>
                Totales
                {sinCostoCount > 0 && (
                  <span className="ml-2 text-xs text-muted/60">
                    ({sinCostoCount} {sinCostoCount === 1 ? 'producto' : 'productos'} sin costo no incluidos en total)
                  </span>
                )}
              </td>
              <td className="p-4 text-right font-medium text-cream">{totalConsumo}</td>
              <td className="p-4" />
              <td className="p-4 text-right font-serif text-gold font-medium">
                S/ {totalCosto.toFixed(2)}
              </td>
              <td className="p-4" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    </div>
  )
}
