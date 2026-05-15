'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createPayment } from '@/lib/actions/payments'
import type { Servicio } from '@/types/admin'
import { ArrowLeft, CreditCard, DollarSign, Calendar, Scissors, User, Plus, X, Hash } from 'lucide-react'
import CustomerSelector from '../components/CustomerSelector'

interface PaymentService {
  servicio_id: string
  precio_aplicado: number
  nombre?: string
}

interface NewPaymentFormProps {
  services: Servicio[]
}

export default function NewPaymentForm({ services }: NewPaymentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedServices, setSelectedServices] = useState<PaymentService[]>([])
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [clienteNombre, setClienteNombre] = useState('')
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia' | 'yape'>('efectivo')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 16))
  const [numeroOperacion, setNumeroOperacion] = useState('')
  const [numeroOperacionWarning, setNumeroOperacionWarning] = useState('')

  const montoTotal = selectedServices.reduce((sum, s) => sum + s.precio_aplicado, 0)
  const showNumeroOperacion = metodoPago === 'transferencia' || metodoPago === 'yape'

  function addService() {
    if (services.length === 0) return
    const first = services[0]
    setSelectedServices(prev => [
      ...prev,
      { servicio_id: first.id, precio_aplicado: first.precio, nombre: first.nombre },
    ])
  }

  function removeService(index: number) {
    setSelectedServices(prev => prev.filter((_, i) => i !== index))
  }

  function updateService(index: number, field: 'servicio_id' | 'precio_aplicado', value: string | number) {
    setSelectedServices(prev => {
      const updated = [...prev]
      if (field === 'servicio_id') {
        const service = services.find(s => s.id === value)
        updated[index] = {
          ...updated[index],
          servicio_id: value as string,
          nombre: service?.nombre,
          precio_aplicado: service?.precio || 0,
        }
      } else {
        updated[index] = { ...updated[index], precio_aplicado: value as number }
      }
      return updated
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setNumeroOperacionWarning('')

    // Client-side validation: warn if digital payment lacks numero_operacion
    if (showNumeroOperacion && !numeroOperacion.trim()) {
      setNumeroOperacionWarning('Se recomienda ingresar el número de operación para transferencias y Yape')
    }

    const formData = new FormData()
    formData.append('monto_total', montoTotal.toString())
    formData.append('metodo_pago', metodoPago)
    if (clienteId) {
      formData.append('cliente_id', clienteId)
    }
    formData.append('cliente_nombre', clienteNombre)
    formData.append('descripcion', descripcion)
    formData.append('fecha', fecha)
    formData.append('numero_operacion', showNumeroOperacion ? numeroOperacion : '')
    formData.append('servicios', JSON.stringify(
      selectedServices.map(s => ({
        servicio_id: s.servicio_id,
        precio_aplicado: s.precio_aplicado,
      }))
    ))

    const result = await createPayment(formData)

    if (result.success) {
      router.push('/admin/pagos')
      router.refresh()
    } else {
      setError(result.error || 'Error al registrar el pago')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pagos" className="p-2 text-muted hover:text-cream transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-cream">Registrar Pago</h1>
          <p className="text-muted">Registra una nueva transacción</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-card border border-gold/20 rounded-lg p-6 space-y-6">

          {/* Cliente */}
          <div>
            <label className="block text-sm text-cream/80 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Cliente (opcional)
            </label>
            <CustomerSelector
              value={clienteId}
              onChange={(id, nombre) => {
                setClienteId(id)
                setClienteNombre(nombre || '')
              }}
              placeholder="Seleccionar cliente (dejar vacío si es walk-in)"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="metodo_pago" className="block text-sm text-cream/80 mb-2">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Método de pago *
            </label>
            <select
              id="metodo_pago"
              value={metodoPago}
              onChange={(e) => {
                const nuevoMetodo = e.target.value as 'efectivo' | 'transferencia' | 'yape'
                setMetodoPago(nuevoMetodo)
                if (nuevoMetodo === 'efectivo') {
                  setNumeroOperacion('')
                  setNumeroOperacionWarning('')
                }
              }}
              required
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="yape">Yape</option>
            </select>
          </div>

          {/* Número de operación */}
          {showNumeroOperacion && (
            <div>
              <label htmlFor="numero_operacion" className="block text-sm text-cream/80 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Número de operación (recomendado)
              </label>
              <input
                type="text"
                id="numero_operacion"
                value={numeroOperacion}
                onChange={(e) => {
                  setNumeroOperacion(e.target.value)
                  if (e.target.value.trim()) {
                    setNumeroOperacionWarning('')
                  }
                }}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                placeholder="Ej: 987654321"
              />
              {numeroOperacionWarning && (
                <p className="mt-1 text-sm text-amber-400">{numeroOperacionWarning}</p>
              )}
            </div>
          )}

          {/* Services */}
          <div className="border-t border-gold/20 pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-cream/80">
                <Scissors className="w-4 h-4 inline mr-2" />
                Servicios
              </label>
              <button
                type="button"
                onClick={addService}
                disabled={services.length === 0}
                className="flex items-center gap-1 px-3 py-1.5 bg-gold/20 text-gold rounded text-sm hover:bg-gold/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Agregar servicio
              </button>
            </div>

            {selectedServices.length === 0 ? (
              <div className="text-center py-8 bg-bg rounded-lg border border-dashed border-gold/30">
                <Scissors className="w-8 h-8 mx-auto mb-2 text-muted" />
                <p className="text-muted text-sm">No hay servicios seleccionados</p>
                <p className="text-muted text-xs mt-1">Puedes registrar el pago sin servicios</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 bg-bg rounded-lg p-3">
                    <select
                      value={service.servicio_id}
                      onChange={(e) => updateService(index, 'servicio_id', e.target.value)}
                      className="flex-1 bg-card border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre} (S/ {Number(s.precio).toFixed(2)})
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <span className="text-muted text-sm">S/</span>
                      <input
                        type="number"
                        value={service.precio_aplicado}
                        onChange={(e) => updateService(index, 'precio_aplicado', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-24 bg-card border border-gold/30 rounded px-3 py-2 text-cream text-sm focus:border-gold focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-gold/20 pt-6">
            <label className="block text-sm text-cream/80 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Monto Total (S/)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={montoTotal}
                readOnly
                className="flex-1 bg-bg border border-gold/30 rounded px-4 py-3 text-cream text-lg font-medium focus:outline-none"
              />
              <p className="text-sm text-muted">Calculado de los servicios</p>
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="fecha" className="block text-sm text-cream/80 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Fecha y hora *
            </label>
            <input
              type="datetime-local"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="descripcion" className="block text-sm text-cream/80 mb-2">
              Notas (opcional)
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-none"
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4 border-t border-gold/20">
            <button
              type="submit"
              disabled={loading}
              className="bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Registrar Pago'}
            </button>
            <Link href="/admin/pagos" className="text-muted hover:text-cream transition-colors">
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
