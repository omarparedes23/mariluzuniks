'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createControlSesion } from '@/lib/actions/control-stock'
import type { CreateControlSesionInput } from '@/types/admin'
import { ArrowLeft, ClipboardList } from 'lucide-react'

const today = new Date().toISOString().split('T')[0]

export default function NuevoControlForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fechaInicio, setFechaInicio] = useState(today)
  const [fechaFin, setFechaFin] = useState(today)
  const [notas, setNotas] = useState('')
  const [fechaError, setFechaError] = useState('')

  function validateFechas(inicio: string, fin: string): boolean {
    if (fin < inicio) {
      setFechaError('La fecha de fin debe ser igual o posterior a la fecha de inicio.')
      return false
    }
    setFechaError('')
    return true
  }

  function handleFechaInicio(value: string) {
    setFechaInicio(value)
    validateFechas(value, fechaFin)
  }

  function handleFechaFin(value: string) {
    setFechaFin(value)
    validateFechas(fechaInicio, value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateFechas(fechaInicio, fechaFin)) return

    setLoading(true)
    setError('')

    const input: CreateControlSesionInput = {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      notas: notas.trim() || undefined,
    }

    const result = await createControlSesion(input)

    if (result.success) {
      router.push(`/admin/control-stock/${result.data!.id}`)
    } else {
      setError(result.error || 'Error al crear la sesión de control')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/control-stock" className="p-2 text-muted hover:text-cream transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-cream">Nueva Sesión de Control</h1>
          <p className="text-muted">Define el período y crea la sesión de inventario</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div className="bg-card border border-gold/20 rounded-lg p-6 space-y-5">
          <h2 className="text-cream font-medium">Datos de la sesión</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-cream/80 mb-2">Fecha de inicio *</label>
              <input
                type="date"
                required
                value={fechaInicio}
                onChange={e => handleFechaInicio(e.target.value)}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">Fecha de fin *</label>
              <input
                type="date"
                required
                value={fechaFin}
                onChange={e => handleFechaFin(e.target.value)}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
              />
            </div>
          </div>

          {fechaError && (
            <p className="text-red-400 text-sm">{fechaError}</p>
          )}

          <div>
            <label className="block text-sm text-cream/80 mb-2">Notas</label>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              rows={3}
              placeholder="Observaciones opcionales..."
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || !!fechaError}
            className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ClipboardList className="w-4 h-4" />
            {loading ? 'Creando sesión...' : 'Crear Sesión'}
          </button>
          <Link href="/admin/control-stock" className="text-muted hover:text-cream transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
