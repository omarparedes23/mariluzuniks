'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateService, deleteService, getService } from '@/lib/actions/services'
import type { Servicio } from '@/types/admin'
import { ArrowLeft, Scissors, Clock, Trash2 } from 'lucide-react'

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [service, setService] = useState<Servicio | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function loadService() {
      const { id } = await params
      const data = await getService(id)
      setService(data)
      setLoadingData(false)
    }
    loadService()
  }, [params])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const { id } = await params
    const result = await updateService(id, formData)

    if (result.success) {
      router.push('/admin/servicios')
      router.refresh()
    } else {
      setError(result.error || 'Error al actualizar el servicio')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.')) {
      return
    }

    const { id } = await params
    const result = await deleteService(id)

    if (result.success) {
      router.push('/admin/servicios')
      router.refresh()
    } else {
      setError(result.error || 'Error al eliminar el servicio')
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted">Cargando...</div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Servicio no encontrado</p>
        <Link href="/admin/servicios" className="text-gold hover:text-gold-light mt-4 inline-block">
          Volver a servicios
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/servicios"
            className="p-2 text-muted hover:text-cream transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-cream">Editar Servicio</h1>
            <p className="text-muted">Modifica los datos del servicio</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
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
              defaultValue={service.nombre}
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
                defaultValue={service.duracion}
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
                defaultValue={service.precio}
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
              {loading ? 'Guardando...' : 'Actualizar Servicio'}
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
