'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  DollarSign,
  Tag,
  Calendar,
  FileText,
  CreditCard,
  Receipt,
  Hash,
  Store,
} from 'lucide-react'
import type { Gasto, GastoTipoComprobante } from '@/types/admin'
import ProveedorSelector from './ProveedorSelector'

interface ExpenseFormProps {
  expense?: Gasto | null
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
  submitLabel: string
  backHref: string
  title: string
  subtitle: string
  headerActions?: React.ReactNode
}

const categorias = [
  { value: 'insumos', label: 'Insumos' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'otros', label: 'Otros' },
]

const metodosPago = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'yape', label: 'Yape' },
]

const tiposComprobante = [
  { value: 'factura', label: 'Factura' },
  { value: 'boleta', label: 'Boleta' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'sin_comprobante', label: 'Sin comprobante' },
]

export default function ExpenseForm({
  expense,
  onSubmit,
  submitLabel,
  backHref,
  title,
  subtitle,
  headerActions,
}: ExpenseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Controlled state for conditional fields
  const [metodoPago, setMetodoPago] = useState(expense?.metodo_pago || '')
  const [tipoComprobante, setTipoComprobante] = useState<GastoTipoComprobante>(
    expense?.tipo_comprobante || 'sin_comprobante'
  )
  const [proveedorId, setProveedorId] = useState<string | null>(expense?.proveedor_id || null)
  const [proveedorNombre, setProveedorNombre] = useState<string | null>(
    expense?.proveedor_nombre || null
  )
  const [numeroComprobante, setNumeroComprobante] = useState(
    expense?.numero_comprobante || ''
  )
  const [numeroOperacion, setNumeroOperacion] = useState(expense?.numero_operacion || '')

  const showNumeroComprobante = tipoComprobante !== 'sin_comprobante'
  const showNumeroOperacion = metodoPago === 'transferencia' || metodoPago === 'yape'

  function validate(formData: FormData): boolean {
    const errors: Record<string, string> = {}
    const montoStr = formData.get('monto') as string
    const monto = parseFloat(montoStr)

    if (!montoStr || isNaN(monto) || monto <= 0) {
      errors.monto = 'El monto debe ser un número mayor a 0'
    }

    const categoria = formData.get('categoria') as string
    if (!categoria) {
      errors.categoria = 'La categoría es obligatoria'
    }

    const fecha = formData.get('fecha') as string
    if (!fecha) {
      errors.fecha = 'La fecha es obligatoria'
    }

    if (!metodoPago) {
      errors.metodo_pago = 'El método de pago es obligatorio'
    }

    if (!tipoComprobante) {
      errors.tipo_comprobante = 'El tipo de comprobante es obligatorio'
    }

    if (showNumeroComprobante && !numeroComprobante.trim()) {
      errors.numero_comprobante = 'El número de comprobante es obligatorio para este tipo'
    }

    if (showNumeroOperacion && !numeroOperacion.trim()) {
      errors.numero_operacion = 'El número de operación es obligatorio para este método de pago'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(formData: FormData) {
    setError('')

    // Inject controlled field values into formData
    formData.set('metodo_pago', metodoPago)
    formData.set('tipo_comprobante', tipoComprobante)
    formData.set('proveedor_id', proveedorId || '')
    formData.set('proveedor_nombre', proveedorNombre || '')
    formData.set('numero_comprobante', showNumeroComprobante ? numeroComprobante : '')
    formData.set('numero_operacion', showNumeroOperacion ? numeroOperacion : '')

    if (!validate(formData)) {
      return
    }

    setLoading(true)
    const result = await onSubmit(formData)

    if (result.success) {
      router.push(backHref)
      router.refresh()
    } else {
      setError(result.error || 'Error al guardar el gasto')
      setLoading(false)
    }
  }

  function getDefaultDate(): string {
    if (expense?.fecha) {
      return expense.fecha.slice(0, 10)
    }
    return new Date().toISOString().slice(0, 10)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="p-2 text-muted hover:text-cream transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-cream">{title}</h1>
            <p className="text-muted">{subtitle}</p>
          </div>
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-gold/20 rounded-lg p-6 space-y-6">
          {/* Monto */}
          <div>
            <label htmlFor="monto" className="block text-sm text-cream/80 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Monto (S/) *
            </label>
            <input
              type="number"
              id="monto"
              name="monto"
              required
              min="0.01"
              step="0.01"
              defaultValue={expense?.monto || ''}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
              placeholder="Ej: 150.00"
            />
            {validationErrors.monto && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.monto}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="categoria" className="block text-sm text-cream/80 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Categoría *
            </label>
            <select
              id="categoria"
              name="categoria"
              required
              defaultValue={expense?.categoria || ''}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categorias.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {validationErrors.categoria && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.categoria}</p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label htmlFor="fecha" className="block text-sm text-cream/80 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Fecha *
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              required
              defaultValue={getDefaultDate()}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
            />
            {validationErrors.fecha && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.fecha}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm text-cream/80 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              defaultValue={expense?.descripcion || ''}
              rows={4}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-none"
              placeholder="Notas adicionales sobre el gasto..."
            />
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm text-cream/80 mb-2">
              <Store className="w-4 h-4 inline mr-2" />
              Proveedor
            </label>
            <ProveedorSelector
              proveedorId={proveedorId}
              proveedorNombre={proveedorNombre}
              onChange={(id, nombre) => {
                setProveedorId(id)
                setProveedorNombre(nombre)
              }}
            />
          </div>

          {/* Tipo de comprobante */}
          <div>
            <label htmlFor="tipo_comprobante" className="block text-sm text-cream/80 mb-2">
              <Receipt className="w-4 h-4 inline mr-2" />
              Tipo de comprobante *
            </label>
            <select
              id="tipo_comprobante"
              name="tipo_comprobante"
              required
              value={tipoComprobante}
              onChange={(e) => setTipoComprobante(e.target.value)}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
            >
              {tiposComprobante.map((tc) => (
                <option key={tc.value} value={tc.value}>
                  {tc.label}
                </option>
              ))}
            </select>
            {validationErrors.tipo_comprobante && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.tipo_comprobante}</p>
            )}
          </div>

          {/* Número de comprobante */}
          {showNumeroComprobante && (
            <div>
              <label htmlFor="numero_comprobante" className="block text-sm text-cream/80 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Número de comprobante *
              </label>
              <input
                type="text"
                id="numero_comprobante"
                name="numero_comprobante"
                value={numeroComprobante}
                onChange={(e) => setNumeroComprobante(e.target.value)}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                placeholder="Ej: F001-12345"
              />
              {validationErrors.numero_comprobante && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.numero_comprobante}</p>
              )}
            </div>
          )}

          {/* Método de pago */}
          <div>
            <label className="block text-sm text-cream/80 mb-3">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Método de pago *
            </label>
            <div className="flex gap-4 flex-wrap">
              {metodosPago.map((metodo) => (
                <label
                  key={metodo.value}
                  className="flex items-center gap-2 px-4 py-3 bg-bg border border-gold/30 rounded cursor-pointer hover:border-gold/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="metodo_pago"
                    value={metodo.value}
                    required
                    checked={metodoPago === metodo.value}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="accent-gold"
                  />
                  <span className="text-cream text-sm">{metodo.label}</span>
                </label>
              ))}
            </div>
            {validationErrors.metodo_pago && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.metodo_pago}</p>
            )}
          </div>

          {/* Número de operación */}
          {showNumeroOperacion && (
            <div>
              <label htmlFor="numero_operacion" className="block text-sm text-cream/80 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Número de operación *
              </label>
              <input
                type="text"
                id="numero_operacion"
                name="numero_operacion"
                value={numeroOperacion}
                onChange={(e) => setNumeroOperacion(e.target.value)}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                placeholder="Ej: 987654321"
              />
              {validationErrors.numero_operacion && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.numero_operacion}</p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4 border-t border-gold/20">
            <button
              type="submit"
              disabled={loading}
              className="bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : submitLabel}
            </button>
            <Link
              href={backHref}
              className="text-muted hover:text-cream transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
