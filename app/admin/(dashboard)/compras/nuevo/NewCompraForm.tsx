'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createCompra } from '@/lib/actions/purchases'
import type { Producto } from '@/types/admin'
import { ArrowLeft, Plus, X, ShoppingCart } from 'lucide-react'
import ProveedorSelector from '../../gastos/components/ProveedorSelector'

interface ItemRow {
  producto_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

const tiposComprobante = [
  { value: 'factura', label: 'Factura' },
  { value: 'boleta', label: 'Boleta' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'sin_comprobante', label: 'Sin comprobante' },
]

const metodosPago = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'yape', label: 'Yape' },
]

export default function NewCompraForm({ products }: { products: Producto[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [proveedorId, setProveedorId] = useState<string | null>(null)
  const [proveedorNombre, setProveedorNombre] = useState<string | null>(null)
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [tipoComprobante, setTipoComprobante] = useState('factura')
  const [numeroComprobante, setNumeroComprobante] = useState('')
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [notas, setNotas] = useState('')
  const [items, setItems] = useState<ItemRow[]>([
    { producto_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 },
  ])

  const total = items.reduce((sum, i) => sum + i.subtotal, 0)
  const showNumeroComprobante = tipoComprobante !== 'sin_comprobante'

  function addItem() {
    setItems(prev => [...prev, { producto_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }])
  }

  function removeItem(index: number) {
    setItems(prev =>
      prev.length === 1
        ? [{ producto_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }]
        : prev.filter((_, i) => i !== index)
    )
  }

  function updateItem(index: number, field: keyof ItemRow, value: string | number) {
    setItems(prev => {
      const updated = [...prev]
      const row = { ...updated[index], [field]: value }
      if (field === 'cantidad' || field === 'precio_unitario') {
        const cantidad = field === 'cantidad' ? Number(value) : row.cantidad
        const precio = field === 'precio_unitario' ? Number(value) : row.precio_unitario
        row.subtotal = parseFloat((cantidad * precio).toFixed(2))
      }
      updated[index] = row
      return updated
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await createCompra({
      proveedor_id: proveedorId || '',
      fecha,
      tipo_comprobante: tipoComprobante,
      numero_comprobante: numeroComprobante,
      metodo_pago: metodoPago,
      total,
      notas,
      items,
    })

    if (result.success) {
      router.push('/admin/compras')
      router.refresh()
    } else {
      setError(result.error || 'Error al registrar la compra')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/compras" className="p-2 text-muted hover:text-cream transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-cream">Nueva Compra</h1>
          <p className="text-muted">Registra una compra de proveedor</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="bg-card border border-gold/20 rounded-lg p-6 space-y-5">
          <h2 className="text-cream font-medium">Datos del comprobante</h2>

          <div>
            <label className="block text-sm text-cream/80 mb-2">Proveedor *</label>
            <ProveedorSelector
              proveedorId={proveedorId}
              proveedorNombre={proveedorNombre}
              onChange={(id, nombre) => { setProveedorId(id); setProveedorNombre(nombre) }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-cream/80 mb-2">Fecha *</label>
              <input
                type="date"
                required
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">Método de pago *</label>
              <select
                value={metodoPago}
                onChange={e => setMetodoPago(e.target.value)}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
              >
                {metodosPago.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-cream/80 mb-2">Tipo de comprobante *</label>
              <select
                value={tipoComprobante}
                onChange={e => setTipoComprobante(e.target.value)}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
              >
                {tiposComprobante.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {showNumeroComprobante && (
              <div>
                <label className="block text-sm text-cream/80 mb-2">N° comprobante</label>
                <input
                  type="text"
                  value={numeroComprobante}
                  onChange={e => setNumeroComprobante(e.target.value)}
                  placeholder="Ej: B001-00155262"
                  className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-cream/80 mb-2">Notas</label>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              rows={2}
              placeholder="Observaciones opcionales..."
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Items */}
        <div className="bg-card border border-gold/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-cream font-medium">Productos comprados</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar producto
            </button>
          </div>

          <div className="space-y-3">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-2 text-xs text-muted px-1">
              <div className="col-span-5">Producto</div>
              <div className="col-span-2">Cantidad</div>
              <div className="col-span-2">Precio unit.</div>
              <div className="col-span-2">Subtotal</div>
              <div className="col-span-1" />
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <select
                    value={item.producto_id}
                    onChange={e => updateItem(index, 'producto_id', e.target.value)}
                    className="w-full bg-bg border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none transition-colors"
                  >
                    <option value="" disabled>Selecciona producto</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.codigo ? `[${p.codigo}] ` : ''}{p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.cantidad}
                    onChange={e => updateItem(index, 'cantidad', parseInt(e.target.value) || 1)}
                    className="w-full bg-bg border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.precio_unitario || ''}
                    onChange={e => updateItem(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                    placeholder="0.000"
                    className="w-full bg-bg border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <span className="text-cream text-sm font-medium">
                    S/ {item.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-muted hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t border-gold/20 flex justify-end">
            <div className="text-right">
              <p className="text-muted text-sm">Total</p>
              <p className="font-serif text-2xl text-gold">S/ {total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {loading ? 'Registrando...' : 'Registrar Compra'}
          </button>
          <Link href="/admin/compras" className="text-muted hover:text-cream transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
