import Link from 'next/link'
import { ArrowLeft, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react'
import type { ControlResumen } from '@/types/admin'
import { PrintButton } from './PrintButton'

interface ReporteContentProps {
  resumen: ControlResumen
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ReporteContent({ resumen }: ReporteContentProps) {
  const { sesion, items, total_unidades_consumidas, total_costo, productos_sin_costo, ingresos, margen_bruto, margen_pct } = resumen

  const sortedItems = [...items].sort((a, b) => {
    const ca = a.costo_total ?? -Infinity
    const cb = b.costo_total ?? -Infinity
    return cb - ca
  })

  const margenPctDisplay = margen_pct !== null ? `${(margen_pct * 100).toFixed(1)}%` : '—'
  const margenColor = margen_bruto >= 0 ? 'text-green-400' : 'text-red-400'
  const margenPctColor = margen_pct !== null && margen_pct >= 0 ? 'text-green-400' : 'text-red-400'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/control-stock/${sesion.id}`}
            className="p-2 text-muted hover:text-cream transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-cream">Reporte de Control de Stock</h1>
            <p className="text-muted mt-1">
              {formatDate(sesion.fecha_inicio)} → {formatDate(sesion.fecha_fin)}
            </p>
          </div>
        </div>
        <PrintButton />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Ingresos */}
        <div className="bg-card border border-gold/20 rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-muted text-sm">Ingresos del período</p>
            <DollarSign className="w-4 h-4 text-green-400 shrink-0" />
          </div>
          <p className="font-serif text-2xl text-green-400">S/ {ingresos.toFixed(2)}</p>
        </div>

        {/* Costo */}
        <div className="bg-card border border-gold/20 rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-muted text-sm">Costo de productos</p>
            <Package className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <p className="font-serif text-2xl text-amber-400">S/ {total_costo.toFixed(2)}</p>
        </div>

        {/* Margen bruto */}
        <div className="bg-card border border-gold/20 rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-muted text-sm">Margen bruto</p>
            {margen_bruto >= 0
              ? <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
              : <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
            }
          </div>
          <p className={`font-serif text-2xl ${margenColor}`}>S/ {margen_bruto.toFixed(2)}</p>
        </div>

        {/* Margen % */}
        <div className="bg-card border border-gold/20 rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-muted text-sm">Margen %</p>
            {margen_pct !== null && margen_pct >= 0
              ? <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
              : <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
            }
          </div>
          <p className={`font-serif text-2xl ${margenPctColor}`}>{margenPctDisplay}</p>
        </div>
      </div>

      {/* Warning banner */}
      {productos_sin_costo > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {productos_sin_costo} producto{productos_sin_costo !== 1 ? 's' : ''} sin costo definido — excluido{productos_sin_costo !== 1 ? 's' : ''} del cálculo de costos.
          </span>
        </div>
      )}

      {/* Products table */}
      <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gold/20">
          <h2 className="text-cream font-medium">Productos consumidos</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              <th className="text-left p-4 text-muted text-sm font-medium">Producto</th>
              <th className="text-right p-4 text-muted text-sm font-medium">Unidades consumidas</th>
              <th className="text-right p-4 text-muted text-sm font-medium">Costo unitario</th>
              <th className="text-right p-4 text-muted text-sm font-medium">Costo total</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => {
              const consumo = item.consumo_calculado
              const esSuperavit = consumo !== null && consumo < 0

              return (
                <tr key={item.id} className="border-b border-gold/10 last:border-b-0">
                  <td className="p-4">
                    <p className="text-cream">{item.producto?.nombre || '—'}</p>
                    {item.producto?.codigo && (
                      <p className="text-muted text-xs">{item.producto.codigo}</p>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {consumo === null ? (
                      <span className="text-muted">—</span>
                    ) : esSuperavit ? (
                      <span className="text-muted text-sm">(+{Math.abs(consumo)} excedente)</span>
                    ) : (
                      <span className="text-cream">{consumo}</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {item.costo_unitario === null ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted/10 text-muted border border-muted/20">
                        sin costo
                      </span>
                    ) : (
                      <span className="text-cream">S/ {Number(item.costo_unitario).toFixed(3)}</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {item.costo_total === null ? (
                      <span className="text-muted">—</span>
                    ) : (
                      <span className="text-gold font-medium">S/ {Number(item.costo_total).toFixed(2)}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-gold/20">
              <td className="p-4 text-muted text-sm">Total</td>
              <td className="p-4 text-right text-cream font-medium">{total_unidades_consumidas}</td>
              <td className="p-4" />
              <td className="p-4 text-right font-serif text-xl text-gold">S/ {total_costo.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
