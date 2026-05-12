'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createService } from '@/lib/actions/services'
import { ArrowLeft, Scissors, Clock } from 'lucide-react'

export default function NewServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const result = await createService(formData)

    if (result.success) {
      router.push('/admin/servicios')
      router.refresh()
    } else {
      setError(result.error || 'Error al crear el servicio')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/servicios"
          className="p-2 text-muted hover:text-cream transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-cream">Nuevo Servicio</h1>
          <p className="text-muted">Agrega un servicio al catálogo</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-gold/20 rounded-lg p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="nombre" className="block text-sm text-cream/80 mb-2">
              <Scissors className="w-4 h-4 inline mr-2" />
              Nombre del servicio *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
              placeholder="Ej: Mechas Brasileras"
            />
          </div>

          {/* Duration and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duracion" className="block text-sm text-cream/80 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Duración (min) *
              </label>
              <input
                type="number"
                id="duracion"
                name="duracion"
                required
                min="1"
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                placeholder="60"
              />
            </div>
            <div>
              <label htmlFor="precio" className="block text-sm text-cream/80 mb-2">
                Precio (S/) *
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                required
                min="0"
                step="0.01"
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Servicio'}
            </button>
            <Link
              href="/admin/servicios"
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
