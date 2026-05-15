'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Phone, Mail, FileText } from 'lucide-react'
import type { Cliente } from '@/types/admin'

interface CustomerFormProps {
  customer?: Cliente | null
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
  submitLabel: string
  backHref: string
  title: string
  subtitle: string
  headerActions?: React.ReactNode
}

export default function CustomerForm({
  customer,
  onSubmit,
  submitLabel,
  backHref,
  title,
  subtitle,
  headerActions,
}: CustomerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  function validate(formData: FormData): boolean {
    const errors: Record<string, string> = {}
    const nombre = (formData.get('nombre') as string)?.trim()

    if (!nombre) {
      errors.nombre = 'El nombre es obligatorio'
    } else if (nombre.length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    const email = (formData.get('email') as string)?.trim()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'El correo electrónico no es válido'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(formData: FormData) {
    setError('')
    if (!validate(formData)) {
      return
    }

    setLoading(true)
    const result = await onSubmit(formData)

    if (result.success) {
      router.push(backHref)
      router.refresh()
    } else {
      setError(result.error || 'Error al guardar el cliente')
      setLoading(false)
    }
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
          {/* Name */}
          <div>
            <label htmlFor="nombre" className="block text-sm text-cream/80 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nombre completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              defaultValue={customer?.nombre || ''}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
              placeholder="Ej: María López"
            />
            {validationErrors.nombre && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.nombre}</p>
            )}
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefono" className="block text-sm text-cream/80 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                defaultValue={customer?.telefono || ''}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                placeholder="Ej: 987654321"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-cream/80 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={customer?.email || ''}
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                placeholder="Ej: maria@email.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notas" className="block text-sm text-cream/80 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Notas
            </label>
            <textarea
              id="notas"
              name="notas"
              defaultValue={customer?.notas || ''}
              rows={4}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-none"
              placeholder="Notas adicionales sobre el cliente..."
            />
          </div>

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
