'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createAjuste } from '@/lib/actions/stock'
import type { Producto } from '@/types/admin'
import { ArrowLeft, ClipboardCheck } from 'lucide-react'

export default function AjusteStockForm({ products }: { products: Producto[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [productoId, setProductoId] = useState('')
  const [stockNuevo, setStockNuevo] = useState('')
  const [motivo, setMotivo] = useState('')

  const productoSeleccionado = products.find(p => p.id === productoId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await createAjuste(productoId, parseInt(stockNuevo), motivo)

    if (result.success) {
      const anterior = productoSeleccionado?.stock ?? 0
      const nuevo = parseInt(stockNuevo)
      const diferencia = nuevo - anterior
      setSuccess(
        `Stock actualizado: ${anterior} → ${nuevo} (${diferencia >= 0 ? '+' : ''}${diferencia} unidades)`
      )
      setProductoId('')
      setStockNuevo('')
      setMotivo('')
      router.refresh()
    } else {
      setError(result.error || 'Error al registrar el ajuste')
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/productos" className="p-2 text-muted hover:text-cream transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-cream">Ajuste de Stock</h1>
          <p className="text-muted">Registra el conteo físico al cierre del día</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="bg-card border border-gold/20 rounded-lg p-6 space-y-5">

          <div>
            <label className="block text-sm text-cream/80 mb-2">Producto *</label>
            <select
              required
              value={productoId}
              onChange={e => { setProductoId(e.target.value); setStockNuevo('') }}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
            >
              <option value="" disabled>Selecciona un producto</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.codigo ? `[${p.codigo}] ` : ''}{p.nombre}
                </option>
              ))}
            </select>
          </div>

          {productoSeleccionado && (
            <div className="bg-bg rounded-lg px-4 py-3 border border-gold/20 flex items-center justify-between">
              <span className="text-muted text-sm">Stock actual en sistema</span>
              <span className="font-serif text-xl text-gold">{productoSeleccionado.stock} unid.</span>
            </div>
          )}

          <div>
            <label className="block text-sm text-cream/80 mb-2">Stock real contado *</label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={stockNuevo}
              onChange={e => setStockNuevo(e.target.value)}
              placeholder="Ingresa el conteo físico"
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
            />
            {productoSeleccionado && stockNuevo !== '' && (
              <p className={`text-xs mt-1 ${
                parseInt(stockNuevo) < productoSeleccionado.stock
                  ? 'text-red-400'
                  : parseInt(stockNuevo) > productoSeleccionado.stock
                  ? 'text-green-400'
                  : 'text-muted'
              }`}>
                Diferencia: {parseInt(stockNuevo) - productoSeleccionado.stock >= 0 ? '+' : ''}
                {parseInt(stockNuevo) - productoSeleccionado.stock} unidades
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-cream/80 mb-2">
              Motivo <span className="text-muted font-normal">(opcional)</span>
            </label>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              rows={2}
              placeholder="Ej: Cierre del día, merma, rotura..."
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading || !productoId || stockNuevo === ''}
              className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ClipboardCheck className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Registrar Ajuste'}
            </button>
            <Link href="/admin/productos" className="text-muted hover:text-cream transition-colors">
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
